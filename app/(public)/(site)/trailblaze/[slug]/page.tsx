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
  siteUrl,
  toAbsoluteUrl,
} from "@/lib/seo";
import { getLocalizedHref } from "@/lib/i18n-routes";

export const dynamic = "force-dynamic";

type TrailblazeArticlePageProps = {
  params: Promise<{ slug: string; locale?: string }>;
  searchParams?: Promise<{ preview?: string; token?: string }>;
};

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

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
  blocks: Array<{ contentHtml: string | null; contentHtmlEn: string | null }>,
  locale: "fr" | "en",
  fallback: string,
) => {
  const richText = blocks.find((block) => block.contentHtml);
  if (!richText?.contentHtml) return fallback;
  return stripHtml(
    localizeField(richText.contentHtml, richText.contentHtmlEn, locale),
  ).slice(0, 180);
};

export const generateMetadata = async ({
  params,
  searchParams,
}: TrailblazeArticlePageProps): Promise<Metadata> => {
  const { slug, locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const query = searchParams ? await searchParams : {};
  const post = await getPost(slug).catch(() => null);

  if (!post) {
    return {
      title: locale === "en" ? "Article not found" : "Article introuvable",
      robots: { index: false, follow: false },
    };
  }

  const title = localizeField(post.title, post.titleEn, locale);
  const description = getDescription(post.blocks, locale, title);
  const coverMediaType =
    post.coverMediaAsset?.mediaType ?? inferMediaTypeFromUrl(post.coverMediaUrl);
  const image =
    coverMediaType === "VIDEO"
      ? post.coverMediaAsset?.posterUrl ?? post.coverMediaUrl
      : post.coverMediaUrl;

  return createPageMetadata({
    locale,
    pathname: blogPostPath(locale, locale === "en" ? post.slugEn : post.slug),
    alternatePathname: blogPostPath(locale === "fr" ? "en" : "fr", locale === "fr" ? post.slugEn : post.slug),
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
  const post = await getPost(slug, allowDraftPreview).catch(() => null);

  if (!post) notFound();

  const articleTitle = localizeField(post.title, post.titleEn, locale);
  const articleEyebrow = localizeField(post.eyebrow, post.eyebrowEn, locale);
  const description = getDescription(post.blocks, locale, articleTitle);
  const articlePath = blogPostPath(locale, locale === "en" ? post.slugEn : post.slug);
  const breadcrumb = getBreadcrumbJsonLd(locale, [
    { name: locale === "en" ? "Home" : "Accueil", path: getLocalizedHref(locale, "home") },
    { name: "Trailblaze", path: getLocalizedHref(locale, "trailblaze") },
    { name: articleTitle, path: articlePath },
  ]);
  const coverMediaType =
    post.coverMediaAsset?.mediaType ?? inferMediaTypeFromUrl(post.coverMediaUrl);
  const seoImage =
    coverMediaType === "VIDEO"
      ? post.coverMediaAsset?.posterUrl ?? post.coverMediaUrl
      : post.coverMediaUrl;
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${toAbsoluteUrl(articlePath)}#article`,
    headline: articleTitle,
    description,
    url: toAbsoluteUrl(articlePath),
    mainEntityOfPage: toAbsoluteUrl(articlePath),
    image: seoImage,
    inLanguage: locale === "fr" ? "fr-FR" : "en-GB",
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@id": `${siteUrl.origin}/#organization` },
    publisher: { "@id": `${siteUrl.origin}/#organization` },
  };

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
        ? localizeField(block.mediaAsset.alt ?? articleTitle, block.mediaAsset.altEn, locale)
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
          blocks,
        }}
      />
    </>
  );
};

export default TrailblazeArticlePage;
