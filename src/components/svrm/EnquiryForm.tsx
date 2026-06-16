import { useState } from "react";
import { z } from "zod";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Required").max(2000),
});

interface Props {
  subject: string;
  defaultMessage?: string;
  compact?: boolean;
}

const EnquiryForm = ({ subject, defaultMessage = "", compact = false }: Props) => {
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: defaultMessage });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof typeof form, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof typeof form;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject,
      message: parsed.data.message,
      source_page: location.pathname,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send. Please try again or use WhatsApp.");
      return;
    }
    setDone(true);
    toast.success("Enquiry received. We'll respond personally, within hours.");
  };

  if (done) {
    return (
      <div className="border border-primary/40 bg-surface-raised p-8 text-center">
        <p className="eyebrow">Thank you</p>
        <p className="font-serif text-2xl mt-4 text-foreground">Your enquiry is with us.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          A member of the concierge team will be in touch personally, within hours.
        </p>
      </div>
    );
  }

  const inputBase =
    "w-full bg-transparent border-b border-border/60 px-0 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors";

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-5" : "space-y-6"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <input
            className={inputBase}
            placeholder="Name"
            value={form.name}
            onChange={update("name")}
            maxLength={100}
            aria-label="Name"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <input
            className={inputBase}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
            maxLength={255}
            aria-label="Email"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>
      <div>
        <input
          className={inputBase}
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={update("phone")}
          maxLength={40}
          aria-label="Phone"
        />
      </div>
      <div>
        <textarea
          className={`${inputBase} resize-none min-h-[140px]`}
          placeholder={`Tell us about your ${subject.toLowerCase()} request…`}
          value={form.message}
          onChange={update("message")}
          maxLength={2000}
          aria-label="Message"
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.32em] font-medium hover:bg-primary-glow transition-colors duration-500 shadow-[var(--shadow-gold)] disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send enquiry"}
        </button>
        <a
          href={buildWhatsAppUrl(subject)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 border border-primary/60 text-gold text-xs uppercase tracking-[0.32em] text-center hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          Or WhatsApp
        </a>
      </div>
      <p className="text-xs text-muted-foreground/60 pt-2">
        Privacy is the standard. Your details are used only to respond to this enquiry.
      </p>
    </form>
  );
};

export default EnquiryForm;
