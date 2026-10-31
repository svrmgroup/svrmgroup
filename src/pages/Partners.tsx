import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Car, Home, Compass, Briefcase, Check } from "lucide-react";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import PhoneField from "@/components/svrm/PhoneField";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { requiredPhone } from "@/lib/contactValidation";
import { reportConversion } from "@/lib/adsConsent";

type Cat = "vehicle" | "property" | "experience" | "professional";

const CATS: { id: Cat; label: string; icon: typeof Car; text: string }[] = [
  { id: "vehicle", label: "Vehicle owners", icon: Car, text: "Luxury cars, SUVs, vans and coaches — including privately owned vehicles sitting unused." },
  { id: "property", label: "Property owners", icon: Home, text: "Villas, apartments, holiday homes and hotels across Cape Town and the Winelands." },
  { id: "experience", label: "Experience providers", icon: Compass, text: "Yachts, helicopters, tours, safari and adventure activities." },
  { id: "professional", label: "Professional services", icon: Briefcase, text: "Chauffeurs, guides, chefs, photographers, florists, security and more." },
];

const EXTRA: Record<Cat, { key: string; label: string }[]> = {
  vehicle: [{ key: "vehicle_model", label: "Make & model" }, { key: "year", label: "Year" }, { key: "seats", label: "Seats" }, { key: "vehicle_type", label: "Type (sedan, SUV, van, coach)" }],
  property: [{ key: "property_type", label: "Property type" }, { key: "bedrooms", label: "Bedrooms" }, { key: "area", label: "Area / suburb" }],
  experience: [{ key: "experience_type", label: "Experience type" }, { key: "capacity", label: "Guest capacity" }],
  professional: [{ key: "service_type", label: "Service offered" }, { key: "years_experience", label: "Years of experience" }],
};

const schema = z.object({
  full_name: z.string().trim().min(2, "Full name required").max(120),
  business_name: z.string().trim().max(160),
  email: z.string().trim().email("Valid email required").max(255),
  phone: requiredPhone,
  location: z.string().trim().min(2, "Location required").max(200),
  category: z.enum(["vehicle", "property", "experience", "professional"], { errorMap: () => ({ message: "Choose a category" }) }),
  description: z.string().trim().min(10, "Describe what you offer").max(3000),
  proposed_rates: z.string().trim().min(1, "Proposed rates required").max(1000),
  availability: z.string().trim().min(1, "Availability required").max(1000),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent required" }) }),
});

const input = "w-full bg-transparent border-b border-border/60 px-0 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors";

const empty = { full_name: "", business_name: "", email: "", phone: "", location: "", category: "" as Cat | "", description: "", proposed_rates: "", availability: "", consent: false };

