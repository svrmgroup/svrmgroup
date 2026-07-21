import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { whatsappUrlFor } from "@/lib/whatsappMessages";

const WhatsAppFab = () => {
  const { pathname } = useLocation();
  return (
    <a
      href={whatsappUrlFor(pathname)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SVRM on WhatsApp"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-gold)] flex items-center justify-center hover:bg-primary-glow transition-colors"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppFab;
