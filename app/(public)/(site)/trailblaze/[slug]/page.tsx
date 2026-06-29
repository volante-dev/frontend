import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrailblazeArticle from "@/components/sections/Trailblaze/TrailblazeArticle";
import prisma from "@/lib/prisma";
import { localizeField } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n-config";
import { sanitizeRichTextHtml } from "@/lib/sanitize-html";
import { verifyPreviewToken } from "@/lib/preview-token";
import JsonLd from "@/components/seo/JsonLd";
import {
  blogPostPath,
  createPageMetadata,
  getBreadcrumbJsonLd,
  siteName,
  siteUrl,
  toAbsoluteUrl,
} from "@/lib/seo";
import { getLocalizedRouteHref } from "@/lib/site-route-config";
import { getSiteRoutes } from "@/lib/site-routes";

export const dynamic = "force-dynamic";

type TrailblazeArticlePageProps = {
  params: Promise<{ slug: string; locale?: string }>;
  searchParams?: Promise<{ preview?: string; token?: string }>;
};

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

const compact = <T extends Record<string, unknown>>(value: T): T =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === null || entry === "") return false;
      if (Array.isArray(entry)) return entry.length > 0;
      return true;
    }),
  ) as T;

const getPost = async (
  slug: string,
  allowDraftPreview = false,
) =>
  prisma.blogPost.findFirst({
    where: {
      OR: [{ slug }, { slugEn: slug }],
      ...(allowDraftPreview ? {} : { publishedAt: { not: null } }),
    },
    include: {
      coverMediaAsset: true,
      blocks: {
        orderBy: { order: "asc" },
        include: { mediaAsset: true },
      },
    },
  });

const getDescription = (
  seoDescription: string | null,
  seoDescriptionEn: string | null,
  blocks: Array<{ contentHtml: string | null; contentHtmlEn: string | null }>,
  locale: "fr" | "en",
  fallback: string,
) => {
  const explicitDescription = localizeField(
    seoDescription ?? "",
    seoDescriptionEn,
    locale,
  ).trim();
  if (explicitDescription) return explicitDescription;

  const richText = blocks.find((block) => block.contentHtml);
  if (!richText?.contentHtml) return fallback;
  return stripHtml(
    localizeField(richText.contentHtml, richText.contentHtmlEn, locale),
  ).slice(0, 180);
};

const getSeoImage = ({
  coverMediaUrl,
  coverMediaType,
  posterUrl,
}: {
  coverMediaUrl: string;
  coverMediaType: "IMAGE" | "VIDEO";
  posterUrl?: string | null;
}) => {
  if (coverMediaType === "IMAGE") return coverMediaUrl;
  return posterUrl ?? "/opengraph-image";
};

const getOrganizationNode = () => ({
  "@type": "Organization",
  "@id": `${siteUrl.origin}/#organization`,
  name: siteName,
  url: siteUrl.origin,
  logo: toAbsoluteUrl("/favicon.ico"),
});

export const generateMetadata = async ({
  params,
  searchParams,
}: TrailblazeArticlePageProps): Promise<Metadata> => {
  const { slug, locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const query = searchParams ? await searchParams : {};
  const [post, siteRoutes] = await Promise.all([
    getPost(slug).catch(() => null),
    getSiteRoutes(),
  ]);

  if (!post) {
    return {
      title: locale === "en" ? "Article not found" : "Article introuvable",
      robots: { index: false, follow: false },
    };
  }

  const title = localizeField(post.title, post.titleEn, locale);
  const description = getDescription(
    post.seoDescription,
    post.seoDescriptionEn,
    post.blocks,
    locale,
    title,
  );
  const coverMediaType =
    post.coverMediaAsset?.mediaType ?? inferMediaTypeFromUrl(post.coverMediaUrl);
  const image = getSeoImage({
    coverMediaUrl: post.coverMediaUrl,
    coverMediaType,
    posterUrl: post.coverMediaAsset?.posterUrl,
  });

  return createPageMetadata({
    locale,
    pathname: blogPostPath(
      locale,
      locale === "en" ? post.slugEn : post.slug,
      siteRoutes,
    ),
    alternatePathname: blogPostPath(
      locale === "fr" ? "en" : "fr",
      locale === "fr" ? post.slugEn : post.slug,
      siteRoutes,
    ),
    title,
    description,
    image,
    type: "article",
    noIndex: query.preview === "true" || Boolean(query.token),
  });
};

const TrailblazeArticlePage = async ({
  params,
  searchParams,
}: TrailblazeArticlePageProps) => {
  const { slug, locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const previewParams = searchParams ? await searchParams : {};
  const allowDraftPreview =
    previewParams.preview === "true" &&
    verifyPreviewToken(previewParams.token, slug);
  const [post, siteRoutes] = await Promise.all([
    getPost(slug, allowDraftPreview).catch(() => null),
    getSiteRoutes(),
  ]);

  if (!post) notFound();

  const articleTitle = localizeField(post.title, post.titleEn, locale);
  const articleEyebrow = localizeField(post.eyebrow, post.eyebrowEn, locale);
  const articleTags = locale === "en" ? post.tagsEn : post.tags;
  const description = getDescription(
    post.seoDescription,
    post.seoDescriptionEn,
    post.blocks,
    locale,
    articleTitle,
  );
  const articlePath = blogPostPath(
    locale,
    locale === "en" ? post.slugEn : post.slug,
    siteRoutes,
  );
  const absoluteArticleUrl = toAbsoluteUrl(articlePath);
  const breadcrumb = getBreadcrumbJsonLd(locale, [
    {
      name: locale === "en" ? "Home" : "Accueil",
      path: getLocalizedRouteHref(siteRoutes, locale, "home"),
    },
    {
      name: "Trailblaze",
      path: getLocalizedRouteHref(siteRoutes, locale, "trailblaze"),
    },
    { name: articleTitle, path: articlePath },
  ]);
  const coverMediaType =
    post.coverMediaAsset?.mediaType ?? inferMediaTypeFromUrl(post.coverMediaUrl);
  const seoImage = getSeoImage({
    coverMediaUrl: post.coverMediaUrl,
    coverMediaType,
    posterUrl: post.coverMediaAsset?.posterUrl,
  });
  const organizationNode = getOrganizationNode();
  const blogPosting = compact({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteArticleUrl}#article`,
    headline: articleTitle,
    description,
    url: absoluteArticleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteArticleUrl,
    },
    image: [toAbsoluteUrl(seoImage)],
    inLanguage: locale === "fr" ? "fr-FR" : "en-GB",
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    keywords: articleTags,
    author: organizationNode,
    publisher: organizationNode,
  });

  const blocks = post.blocks.map((block) => ({
    id: block.id,
    type: block.type,
    contentHtml: block.contentHtml
      ? sanitizeRichTextHtml(
          localizeField(block.contentHtml, block.contentHtmlEn, locale),
        )
      : null,
    mediaUrl: block.mediaUrl,
    posterUrl: block.mediaAsset?.posterUrl ?? null,
    alt:
      block.mediaAsset && block.type === "IMAGE"
        ? localizeField(
            block.mediaAsset.alt ?? articleTitle,
            block.mediaAsset.altEn,
            locale,
          )
        : null,
  }));

  return (
    <>
      <JsonLd data={[breadcrumb, blogPosting]} />
      <TrailblazeArticle
        locale={locale}
        article={{
          title: articleTitle,
          eyebrow: articleEyebrow,
          publishedAt: post.publishedAt?.toISOString() ?? null,
          tags: articleTags,
          blocks,
        }}
      />
    </>
  );
};

export default TrailblazeArticlePage;
