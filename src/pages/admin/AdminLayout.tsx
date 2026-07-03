import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { LogOut, Inbox, Car, Calendar as CalIcon, MessageCircle } from "lucide-react";

const AdminLayout = () => {
  const { session, isAdmin, loading, signOut } = useAdminAuth();

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

  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r border-border/40 bg-surface-deep md:min-h-screen">
        <div className="p-6 border-b border-border/40">
          <p className="eyebrow">SVRM</p>
          <p className="font-serif text-xl mt-1">Concierge</p>
        </div>
        <nav className="py-4 flex flex-col">
          <NavLink to="/admin" end className={linkClass}>
            <Inbox className="h-4 w-4" /> Enquiries
          </NavLink>
          <NavLink to="/admin/bookings" className={linkClass}>
            <Car className="h-4 w-4" /> Rental bookings
          </NavLink>
          <NavLink to="/admin/calendar" className={linkClass}>
            <CalIcon className="h-4 w-4" /> Calendar
          </NavLink>
        </nav>
        <div className="p-4 border-t border-border/40 mt-4">
          <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
          <button
            onClick={signOut}
            className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-gold transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <main className="p-6 md:p-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
