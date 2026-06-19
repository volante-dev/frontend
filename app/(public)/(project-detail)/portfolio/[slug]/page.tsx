import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectRealizationViewer from "@/components/sections/ProjectRealizationViewer/ProjectRealizationViewer";
import type { ProjectRealizationSlide } from "@/components/sections/ProjectRealizationViewer/ProjectRealizationViewer";
import { localizeField } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n-config";
import prisma from "@/lib/prisma";
import { sanitizeRichTextHtml } from "@/lib/sanitize-html";
import { verifyProjectPreviewToken } from "@/lib/preview-token";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string; locale?: string }>;
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
  const { slug, locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
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
