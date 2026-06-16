import safariImg from "@/assets/svc-exp-safari.jpg";
import yachtImg from "@/assets/svc-exp-yacht.jpg";
import villaImg from "@/assets/svc-stays-villa.jpg";
import fleetImg from "@/assets/svc-travel-fleet.jpg";
import culturalImg from "@/assets/svc-tours-cultural.jpg";
import customImg from "@/assets/svc-custom.jpg";

export type BlogCategory = "Travel" | "Tours" | "Lifestyle" | "Properties" | "Insights";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  image: string;
}

export const posts: BlogPost[] = [
  {
    slug: "top-5-luxury-safari-lodges-sa",
    title: "Top 5 luxury safari lodges in South Africa",
    excerpt:
      "The five lodges we send our most discerning clients to — and how to choose between them.",
    category: "Tours",
    date: "March 2026",
    image: safariImg,
  },
  {
    slug: "design-your-dream-tour",
    title: "How to design your dream tour",
    excerpt:
      "What we ask, what we listen for, and how a great brief shortens a great itinerary.",
    category: "Tours",
    date: "February 2026",
    image: culturalImg,
  },
  {
    slug: "atlantic-seaboard-yachting",
    title: "A quiet day on the Atlantic seaboard",
    excerpt:
      "Why the V&A is just the start — and how to compose a yacht day that doesn't feel scheduled.",
    category: "Lifestyle",
    date: "February 2026",
    image: yachtImg,
  },
  {
    slug: "long-term-cape-town-residences",
    title: "Long-term residences: the Cape Town brief",
    excerpt:
      "The neighbourhoods, the buildings and the leases we trust for stays of a month or more.",
    category: "Properties",
    date: "January 2026",
    image: villaImg,
  },
  {
    slug: "chauffeured-vs-self-drive",
    title: "Chauffeured or self-drive — which suits the trip?",
    excerpt:
      "A practical guide to choosing transport when the brief is genuinely flexible.",
    category: "Travel",
    date: "January 2026",
    image: fleetImg,
  },
  {
    slug: "request-only-the-svrm-way",
    title: "Request-only: why we don't publish prices",
    excerpt:
      "Every itinerary is personal. Here's what to expect when you send the first message.",
    category: "Insights",
    date: "December 2025",
    image: customImg,
  },
];

export const categories: BlogCategory[] = ["Travel", "Tours", "Lifestyle", "Properties", "Insights"];
