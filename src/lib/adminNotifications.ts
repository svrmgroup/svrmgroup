/**
 * Tiny in-app notification store for the admin console.
 * Keeps a rolling history in localStorage so alerts survive reloads,
 * and notifies React subscribers via useSyncExternalStore.
 */

export type AdminNotificationKind = "enquiry" | "rental" | "manual_booking" | "change_request";

export interface AdminNotification {
  id: string;
  kind: AdminNotificationKind;
  title: string;
  body: string;
  href: string;
  at: string;
  read: boolean;
}

const KEY = "svrm-admin-notifications";
const SOUND_KEY = "svrm-admin-notify-sound";
const MAX = 50;

let items: AdminNotification[] = load();
const listeners = new Set<() => void>();

function load(): AdminNotification[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX))); } catch { /* ignore */ }
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeNotifications(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getNotifications() {
  return items;
}

export function getUnreadCount() {
  return items.filter((n) => !n.read).length;
}

export function addNotification(n: Omit<AdminNotification, "read" | "at"> & { at?: string }) {
  if (items.some((i) => i.id === n.id)) return false;
  items = [{ ...n, at: n.at || new Date().toISOString(), read: false }, ...items].slice(0, MAX);
  persist();
  emit();
  return true;
}

export function markAllRead() {
  if (!items.some((n) => !n.read)) return;
  items = items.map((n) => ({ ...n, read: true }));
  persist();
  emit();
}

export function markRead(id: string) {
  items = items.map((n) => (n.id === id ? { ...n, read: true } : n));
  persist();
  emit();
}

export function clearNotifications() {
  items = [];
  persist();
  emit();
}

/* ---- sound preference ---- */

export function soundEnabled() {
  try { return localStorage.getItem(SOUND_KEY) !== "0"; } catch { return true; }
}

export function setSoundEnabled(on: boolean) {
  try { localStorage.setItem(SOUND_KEY, on ? "1" : "0"); } catch { /* ignore */ }
  emit();
}

/** Short two-tone chime, generated in-browser (no asset needed). */
export function playChime() {
  if (!soundEnabled()) return;
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.14);
      gain.gain.linearRampToValueAtTime(0.14, now + i * 0.14 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 0.24);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.14);
      osc.stop(now + i * 0.14 + 0.26);
    });
    setTimeout(() => ctx.close().catch(() => {}), 900);
  } catch { /* ignore */ }
}

/* ---- OS-level pop-up notifications ---- */

export function notificationPermission(): "unsupported" | NotificationPermission {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<"unsupported" | NotificationPermission> {
  if (typeof Notification === "undefined") return "unsupported";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/**
 * Shows an OS pop-up. Prefers the service worker registration, which is the
 * only path that works for an installed home-screen app on iOS.
 */
export async function showOsNotification(title: string, body: string, tag: string) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const opts: NotificationOptions = {
    body,
    icon: "/svrm-icon-192.png",
    badge: "/svrm-icon-192.png",
    tag,
  };
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration("/admin-sw.js");
      if (reg) {
        await reg.showNotification(title, opts);
        return;
      }
    }
    new Notification(title, opts);
  } catch {
    try { new Notification(title, opts); } catch { /* ignore */ }
  }
}
