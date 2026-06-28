import { Link, useParams } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import { Seo } from "@/components/Seo";
import { posts } from "@/data/blog";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/whatsapp";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <Nav />
        <section className="max-w-3xl mx-auto px-6 py-40 text-center">
          <p className="eyebrow">Not found</p>
          <h1 className="font-serif text-4xl mt-4">This entry has moved.</h1>
          <Link to="/blog" className="inline-block mt-8 text-gold text-xs uppercase tracking-[0.24em] border-b border-primary/40 pb-1">
            Back to the journal
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const related = posts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  const wa = waLink(`Hello SVRM — I read "${post.title}" on the Journal and would like to open a conversation.`);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={`${post.title} — SVRM Journal`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image}
      />
      <Nav />

      <article>
        {/* Hero */}
        <header className="relative h-[70vh] min-h-[480px] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-6 pb-16 w-full">
              <p className="eyebrow text-gold">{post.category} · {post.date} · {post.readTime}</p>
              <h1 className="font-serif text-4xl md:text-6xl mt-4 leading-tight text-foreground max-w-3xl">
                {post.title}
              </h1>
            </div>
          </div>
        </header>

        {/* Body */}
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-6">
            <p className="font-serif text-2xl md:text-3xl leading-snug text-foreground">
              {post.intro}
            </p>

            <div className="mt-14 space-y-12">
              {post.sections.map((s, i) => (
                <div key={i}>
                  {s.heading && (
                    <h2 className="font-serif text-2xl text-foreground mb-4">{s.heading}</h2>
                  )}
                  <p className="text-base text-muted-foreground leading-[1.85]">{s.body}</p>
                </div>
              ))}
            </div>

            {post.closing && (
              <div className="mt-16 pt-10 border-t border-border/40">
                <p className="text-base text-foreground/90 leading-[1.85] italic">
                  {post.closing}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 flex flex-col sm:flex-row gap-4 items-start">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href={wa} target="_blank" rel="noopener noreferrer">Message the concierge</a>
              </Button>
              <Link
                to="/blog"
                className="inline-flex items-center text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-gold border-b border-border pb-1 pt-3"
              >
                ← Back to the journal
              </Link>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="pb-28">
            <div className="max-w-5xl mx-auto px-6">
              <p className="eyebrow text-center mb-10">More from {post.category}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {related.map((p) => (
                  <Link to={`/blog/${p.slug}`} key={p.slug} className="group">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-105"
                      />
                    </div>
                    <p className="eyebrow mt-5">{p.category} · {p.date}</p>
                    <h3 className="font-serif text-2xl mt-2 text-foreground group-hover:text-gold transition-colors">
                      {p.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer />
    </main>
  );
};

export default BlogPost;