const Partners = () => {
  const [form, setForm] = useState(empty);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[String(i.path[0])] ||= i.message; });
      setErrors(errs);
      toast.error("Please complete the required fields.");
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const photo_paths: string[] = [];
      for (const f of files.slice(0, 6)) {
        const fd = new FormData();
        fd.append("file", f);
        const { data, error } = await supabase.functions.invoke("upload-partner-photo", { body: fd });
        if (error || !data?.path) throw error ?? new Error("Upload failed");
        photo_paths.push(data.path as string);
      }
      const cleanDetails = Object.fromEntries(Object.entries(details).filter(([k, v]) => v.trim() && EXTRA[r.data.category].some((x) => x.key === k)).map(([k, v]) => [k, v.trim().slice(0, 200)]));
      const { error } = await supabase.from("partner_applications").insert({
        ...(r.data as Required<typeof r.data>),
        business_name: r.data.business_name || null,
        details: cleanDetails,
        photo_paths,
      });
      if (error) throw error;
      void reportConversion("enquiry");
      setDone(true);
      setForm(empty); setDetails({}); setFiles([]);
    } catch (err) {
      toast.error("Could not send your application. Please try again or WhatsApp us.");
    } finally {
      setBusy(false);
    }
  };

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Partner With SVRM Group | Vehicle, Property & Tourism Suppliers"
        description="Earn extra income with SVRM Group in Cape Town. We welcome luxury vehicle owners, holiday property owners and tourism service providers. Apply online or WhatsApp +27 73 064 1481."
        path="/contact/partners"
        keywords="Cape Town luxury vehicle partnership, list my car Cape Town, holiday property supplier Cape Town, villa owner income Cape Town, tourism service provider Cape Town, become a supplier SVRM Group, chauffeur jobs supplier, yacht and helicopter suppliers Cape Town"
      />
      <Nav />
      <PageHero eyebrow="Become a Partner" title="Partner With SVRM Group" subtitle="Exceptional Assets. Extraordinary Opportunities." />

      <section className="container max-w-5xl py-16">
        <p className="text-center text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Own a luxury vehicle, a beautiful property or a remarkable experience? Join SVRM Group's supplier network in Cape Town to earn additional income, reach discerning international clients and work on flexible terms that suit you.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {CATS.map(({ id, label, icon: Icon, text }) => (
            <button type="button" key={id} onClick={() => { setForm((f) => ({ ...f, category: id })); document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-left border border-border/50 p-6 hover:border-primary transition-colors">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-xl">{label}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </button>
          ))}
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-3 text-sm">
          {["Additional earning opportunities", "Access to premium clients", "Flexible arrangements"].map((t) => (
            <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{t}</li>
          ))}
        </ul>
      </section>

      <section id="apply" className="container max-w-3xl pb-24 scroll-mt-24">
        <h2 className="font-display text-3xl text-center">Apply to join</h2>
        {done ? (
          <div className="mt-10 border border-primary/40 p-8 text-center">
            <p className="font-display text-2xl">Thank you</p>
            <p className="mt-2 text-muted-foreground">Your application has been received. Our team will review it and contact you on WhatsApp.</p>
            <button className="mt-6 text-primary underline" onClick={() => setDone(false)}>Submit another</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div><input className={input} placeholder="Full name *" value={form.full_name} onChange={set("full_name")} maxLength={120} aria-label="Full name" />{err("full_name")}</div>
              <div><input className={input} placeholder="Business name (if applicable)" value={form.business_name} onChange={set("business_name")} maxLength={160} aria-label="Business name" /></div>
              <div><input className={input} type="email" placeholder="Email *" value={form.email} onChange={set("email")} maxLength={255} aria-label="Email" />{err("email")}</div>
              <div><PhoneField value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} className={input} placeholder="WhatsApp number *" />{err("phone")}</div>
              <div><input className={input} placeholder="Location *" value={form.location} onChange={set("location")} maxLength={200} aria-label="Location" />{err("location")}</div>
              <div>
                <select className={`${input} bg-background`} value={form.category} onChange={set("category")} aria-label="Supplier category">
                  <option value="">Supplier category *</option>
                  {CATS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>{err("category")}
              </div>
            </div>
            {form.category && (
              <div className="grid gap-6 md:grid-cols-2">
                {EXTRA[form.category].map((x) => (
                  <input key={x.key} className={input} placeholder={x.label} aria-label={x.label} maxLength={200} value={details[x.key] || ""} onChange={(e) => setDetails((d) => ({ ...d, [x.key]: e.target.value }))} />
                ))}
              </div>
            )}
            <div><textarea className={`${input} resize-none min-h-[120px]`} placeholder="Describe what you're offering *" value={form.description} onChange={set("description")} maxLength={3000} aria-label="Description" />{err("description")}</div>
            <div className="grid gap-6 md:grid-cols-2">
              <div><input className={input} placeholder="Proposed rates *" value={form.proposed_rates} onChange={set("proposed_rates")} maxLength={1000} aria-label="Proposed rates" />{err("proposed_rates")}</div>
              <div><input className={input} placeholder="Availability *" value={form.availability} onChange={set("availability")} maxLength={1000} aria-label="Availability" />{err("availability")}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Photos (optional, up to 6, max 10MB each)</label>
              <input type="file" accept="image/*" multiple className="mt-2 block w-full text-sm" aria-label="Photos"
                onChange={(e) => { const list = Array.from(e.target.files || []).filter((f) => f.size <= 10 * 1024 * 1024).slice(0, 6); setFiles(list); }} />
              {files.length > 0 && <p className="mt-1 text-xs text-muted-foreground">{files.length} photo(s) selected</p>}
            </div>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 accent-primary" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} aria-label="Privacy consent" />
              <span>I agree that SVRM Group may store and use my details to review this application, in line with the <a href="/privacy" className="text-primary underline">privacy policy</a>. *</span>
            </label>
            {err("consent")}
            <button type="submit" disabled={busy} className="w-full md:w-auto px-10 py-4 bg-primary text-primary-foreground uppercase tracking-widest text-xs disabled:opacity-60">
              {busy ? "Sending…" : "Submit application"}
            </button>
          </form>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Partners;
