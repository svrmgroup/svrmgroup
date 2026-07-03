import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, buildWhatsAppUrlRaw } from "@/lib/whatsapp";

const WhatsAppFab = () => (
  <a
    href={buildWhatsAppUrlRaw("Hi SVRM, I'd like to start a conversation.")}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with SVRM on WhatsApp"
    className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-gold)] flex items-center justify-center hover:bg-primary-glow transition-colors"
  >
    <MessageCircle className="h-6 w-6" />
  </a>
);

export default WhatsAppFab;
