import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ProjectRealizationViewer from "@/components/sections/ProjectRealizationViewer/ProjectRealizationViewer";
import type { ProjectRealizationSlide } from "@/components/sections/ProjectRealizationViewer/ProjectRealizationViewer";
import { defaultLocale, localizeField } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { sanitizeRichTextHtml } from "@/lib/sanitize-html";
import { verifyProjectPreviewToken } from "@/lib/preview-token";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; token?: string }>;
}

const getProject = async (slug: string, allowDraftPreview = false) =>
  prisma.project.findFirst({
    where: {
      slug,
      ...(allowDraftPreview ? {} : { publishedAt: { not: null } }),
    },
    include: {
      slides: {
        orderBy: { order: "asc" },
      },
    },
  });

export const generateMetadata = async ({
  params,
}: ProjectPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const project = await getProject(slug).catch(() => null);

  if (!project) {
    return { title: "Réalisation introuvable — Studio Volante" };
  }

  return {
    title: `${project.title} — Studio Volante`,
    description: project.description,
  };
};

const ProjectDetailPage = async ({ params, searchParams }: ProjectPageProps) => {
  const { slug } = await params;
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;
  const previewParams = searchParams ? await searchParams : {};
  const allowDraftPreview =
    previewParams.preview === "true" &&
    verifyProjectPreviewToken(previewParams.token, slug);
  const project = await getProject(slug, allowDraftPreview).catch(() => null);

  if (!project) notFound();

  const projectTitle = localizeField(project.title, project.titleEn, locale);
  const projectDescription = localizeField(project.description, project.descriptionEn, locale);

  const slides: ProjectRealizationSlide[] =
    project.slides.length > 0
      ? project.slides.map((slide) => ({
          id: slide.id,
          title: localizeField(slide.title, slide.titleEn, locale),
          contentHtml: sanitizeRichTextHtml(
            localizeField(slide.contentHtml, slide.contentHtmlEn, locale),
          ),
          mediaType: slide.mediaType,
          mediaUrl: slide.mediaUrl,
          posterUrl: slide.posterUrl,
          alt: localizeField(slide.alt ?? "", slide.altEn, locale) || null,
        }))
      : [
          {
            id: `${project.id}-fallback`,
            title: projectTitle,
            contentHtml: sanitizeRichTextHtml(`<p>${projectDescription}</p>`),
            mediaType: "IMAGE",
            mediaUrl: project.imageUrl,
            alt: projectTitle,
          },
        ];

  return <ProjectRealizationViewer projectTitle={projectTitle} slides={slides} />;
};

export default ProjectDetailPage;
