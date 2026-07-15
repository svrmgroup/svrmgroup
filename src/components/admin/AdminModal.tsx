import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "lg" | "xl" | "2xl";
}

const maxWidthCls = {
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

/**
 * Shared admin modal. Fixes the clipping issue on tall dialogs:
 * - Overlay is always top-aligned + scrollable.
 * - Card caps at viewport height; header + footer stick, body scrolls inside.
 * - Closes on backdrop click and Esc; locks background scroll while open.
 */
const AdminModal = ({ open, onClose, title, children, footer, maxWidth = "2xl" }: AdminModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 overflow-y-auto overscroll-contain"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="min-h-full flex items-start justify-center p-4 py-8">
        <div
          className={`bg-surface-deep border border-border/60 w-full ${maxWidthCls[maxWidth]} flex flex-col max-h-[calc(100vh-4rem)] shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 border-b border-border/40 flex items-center justify-between shrink-0">
            <h2 className="font-serif text-2xl">{title}</h2>
            <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
          {footer && (
            <div className="p-5 border-t border-border/40 flex justify-end gap-2 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
