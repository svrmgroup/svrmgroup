import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import { posts, categories, type BlogCategory } from "@/data/blog";
import { Seo } from "@/components/Seo";

const Blog = () => {
  const [active, setActive] = useState<BlogCategory | "All">("All");
  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo title={"The SVRM Journal — Luxury Travel & Lifestyle Cape Town"} description={"The SVRM Journal — field notes, luxury travel recommendations and observations from our Cape Town concierge team. Insights on tours, stays, chauffeur and bespoke experiences."} path="/blog" />
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
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
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
