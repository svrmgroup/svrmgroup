import { useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellRing, Check, Volume2, VolumeX, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        {unread > 0 ? <BellRing className="h-5 w-5 text-gold" /> : <Bell className="h-5 w-5" />}
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[9px] font-medium text-background flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>
      </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          collisionPadding={12}
          aria-label="Admin notifications"
          className="flex w-80 max-w-[calc(100vw-24px)] max-h-[min(var(--radix-popover-content-available-height),calc(100dvh-24px))] flex-col overflow-hidden bg-surface-deep border-border/60 p-0 shadow-2xl"
        >
          <div className="p-3 border-b border-border/40 flex shrink-0 flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notifications</p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!sound)} aria-label={sound ? "Mute chime" : "Unmute chime"} title={sound ? "Mute chime" : "Unmute chime"} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={markAllRead} aria-label="Mark all read" title="Mark all read" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={clearNotifications} aria-label="Clear all" title="Clear all" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {perm !== "granted" && (
            <Button variant="ghost" onClick={enablePopups} className="h-auto w-full shrink-0 flex-col items-start gap-0 whitespace-normal rounded-none text-left p-3 border-b border-border/40 bg-primary/5 hover:bg-primary/10">
              <p className="text-xs text-gold">Enable pop-up notifications</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Get an alert on this device the moment an enquiry arrives — even when this tab is in the background.
              </p>
            </Button>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {items.length === 0 ? (
              <p className="p-5 text-xs text-muted-foreground text-center">No notifications yet.</p>
            ) : (
              items.map((n) => (
                <Button
                  variant="ghost"
                  key={n.id}
                  onClick={() => go(n)}
                  className={`h-auto w-full flex-col items-stretch gap-0 whitespace-normal rounded-none text-left p-3 border-b border-border/30 hover:bg-surface-raised ${n.read ? "" : "bg-primary/5"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`min-w-0 break-words text-xs ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</p>
                    <span className="text-[9px] text-muted-foreground shrink-0">{timeAgo(n.at)}</span>
                  </div>
                  <p className="break-words text-[11px] text-muted-foreground mt-1 line-clamp-2">{n.body}</p>
                </Button>
              ))
            )}
          </div>
        </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
