import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import { posts, categories, type BlogCategory, type BlogPost } from "@/data/blog";
import { Seo } from "@/components/Seo";
import SmartImage from "@/components/svrm/SmartImage";
import { useCmsItems } from "@/hooks/useCmsItems";
import { resolveImage } from "@/lib/cmsImages";

const Blog = () => {
  const [params] = useSearchParams();
  const [active, setActive] = useState<BlogCategory | "All">("All");
  const { items: cmsBlogs } = useCmsItems("blogs");

  const merged: BlogPost[] = useMemo(() => {
    const staticImageBySlug = new Map(posts.map((p) => [p.slug, p.image]));
    const cmsMapped: BlogPost[] = cmsBlogs.map((c) => ({
      slug: c.slug,
      title: c.title,
      excerpt: c.summary || "",
      category: ((c.category as BlogCategory) || "Insights"),
      date: new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      publishedISO: c.created_at.slice(0, 10),
      image: resolveImage(c.image_url, staticImageBySlug.get(c.slug)) ?? "",
      readTime: "5 min read",
      intro: c.summary || "",
      sections: c.description ? [{ body: c.description }] : [],
    }));
    // CMS entries override same-slug static posts
    const cmsSlugs = new Set(cmsMapped.map(p => p.slug));
    return [...cmsMapped, ...posts.filter(p => !cmsSlugs.has(p.slug))];
  }, [cmsBlogs]);

  const filtered = active === "All" ? merged : merged.filter((p) => p.category === active);


  useEffect(() => {
    const cat = params.get("cat");
    if (!cat) return;
    if (cat === "All" || (categories as string[]).includes(cat)) {
      setActive(cat as BlogCategory | "All");
    }
  }, [params]);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The SVRM Journal",
    url: "https://svrm.group/blog",
    description: "Field notes on luxury travel, private tours, stays and lifestyle in Cape Town.",
    publisher: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.seoDescription ?? p.excerpt,
      url: `https://svrm.group/blog/${p.slug}`,
      datePublished: p.publishedISO ?? p.date,
      articleSection: p.category,
      ...(p.image ? { image: new URL(p.image, "https://svrm.group").toString() } : {}),
    })),
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo title={"The SVRM Journal — Luxury Travel & Lifestyle Cape Town"} description={"The SVRM Journal — field notes, luxury travel recommendations and observations from our Cape Town concierge team. Insights on tours, stays, chauffeur and bespoke experiences."} path="/blog" keywords="SVRM Journal, Cape Town luxury travel blog, South Africa travel guide, safari blog, Garden Route guide, luxury villa guide Cape Town, concierge insights, Cape Town travel tips" jsonLd={blogJsonLd} />
    <Nav />
      <PageHero
        eyebrow="Journal · Luxury Travel & Lifestyle Notes from Cape Town"
        title="Notes from the concierge."
        subtitle="Field notes on luxury travel, private tours, stays and lifestyle in Cape Town — published as we have something worth saying."
      />

      <section className="pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 border-b border-border/40 pb-6">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.24em] transition-colors ${
                  active === c
                    ? "text-foreground border-b border-primary -mb-[25px]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((p) => (
              <Link to={`/blog/${p.slug}`} key={p.slug} className="group block">
                <article>
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <SmartImage
                      src={p.image}
                      alt={p.title}
                      wrapperClassName="absolute inset-0 w-full h-full"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-105"
                    />
                  </div>
                  <p className="eyebrow mt-6">{p.category} · {p.date} · {p.readTime}</p>
                  <h2 className="font-serif text-2xl mt-3 text-foreground group-hover:text-gold transition-colors">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
                  <span className="inline-block mt-5 text-xs uppercase tracking-[0.24em] text-gold border-b border-primary/40 pb-1">
                    Read
                  </span>
                </article>
              </Link>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground/60 mt-20 max-w-xl mx-auto">
            New entries appear regularly. For private recommendations, message the concierge.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;
