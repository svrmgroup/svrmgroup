// The listing a visitor is currently viewing, so the floating WhatsApp button enquires about it.
import { useSyncExternalStore } from "react";
import type { EnquiryListing } from "@/lib/listingEnquiry";

let current: (EnquiryListing & { path: string }) | null = null;
const subs = new Set<() => void>();

export function setCurrentListing(l: (EnquiryListing & { path: string }) | null) {
  current = l;
  subs.forEach((f) => f());
}

export function useCurrentListing() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => current, () => null);
}
