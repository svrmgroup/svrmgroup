// Sub-categories surfaced as hover dropdowns under main nav items.
// `to` is the full destination including any query string or hash.
export type NavCategory = { label: string; to: string };

export const navCategories: Record<string, NavCategory[]> = {
  "/travel": [
    { label: "Chauffeured Cars", to: "/travel?cat=cars" },
    { label: "Airport Transfers", to: "/airport-transfers" },
    { label: "Private Jets", to: "/travel?cat=jets" },
    { label: "Helicopters", to: "/travel?cat=helicopters" },
    { label: "Yachts", to: "/travel?cat=yachts" },
  ],
  "/rentals": [
    { label: "All Vehicles", to: "/rentals?cat=All" },
    { label: "Signature", to: "/rentals?cat=Signature" },
    { label: "Premium SUV", to: "/rentals?cat=Premium%20SUV" },
    { label: "Executive", to: "/rentals?cat=Executive" },
    { label: "Everyday", to: "/rentals?cat=Everyday" },
    { label: "Budget", to: "/rentals?cat=Budget" },
    { label: "Custom Brief", to: "/rentals?cat=Custom" },
  ],
  "/stays": [
    { label: "Short-term", to: "/stays?cat=short" },
    { label: "Long-term", to: "/stays?cat=long" },
    { label: "Buy & Sell", to: "/stays?cat=buysell" },
  ],
  "/tours": [
    { label: "Aquila Safari (Day)", to: "/tours/aquila-safari" },
    { label: "Safari", to: "/tours/safari" },
    { label: "Garden Route", to: "/tours/garden-route" },
    { label: "Marine & Wildlife", to: "/tours/marine" },
    { label: "Cultural", to: "/tours/cultural" },
    { label: "Aerial & Scenic", to: "/tours/aerial" },
    { label: "Culinary", to: "/tours/culinary" },
    { label: "Wellness", to: "/tours/wellness" },
    { label: "Photography", to: "/tours/photography" },
    { label: "Group Travel", to: "/tours/group-travel" },
    { label: "Build a tour", to: "/tours/builder" },
  ],
  "/security": [
    { label: "Armoured Transport", to: "/security#armoured-transport" },
    { label: "Close Protection", to: "/security#close-protection" },
    { label: "Residential", to: "/security#residential" },
    { label: "Events", to: "/security#events" },
  ],
  "/blog": [
    { label: "All", to: "/blog?cat=All" },
    { label: "Travel", to: "/blog?cat=Travel" },
    { label: "Tours", to: "/blog?cat=Tours" },
    { label: "Lifestyle", to: "/blog?cat=Lifestyle" },
    { label: "Properties", to: "/blog?cat=Properties" },
    { label: "Insights", to: "/blog?cat=Insights" },
  ],
  "/contact": [
    { label: "FAQ", to: "/contact#faq" },
  ],
};

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
