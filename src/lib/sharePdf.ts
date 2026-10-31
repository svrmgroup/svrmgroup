import { toast } from "sonner";

export const waDigits = (phone?: string | null) => (phone || "").replace(/\D/g, "");

/**
 * Send a generated PDF to a client's WhatsApp from the admin's own phone.
 * iPhone/Android: opens the share sheet with the PDF attached (pick WhatsApp → client).
 * Desktop/unsupported: downloads the PDF and opens the client's WhatsApp chat.
 */
export async function sharePdfToWhatsApp(opts: { blob: Blob; fileName: string; phone?: string | null; message: string }) {
  const file = new File([opts.blob], opts.fileName, { type: "application/pdf" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try { await navigator.clipboard?.writeText(opts.message); } catch { /* ignore */ }
    try {
      await nav.share({ files: [file], text: opts.message, title: opts.fileName });
      return "shared" as const;
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return "cancelled" as const;
    }
  }
  const url = URL.createObjectURL(opts.blob);
  const a = document.createElement("a");
  a.href = url; a.download = opts.fileName; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  const digits = waDigits(opts.phone) || "27730641481";
  window.open(`https://wa.me/${digits}?text=${encodeURIComponent(opts.message)}`, "_blank", "noopener,noreferrer");
  toast.success("PDF downloaded — attach it in WhatsApp to send.");
  return "fallback" as const;
}
