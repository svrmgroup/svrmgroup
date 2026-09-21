import { MessageCircle, ShieldCheck, KeyRound, Wrench, TrendingUp, Handshake } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import EnquiryForm from "@/components/svrm/EnquiryForm";

const PILLARS = [
  {
    icon: KeyRound,
    title: "Completely hands-free",
    body: "From guest vetting and check-ins to housekeeping and concierge, we manage every detail of your property — you simply receive your income each month.",
  },
  {
    icon: ShieldCheck,
    title: "Your home, protected",
    body: "Every guest is screened, every stay is inspected, and your residence is cared for to the standard we hold our own flagship properties.",
  },
  {
    icon: Wrench,
    title: "Maintenance, handled",
    body: "Our trusted in-house teams and vetted contractors keep everything immaculate — pools, gardens, interiors — without a single call to you.",
  },
  {
    icon: TrendingUp,
    title: "Income, maximised",
    body: "Dynamic pricing, professional presentation and direct access to our private client base keep occupancy and nightly rates at their peak.",
  },
];

const PropertyManagementSection = () => {
  return (
    <div>
      <div className="max-w-3xl">
        <p className="eyebrow">Property Management · By SVRM</p>
        <h2 className="font-serif text-3xl md:text-5xl mt-6 text-foreground leading-tight">
          Own the address. We'll do the rest.
        </h2>
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          Entrust your Cape Town property to SVRM and it becomes effortless. We look after your
          home as if it were our own — maintaining it immaculately, welcoming our most discerning
          clients as guests, and returning a monthly income to you while you remain entirely
          hands-free.
        </p>
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          Discreet, transparent and meticulous. This is property ownership, perfected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="border border-border/60 bg-surface-raised p-8 hover:border-primary/60 transition-colors"
          >
            <p.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <h3 className="font-serif text-xl mt-5 text-foreground">{p.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 border border-primary/40 bg-surface-raised p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Handshake className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <p className="eyebrow">Begin the conversation</p>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl mt-4 text-foreground">
            Your property, earning beautifully.
          </h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xl">
            Tell us about your home — location, bedrooms, and its story — and our team will prepare
            a private management proposal with projected income. No obligation, complete
            confidentiality.
          </p>
        </div>
        <a
          href={buildWhatsAppUrl("property management for my home")}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] px-8 py-4 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp Us
        </a>
      </div>

      <div className="mt-14 max-w-3xl">
        <EnquiryForm subject="Property Management Enquiry" />
      </div>
    </div>
  );
};

export default PropertyManagementSection;
