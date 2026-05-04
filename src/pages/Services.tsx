import { useSearchParams } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import ServiceCard from "@/components/svrm/ServiceCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { categories, type CategorySlug } from "@/data/services";

const VALID: CategorySlug[] = ["lifestyle", "transport", "stays", "experiences"];

const Services = () => {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab") as CategorySlug | null;
  const active: CategorySlug = tabParam && VALID.includes(tabParam) ? tabParam : "lifestyle";

  const onChange = (value: string) => {
    const next = new URLSearchParams(params);
    next.set("tab", value);
    setParams(next, { replace: true });
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <PageHero
        eyebrow="Our world"
        title="Services."
        subtitle="Four disciplines, one standard. Choose where to begin — every detail is shaped to you, then quietly arranged."
      />

      <section className="pb-28 md:pb-40">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={active} onValueChange={onChange} className="w-full">
            <TabsList className="bg-transparent p-0 h-auto flex flex-wrap justify-center gap-2 md:gap-8 border-b border-border/40 rounded-none w-full">
              {categories.map((c) => (
                <TabsTrigger
                  key={c.slug}
                  value={c.slug}
                  className="rounded-none bg-transparent px-4 py-5 text-xs uppercase tracking-[0.28em] text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary -mb-[1px] transition-colors"
                >
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((c) => (
              <TabsContent key={c.slug} value={c.slug} className="mt-16 focus-visible:outline-none">
                <div className="text-center mb-12">
                  <p className="font-serif text-2xl md:text-3xl text-foreground">{c.blurb}</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                  {c.services.map((s, i) => (
                    <ServiceCard
                      key={s.slug}
                      service={s}
                      category={c.slug}
                      reverse={i % 2 === 1}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
