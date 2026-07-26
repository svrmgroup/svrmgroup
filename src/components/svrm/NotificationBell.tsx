import { useEffect, useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellRing, Check, Volume2, VolumeX, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  subscribeNotifications, getNotifications, getUnreadCount, markAllRead, markRead,
  clearNotifications, soundEnabled, setSoundEnabled, notificationPermission,
  requestNotificationPermission, type AdminNotification,
} from "@/lib/adminNotifications";

const timeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
};

const NotificationBell = () => {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [perm, setPerm] = useState(() => notificationPermission());

  const items = useSyncExternalStore(subscribeNotifications, getNotifications, getNotifications);
  const unread = useSyncExternalStore(subscribeNotifications, getUnreadCount, getUnreadCount);
  const sound = useSyncExternalStore(subscribeNotifications, soundEnabled, soundEnabled);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  const enablePopups = async () => {
    const result = await requestNotificationPermission();
    setPerm(result);
    if (result === "granted") toast.success("Pop-up notifications enabled.");
    else if (result === "denied") toast.error("Blocked in browser settings — allow notifications for this site.");
    else if (result === "unsupported") toast.error("This browser does not support pop-up notifications.");
  };

  const go = (n: AdminNotification) => {
    markRead(n.id);
    setOpen(false);
    nav(n.href);
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Notifications"
      >
        {unread > 0 ? <BellRing className="h-5 w-5 text-gold" /> : <Bell className="h-5 w-5" />}
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[9px] font-medium text-background flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[320px] max-w-[85vw] bg-surface-deep border border-border/60 shadow-2xl z-50">
          <div className="p-3 border-b border-border/40 flex items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notifications</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setSoundEnabled(!sound)} title={sound ? "Mute chime" : "Unmute chime"} className="p-1.5 text-muted-foreground hover:text-foreground">
                {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>
              <button onClick={markAllRead} title="Mark all read" className="p-1.5 text-muted-foreground hover:text-foreground">
                <Check className="h-3.5 w-3.5" />
              </button>
              <button onClick={clearNotifications} title="Clear all" className="p-1.5 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {perm !== "granted" && (
            <button onClick={enablePopups} className="w-full text-left p-3 border-b border-border/40 bg-primary/5 hover:bg-primary/10 transition-colors">
              <p className="text-xs text-gold">Enable pop-up notifications</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Get an alert on this device the moment an enquiry arrives — even when this tab is in the background.
              </p>
            </button>
          )}

          <div className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <p className="p-5 text-xs text-muted-foreground text-center">No notifications yet.</p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => go(n)}
                  className={`w-full text-left p-3 border-b border-border/30 hover:bg-surface-raised transition-colors ${n.read ? "" : "bg-primary/5"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</p>
                    <span className="text-[9px] text-muted-foreground shrink-0">{timeAgo(n.at)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{n.body}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
