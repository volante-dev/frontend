import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectRealizationViewer from "@/components/sections/ProjectRealizationViewer/ProjectRealizationViewer";
import type { ProjectRealizationSlide } from "@/components/sections/ProjectRealizationViewer/ProjectRealizationViewer";
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
import { getLocalizedRouteHref } from "@/lib/site-route-config";
import { getSiteRoutes } from "@/lib/site-routes";
import { localizedTranslationField } from "@/lib/content-translations";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string; locale?: string }>;
  searchParams?: Promise<{ preview?: string; token?: string }>;
}

const getProject = async (slug: string, allowDraftPreview = false) =>
  prisma.project.findFirst({
    where: {
      OR: [{ slug }, { translations: { some: { slug } } }],
      ...(allowDraftPreview ? {} : { publishedAt: { not: null } }),
    },
    include: {
      translations: true,
      imageAsset: { include: { translations: true } },
      sectorEntry: { include: { translations: true } },
      locationEntry: { include: { translations: true } },
      deliveredServiceEntries: {
        orderBy: { label: "asc" },
        include: { translations: true },
      },
      slides: {
        orderBy: { order: "asc" },
        include: {
          translations: true,
          mediaAsset: { include: { translations: true } },
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
  const [project, siteRoutes] = await Promise.all([
    getProject(slug).catch(() => null),
    getSiteRoutes(),
  ]);

  if (!project) {
    return {
      title: locale === "en" ? "Project not found" : "Réalisation introuvable",
      robots: { index: false, follow: false },
    };
  }

  const localizedSlug = localizedTranslationField(
    project.translations,
    locale,
    "slug",
    project.slug,
  );
  const title = localizedTranslationField(
    project.translations,
    locale,
    "title",
    project.title,
  );
  const description = localizedTranslationField(
    project.translations,
    locale,
    "description",
    project.description,
  );
  const coverMediaType =
    project.imageAsset?.mediaType ?? inferMediaTypeFromUrl(project.imageUrl);
  const metadataImage =
    coverMediaType === "VIDEO"
      ? project.imageAsset?.posterUrl ?? project.imageUrl
      : project.imageUrl;

  return createPageMetadata({
    locale,
    pathname: projectPath(locale, localizedSlug, siteRoutes),
    alternatePathname: projectPath(
      locale === "fr" ? "en" : "fr",
      project.slug,
      siteRoutes,
    ),
    title,
    description,
    image: metadataImage,
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

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

const ProjectDetailPage = async ({ params, searchParams }: ProjectPageProps) => {
  const { slug, locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const previewParams = searchParams ? await searchParams : {};
  const allowDraftPreview =
    previewParams.preview === "true" &&
    verifyProjectPreviewToken(previewParams.token, slug);
  const [project, siteRoutes] = await Promise.all([
    getProject(slug, allowDraftPreview).catch(() => null),
    getSiteRoutes(),
  ]);

  if (!project) notFound();

  const localizedSlug = localizedTranslationField(
    project.translations,
    locale,
    "slug",
    project.slug,
  );
  const projectTitle = localizedTranslationField(
    project.translations,
    locale,
    "title",
    project.title,
  );
  const projectDescription = localizedTranslationField(
    project.translations,
    locale,
    "description",
    project.description,
  );
  const coverMediaType =
    project.imageAsset?.mediaType ?? inferMediaTypeFromUrl(project.imageUrl);
  const seoImage =
    coverMediaType === "VIDEO"
      ? project.imageAsset?.posterUrl ?? project.imageUrl
      : project.imageUrl;
  const sector = project.sectorEntry
    ? localizedTranslationField(
        project.sectorEntry.translations,
        locale,
        "label",
        project.sectorEntry.label,
      )
    : "";
  const location = project.locationEntry
    ? localizedTranslationField(
        project.locationEntry.translations,
        locale,
        "label",
        project.locationEntry.label,
      )
    : "";
  const services = project.deliveredServiceEntries.map((entry) =>
    localizedTranslationField(
      entry.translations,
      locale,
      "label",
      entry.label,
    ),
  );
  const challenge = localizedTranslationField(
    project.translations,
    locale,
    "challenge",
    project.challenge ?? "",
  );
  const approach = localizedTranslationField(
    project.translations,
    locale,
    "approach",
    project.approach ?? "",
  );
  const results = localizedTranslationField(
    project.translations,
    locale,
    "results",
    project.results ?? "",
  );
  const awards = localizedTranslationField(
    project.translations,
    locale,
    "awards",
    project.awards ?? "",
  );
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
          title: localizedTranslationField(
            slide.translations,
            locale,
            "title",
            slide.title,
          ),
          contentHtml: sanitizeRichTextHtml(
            `${localizedTranslationField(
              slide.translations,
              locale,
              "contentHtml",
              slide.contentHtml,
            )}${index === 0 ? caseStudyHtml : ""}`,
          ),
          mediaType: slide.mediaType,
          mediaUrl: slide.mediaUrl,
          posterUrl: slide.mediaAsset?.posterUrl ?? slide.posterUrl,
          alt:
            localizedTranslationField(
              slide.mediaAsset?.translations ?? slide.translations,
              locale,
              "alt",
              slide.mediaAsset?.alt ?? slide.alt ?? "",
            ) || null,
        }))
      : [
          {
            id: `${project.id}-fallback`,
            title: projectTitle,
            contentHtml: sanitizeRichTextHtml(`<p>${projectDescription}</p>`),
            mediaType: coverMediaType,
            mediaUrl: project.imageUrl,
            posterUrl: project.imageAsset?.posterUrl,
            alt: localizedTranslationField(
              project.imageAsset?.translations,
              locale,
              "alt",
              project.imageAsset?.alt ?? projectTitle,
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

  const pathname = projectPath(locale, localizedSlug, siteRoutes);
  const breadcrumb = getBreadcrumbJsonLd(locale, [
    {
      name: locale === "en" ? "Home" : "Accueil",
      path: getLocalizedRouteHref(siteRoutes, locale, "home"),
    },
    {
      name: "Portfolio",
      path: getLocalizedRouteHref(siteRoutes, locale, "portfolio"),
    },
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
    image: seoImage,
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
      .filter(
        (slide) =>
          slide.mediaType === "VIDEO" &&
          (slide.mediaAsset?.posterUrl || slide.posterUrl),
      )
      .map((slide) => ({
        "@type": "VideoObject",
        name: localizedTranslationField(
          slide.translations,
          locale,
          "title",
          slide.title,
        ),
        description: stripHtml(
          localizedTranslationField(
            slide.translations,
            locale,
            "contentHtml",
            slide.contentHtml,
          ),
        ),
        thumbnailUrl: slide.mediaAsset?.posterUrl ?? slide.posterUrl,
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
