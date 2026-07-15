import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import {
  LogOut, Inbox, Car, Calendar as CalIcon, MessageCircle, FileText,
  Building2, BarChart3, Receipt, Wallet, Users, ListChecks, Menu, X, Share,
} from "lucide-react";
import Logo from "@/components/svrm/Logo";

const AdminLayout = () => {
  const { session, isAdmin, loading, signOut } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [dismissInstall, setDismissInstall] = useState<boolean>(() => {
    try { return localStorage.getItem("svrm-admin-install-dismissed") === "1"; } catch { return false; }
  });

  useAdminNotifications(!!isAdmin);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-xs uppercase tracking-[0.3em]">Loading…</div>;
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.24em] border-l-2 transition-colors ${
      isActive
        ? "border-primary text-foreground bg-surface-raised"
        : "border-transparent text-muted-foreground hover:text-foreground"
    }`;

  const groupLabel = "px-4 pt-5 pb-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60";

  const isIosSafari = typeof navigator !== "undefined"
    && /iP(hone|od|ad)/.test(navigator.userAgent)
    && /Safari/.test(navigator.userAgent)
    && !/(CriOS|FxiOS|OPiOS|EdgiOS)/.test(navigator.userAgent);
  const isStandalone = typeof window !== "undefined"
    && (window.matchMedia?.("(display-mode: standalone)").matches
      || (navigator as unknown as { standalone?: boolean }).standalone === true);
  const showInstallHint = isIosSafari && !isStandalone && !dismissInstall;

  const dismiss = () => {
    setDismissInstall(true);
    try { localStorage.setItem("svrm-admin-install-dismissed", "1"); } catch {/* ignore */}
  };

  const nav = (
    <nav className="py-2 flex flex-col overflow-y-auto flex-1">
      <p className={groupLabel}>Overview</p>
      <NavLink to="/admin" end className={linkClass} onClick={() => setOpen(false)}>
        <BarChart3 className="h-4 w-4" /> Analytics
      </NavLink>

      <p className={groupLabel}>Bookings</p>
      <NavLink to="/admin/enquiries" className={linkClass} onClick={() => setOpen(false)}>
        <Inbox className="h-4 w-4" /> Enquiries
      </NavLink>
      <NavLink to="/admin/bookings" className={linkClass} onClick={() => setOpen(false)}>
        <Car className="h-4 w-4" /> Rental requests
      </NavLink>
      <NavLink to="/admin/manual" className={linkClass} onClick={() => setOpen(false)}>
        <FileText className="h-4 w-4" /> Manual bookings
      </NavLink>
      <NavLink to="/admin/calendar" className={linkClass} onClick={() => setOpen(false)}>
        <CalIcon className="h-4 w-4" /> Calendar
      </NavLink>

      <p className={groupLabel}>Money</p>
      <NavLink to="/admin/expenses" className={linkClass} onClick={() => setOpen(false)}>
        <Receipt className="h-4 w-4" /> Expenses
      </NavLink>
      <NavLink to="/admin/pnl" className={linkClass} onClick={() => setOpen(false)}>
        <Wallet className="h-4 w-4" /> P&amp;L
      </NavLink>
      <NavLink to="/admin/suppliers" className={linkClass} onClick={() => setOpen(false)}>
        <Users className="h-4 w-4" /> Suppliers
      </NavLink>

      <p className={groupLabel}>Operations</p>
      <NavLink to="/admin/tasks" className={linkClass} onClick={() => setOpen(false)}>
        <ListChecks className="h-4 w-4" /> Tasks
      </NavLink>

      <p className={groupLabel}>Growth</p>
      <NavLink to="/admin/leads" className={linkClass} onClick={() => setOpen(false)}>
        <Building2 className="h-4 w-4" /> B2B leads
      </NavLink>
      <NavLink to="/admin/whatsapp" className={linkClass} onClick={() => setOpen(false)}>
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </NavLink>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[240px_1fr]" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-30 bg-surface-deep border-b border-border/40 flex items-center justify-between px-4 h-14">
        <button onClick={() => setOpen(true)} className="text-muted-foreground hover:text-foreground p-2 -ml-2">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground leading-none">SVRM</p>
            <p className="font-serif text-sm text-foreground leading-tight">Admin</p>
          </div>
        </div>
        <button onClick={signOut} className="text-muted-foreground hover:text-foreground p-2 -mr-2">
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col border-r border-border/40 bg-surface-deep md:min-h-screen sticky top-0 max-h-screen">
        <div className="p-6 border-b border-border/40 flex items-center gap-3">
          <Logo size="md" />
          <div>
            <p className="eyebrow">SVRM</p>
            <p className="font-serif text-xl mt-0.5 leading-none">Concierge</p>
          </div>
        </div>
        {nav}
        <div className="p-4 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
          <button onClick={signOut} className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-[85%] h-full bg-surface-deep border-r border-border/40 flex flex-col">
            <div className="p-5 border-b border-border/40 flex items-center justify-between">
              <div>
                <p className="eyebrow">SVRM</p>
                <p className="font-serif text-lg mt-1">Concierge</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground p-2"><X className="h-5 w-5" /></button>
            </div>
            {nav}
            <div className="p-4 border-t border-border/40">
              <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
            </div>
          </aside>
        </div>
      )}

      <main className="p-4 md:p-10 max-w-6xl w-full" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
        {showInstallHint && (
          <div className="mb-6 card-luxury p-4 flex items-start gap-3">
            <Share className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 text-xs">
              <p className="text-foreground font-medium">Install SVRM Admin on your iPhone</p>
              <p className="text-muted-foreground mt-1">Tap the <span className="text-foreground">Share</span> icon in Safari, then <span className="text-foreground">Add to Home Screen</span>. The app opens fullscreen with a home-screen icon.</p>
            </div>
            <button onClick={dismiss} className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-[0.24em]">Got it</button>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
