import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectRealizationViewer from "@/components/sections/ProjectRealizationViewer/ProjectRealizationViewer";
import type { ProjectRealizationSlide } from "@/components/sections/ProjectRealizationViewer/ProjectRealizationViewer";
import { localizeField } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n-config";
import prisma from "@/lib/prisma";
import { sanitizeRichTextHtml } from "@/lib/sanitize-html";
import { verifyProjectPreviewToken } from "@/lib/preview-token";
import JsonLd from "@/components/seo/JsonLd";
import {
  createPageMetadata,
  getBreadcrumbJsonLd,
  projectPath,
  siteUrl,
  toAbsoluteUrl,
} from "@/lib/seo";
import { getLocalizedHref } from "@/lib/i18n-routes";

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
      imageAsset: true,
      sectorEntry: true,
      locationEntry: true,
      deliveredServiceEntries: { orderBy: { label: "asc" } },
      slides: {
        orderBy: { order: "asc" },
        include: {
          mediaAsset: true,
          posterAsset: true,
        },
      },
    },
  });

export const generateMetadata = async ({
  params,
  searchParams,
}: ProjectPageProps): Promise<Metadata> => {
  const { slug, locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const query = searchParams ? await searchParams : {};
  const project = await getProject(slug).catch(() => null);

  if (!project) {
    return {
      title: locale === "en" ? "Project not found" : "Réalisation introuvable",
      robots: { index: false, follow: false },
    };
  }

  const title = localizeField(project.title, project.titleEn, locale);
  const description = localizeField(
    project.description,
    project.descriptionEn,
    locale,
  );

  return createPageMetadata({
    locale,
    pathname: projectPath(locale, slug),
    alternatePathname: projectPath(locale === "fr" ? "en" : "fr", slug),
    title,
    description,
    image: project.imageUrl,
    type: "article",
    noIndex: query.preview === "true" || Boolean(query.token),
  });
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

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
  const sector = project.sectorEntry
    ? localizeField(project.sectorEntry.label, project.sectorEntry.labelEn, locale)
    : "";
  const location = project.locationEntry
    ? localizeField(project.locationEntry.label, project.locationEntry.labelEn, locale)
    : "";
  const services = project.deliveredServiceEntries.map((entry) =>
    localizeField(entry.label, entry.labelEn, locale),
  );
  const challenge = localizeField(project.challenge ?? "", project.challengeEn, locale);
  const approach = localizeField(project.approach ?? "", project.approachEn, locale);
  const results = localizeField(project.results ?? "", project.resultsEn, locale);
  const awards = localizeField(project.awards ?? "", project.awardsEn, locale);
  const caseStudySections = [
    {
      title: locale === "en" ? "The challenge" : "La problématique",
      value: challenge,
    },
    { title: locale === "en" ? "Our approach" : "Notre approche", value: approach },
    { title: locale === "en" ? "Results" : "Résultats", value: results },
  ].filter((section) => section.value);
  const caseStudyHtml = caseStudySections
    .map(
      ({ title, value }) =>
        `<h3>${escapeHtml(title)}</h3><p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  const slides: ProjectRealizationSlide[] =
    project.slides.length > 0
      ? project.slides.map((slide, index) => ({
          id: slide.id,
          title: localizeField(slide.title, slide.titleEn, locale),
          contentHtml: sanitizeRichTextHtml(
            `${localizeField(slide.contentHtml, slide.contentHtmlEn, locale)}${index === 0 ? caseStudyHtml : ""}`,
          ),
          mediaType: slide.mediaType,
          mediaUrl: slide.mediaUrl,
          posterUrl: slide.posterUrl,
          alt:
            localizeField(
              slide.mediaAsset?.alt ?? slide.alt ?? "",
              slide.mediaAsset?.altEn ?? slide.altEn,
              locale,
            ) || null,
        }))
      : [
          {
            id: `${project.id}-fallback`,
            title: projectTitle,
            contentHtml: sanitizeRichTextHtml(`<p>${projectDescription}</p>`),
            mediaType: "IMAGE",
            mediaUrl: project.imageUrl,
            alt: localizeField(
              project.imageAsset?.alt ?? projectTitle,
              project.imageAsset?.altEn,
              locale,
            ),
          },
        ];

  const facts = [
    { label: locale === "en" ? "Client" : "Client", value: project.clientName },
    { label: locale === "en" ? "Sector" : "Secteur", value: sector },
    {
      label: locale === "en" ? "Year" : "Année",
      value: project.projectYear ? String(project.projectYear) : null,
    },
    { label: locale === "en" ? "Location" : "Localisation", value: location },
    {
      label: locale === "en" ? "Services" : "Services",
      value: services.length ? services.join(", ") : null,
    },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  const pathname = projectPath(locale, slug);
  const breadcrumb = getBreadcrumbJsonLd(locale, [
    { name: locale === "en" ? "Home" : "Accueil", path: getLocalizedHref(locale, "home") },
    { name: "Portfolio", path: getLocalizedHref(locale, "portfolio") },
    { name: projectTitle, path: pathname },
  ]);
  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${toAbsoluteUrl(pathname)}#project`,
    name: projectTitle,
    description: projectDescription,
    url: toAbsoluteUrl(pathname),
    mainEntityOfPage: toAbsoluteUrl(pathname),
    image: project.imageUrl,
    inLanguage: locale === "fr" ? "fr-FR" : "en-GB",
    datePublished: project.publishedAt?.toISOString(),
    dateModified: project.updatedAt.toISOString(),
    dateCreated: project.projectYear ? String(project.projectYear) : undefined,
    keywords: [...project.tags, ...services],
    about: sector || undefined,
    locationCreated: location || undefined,
    award: awards || undefined,
    sameAs: project.externalUrl || undefined,
    creator: { "@id": `${siteUrl.origin}/#organization` },
    creditText: project.credits || undefined,
    video: project.slides
      .filter((slide) => slide.mediaType === "VIDEO" && slide.posterUrl)
      .map((slide) => ({
        "@type": "VideoObject",
        name: localizeField(slide.title, slide.titleEn, locale),
        description: stripHtml(
          localizeField(slide.contentHtml, slide.contentHtmlEn, locale),
        ),
        thumbnailUrl: slide.posterUrl,
        contentUrl: slide.mediaUrl,
        uploadDate: project.publishedAt?.toISOString(),
        inLanguage: locale === "fr" ? "fr-FR" : "en-GB",
      })),
  };

  return (
    <>
      <JsonLd data={[breadcrumb, creativeWork]} />
      <ProjectRealizationViewer
        projectTitle={projectTitle}
        projectDescription={projectDescription}
        facts={facts}
        slides={slides}
      />
    </>
  );
};

export default ProjectDetailPage;
