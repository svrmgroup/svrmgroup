import { Helmet } from "react-helmet-async";

const SITE_URL = "https://svrm.group";

interface SeoArticle {
  publishedTime?: string;
  section?: string;
  author?: string;
}

interface SeoProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  /** Absolute or relative URL. Relative is resolved against https://svrm.group. */
  image?: string;
  type?: "website" | "article";
  article?: SeoArticle;
  jsonLd?: object | object[];
}

function toAbsolute(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url, SITE_URL).toString();
  } catch {
    return undefined;
  }
}

export function Seo({
  title,
  description,
  path,
  keywords,
  image,
  type = "website",
  article,
  jsonLd,
}: SeoProps) {
  const url = `${SITE_URL}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const ogImage = toAbsolute(image);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:secure_url" content={ogImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {type === "article" && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === "article" && article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      {type === "article" && article?.author && (
        <meta property="article:author" content={article.author} />
      )}

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
