import day1 from "@/assets/svc-transport-airport.jpg";
import day2 from "@/assets/tours/cape-peninsula.jpg";
import day3 from "@/assets/tours/culinary.jpg";
import day4 from "@/assets/chauffeur/day4-table-mountain.jpg";
import day5 from "@/assets/chauffeur/day5-beach-leisure.jpg";
import day6 from "@/assets/tours/aquila-safari.jpg";
import day7 from "@/assets/chauffeur/day7-departure.jpg";

export interface ItineraryDay {
  day: number;
  title: string;
  eyebrow: string;
  description: string;
  highlights: string[];
  image: string;
}

/** SVRM's signature 7-day chauffeured Cape Town itinerary. 10% off the vehicle total. */
export const SEVEN_DAY_DISCOUNT = 0.1;

export const chauffeurItinerary: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrival, Hotel Check-In & Atlantic Seaboard Sunset",
    eyebrow: "Day 1 · Arrival",
    description:
      "Your chauffeur meets you inside Cape Town International with a name board, handles the luggage and drives you straight to your hotel or villa. Once you've settled, we take the coast road for your first sunset — Sea Point, Bantry Bay, Clifton and Camps Bay — with a sundowner stop booked in advance.",
    highlights: [
      "Meet-and-greet at Cape Town International (CPT)",
      "Chilled water, Wi-Fi and phone charging on board",
      "Hotel or villa check-in assistance",
      "Atlantic Seaboard sunset drive with a sundowner stop",
    ],
    image: day1,
  },
  {
    day: 2,
    title: "Cape Peninsula Private Tour",
    eyebrow: "Day 2 · Peninsula",
    description:
      "The full Peninsula in one unhurried day, privately and at your pace: Hout Bay, Chapman's Peak Drive, Cape Point and the Cape of Good Hope, the penguins at Boulders Beach and lunch in Simon's Town or Kalk Bay.",
    highlights: [
      "Chapman's Peak Drive and Hout Bay",
      "Cape Point & Cape of Good Hope",
      "Boulders Beach penguin colony",
      "Seafood lunch in Simon's Town or Kalk Bay",
    ],
    image: day2,
  },
  {
    day: 3,
    title: "Wine Farms — Stellenbosch or Franschhoek",
    eyebrow: "Day 3 · Winelands",
    description:
      "A full day in the Cape Winelands with your chauffeur waiting between estates, so nobody has to think about driving. Two or three tastings, a long lunch at an estate restaurant and time in the village afterwards.",
    highlights: [
      "Two to three estate tastings, booked ahead",
      "Long lunch at a leading Winelands restaurant",
      "Stellenbosch or Franschhoek village time",
      "Cellar tours and food pairings on request",
    ],
    image: day3,
  },
  {
    day: 4,
    title: "Table Mountain, Kirstenbosch & Atlantic Seaboard",
    eyebrow: "Day 4 · Icons",
    description:
      "Cape Town's landmark day. We watch the cableway conditions and time your ascent for the clearest window, then the indigenous gardens of Kirstenbosch, the Bo-Kaap and the V&A Waterfront — with your chauffeur on call between every stop.",
    highlights: [
      "Table Mountain cableway, timed for weather",
      "Kirstenbosch National Botanical Garden",
      "Bo-Kaap and City Bowl viewpoints",
      "V&A Waterfront and Signal Hill sunset",
    ],
    image: day4,
  },
  {
    day: 5,
    title: "Beach, Leisure & Scenic Lifestyle Day",
    eyebrow: "Day 5 · Leisure",
    description:
      "A slower day shaped around you. Beach club at Camps Bay or Clifton 4th, spa or in-villa wellness, shopping, a yacht hour out of the V&A, or simply a scenic drive up to Llandudno and Hout Bay — your chauffeur stays on call all day.",
    highlights: [
      "Beach club or private beach set-up",
      "Spa, wellness or in-villa treatments",
      "Shopping and boutique runs",
      "Optional yacht hour or helicopter flip",
    ],
    image: day5,
  },
  {
    day: 6,
    title: "Aquila Big Five Safari",
    eyebrow: "Day 6 · Safari",
    description:
      "An early start for a Big Five game experience within reach of Cape Town. We chauffeur you door to door, you take the game drive with the reserve's rangers, and you're back in the city by evening — pricing on request as reserve rates vary by season and drive.",
    highlights: [
      "Door-to-door chauffeured transfer to the reserve",
      "Big Five game drive with resident rangers",
      "Breakfast and lunch at the lodge",
      "Midday or sunset drive options",
    ],
    image: day6,
  },
  {
    day: 7,
    title: "Final Morning, Last Stops & Departure",
    eyebrow: "Day 7 · Departure",
    description:
      "A relaxed final morning: late check-out where possible, last gift and wine stops, a coffee with a view, then a calm chauffeured run to the airport with luggage handled and timing built around your flight.",
    highlights: [
      "Late check-out arranged where possible",
      "Final shopping, gift and wine stops",
      "Luggage handled door to terminal",
      "Airport departure transfer, flight-timed",
    ],
    image: day7,
  },
];
