// Verified stay facts, checked against the linked property or hotel listing on 28 November 2026.
// Keep occupancy, pool access and rate evidence separate from marketing copy so every surface agrees.
export type PoolStatus = "private" | "shared" | "unknown";
export type RateStatus = "published" | "on-enquiry";

export interface StayFacts {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  occupancyLabel?: string;
  source: string;
  pool: {
    status: PoolStatus;
    note: string;
    source: string;
  };
  rate: {
    status: RateStatus;
    note: string;
    source: string;
  };
}

const ON_ENQUIRY = "The official listing shows ‘Inquire now’ without a numerical nightly tariff. Your concierge will confirm the rate for your dates.";
const POOL_UNKNOWN = "Pool access is not publicly confirmed";

const nox = (
  slug: string,
  bedrooms: number,
  bathrooms: number,
  maxGuests: number,
  poolStatus: PoolStatus = "unknown",
  poolNote = POOL_UNKNOWN,
  poolSource?: string,
): StayFacts => {
  const source = `https://www.noxrentals.com/rentals/${slug}`;
  return {
    bedrooms,
    bathrooms,
    maxGuests,
    source,
    pool: { status: poolStatus, note: poolNote, source: poolSource ?? source },
    rate: { status: "on-enquiry", note: ON_ENQUIRY, source },
  };
};

const hotel = (
  bedrooms: number,
  bathrooms: number,
  maxGuests: number,
  source: string,
  poolSource: string,
  occupancyLabel?: string,
): StayFacts => ({
  bedrooms,
  bathrooms,
  maxGuests,
  occupancyLabel,
  source,
  pool: {
    status: "shared",
    note: "Hotel guests share the swimming-pool facilities; the room does not have an exclusive private pool",
    source: poolSource,
  },
  rate: {
    status: "on-enquiry",
    note: "No defensible current public nightly rate was confirmed for this exact room name. Your concierge will quote for your dates.",
    source,
  },
});

export const stayFacts: Record<string, StayFacts> = {
  "camps-bay-5-bed-signature-villa": {
    bedrooms: 5,
    bathrooms: 5,
    maxGuests: 10,
    source: "https://villasincapetown.com/listings/atlantic-villa",
    pool: {
      status: "private",
      note: "Private infinity pool for the villa’s booked guests",
      source: "https://villasincapetown.com/listings/atlantic-villa",
    },
    rate: {
      status: "on-enquiry",
      note: "The official listing says ‘Contact Us for Pricing’. Your concierge will confirm the rate for your dates.",
      source: "https://villasincapetown.com/listings/atlantic-villa",
    },
  },
  "a-la-penthouse": {
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    source: "https://www.capevillas.co.za/properties/a-la-penthouse/",
    pool: {
      status: "unknown",
      note: "A private outdoor Jacuzzi is confirmed; swimming-pool access is not publicly confirmed",
      source: "https://www.capevillas.co.za/properties/a-la-penthouse/",
    },
    rate: {
      status: "published",
      note: "Official listing: R26,200–R43,400 per night with a seven-night minimum. The final quote depends on your dates.",
      source: "https://www.capevillas.co.za/properties/a-la-penthouse/",
    },
  },
  "nox-1bed-cape-town-apt-stonewood-at-the-granger": nox("1bed-cape-town-apt-stonewood-at-the-granger", 1, 1, 2),
  "nox-beautifully-decorated-apartment-in-cape-town-urban-signature": nox("beautifully-decorated-apartment-in-cape-town-urban-signature", 1, 1, 2),
  "nox-old-cape-quarter-1-bedroom-units": {
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    source: "https://old-cape-quarter-1-bedroom-units.capetown-best-hotels.com/en/",
    pool: { status: "unknown", note: POOL_UNKNOWN, source: "https://old-cape-quarter-1-bedroom-units.capetown-best-hotels.com/en/" },
    rate: { status: "on-enquiry", note: "The available listing asks guests to select dates and check rates; no numerical nightly tariff is published. Your concierge will confirm.", source: "https://old-cape-quarter-1-bedroom-units.capetown-best-hotels.com/en/" },
  },
  "nox-mouille-point-1-bed-w-sea-views-skyshore-apartment": nox("mouille-point-1-bed-w-sea-views-skyshore-apartment", 1, 1, 2),
  "nox-beautiful-apartment-at-the-waterfront-marina-altmore-001": nox("beautiful-apartment-at-the-waterfront-marina-altmore-001", 1, 1, 2, "shared", "Communal building pools"),
  "nox-green-point-modern-2bed-apartment-azura-atlantic": nox("green-point-modern-2bed-apartment-azura-atlantic", 2, 2, 4),
  "nox-charming-central-apartment-aquene-bay": nox("charming-central-apartment-aquene-bay", 2, 2, 4),
  "nox-modern-sea-point-apartment-w-sea-views-alpha-sunsets": nox("modern-sea-point-apartment-w-sea-views-alpha-sunsets", 2, 2, 4, "shared", "Communal outdoor swimming pool and entertainment area on the fourth floor"),
  "nox-2bed-mouille-point-apartment-w-amazing-cape-views": nox("2bed-mouille-point-apartment-w-amazing-cape-views", 2, 1, 4),
  "nox-clifton-apartment-w-direct-beach-access-marella": nox("clifton-apartment-w-direct-beach-access-marella", 2, 2, 4),
  "nox-de-waterkant-townhouse-with-pool-access-116-dwp": nox("de-waterkant-townhouse-with-pool-access-116-dwp", 3, 2, 6, "shared", "Communal pool in the shared picnic and garden area"),
  "nox-aqua-views-at-the-waterclub-in-cape-town": nox("aqua-views-at-the-waterclub-in-cape-town", 2, 2, 4, "shared", "Communal Waterclub swimming pool"),
  "nox-clifton-3bed-penthouse-sea-views-dunmore-horizons": nox("clifton-3bed-penthouse-sea-views-dunmore-horizons", 3, 2, 6),
  "nox-luxurious-penthouse-w-sweeping-views-sea-point-penthouse": nox("luxurious-penthouse-w-sweeping-views-sea-point-penthouse", 3, 3, 6, "private", "Private pool, corroborated by a guest review on the official listing"),
  "nox-camps-bay-family-holiday-home-sunset-sanctuary": nox("camps-bay-family-holiday-home-sunset-sanctuary", 3, 3, 6, "private", "Private pool at the holiday home", "https://www.vrbo.com/11676381ha"),
  "nox-mountain-view-holiday-villa-w-garden-pool-iliwa": nox("mountain-view-holiday-villa-w-garden-pool-iliwa", 3, 3, 6, "private", "Private garden pool at the villa", "https://www.vrbo.com/en-gb/p11712493"),
  "nox-4-bed-higgovale-mountain-views-sandstone-apartment": nox("4-bed-higgovale-mountain-views-sandstone-apartment", 4, 4, 8, "shared", "Two communal pools with sun loungers and seating areas"),
  "nox-4-bed-coastal-retreat-w-pool-views-llandudno-sands": nox("4-bed-coastal-retreat-w-pool-views-llandudno-sands", 4, 4, 8, "unknown", "A terrace plunge pool is advertised; exclusive private use is not publicly confirmed"),
  "nox-luxurious-villa-w-breathtaking-sea-mountain-views-hamaya": nox("luxurious-villa-w-breathtaking-sea-mountain-views-hamaya", 4, 4, 8, "private", "Private swimming pool, with a plunge pool off the main living area"),
  "nox-camps-bay-luxury-5-star-5-bed-w-gym-majestic-villa": nox("camps-bay-luxury-5-star-5-bed-w-gym-majestic-villa", 5, 5, 10, "unknown", "A semi-circular pool is advertised; exclusive private use is not publicly confirmed"),
  "nox-beautiful-6bed-camps-bay-view-villa-w-pool-ithemba": nox("beautiful-6bed-camps-bay-view-villa-w-pool-ithemba", 6, 6, 12, "unknown", "A pool deck is advertised; exclusive private use is not publicly confirmed"),
  "nox-llandudno-beach-oasis-solmara-house": nox("llandudno-beach-oasis-solmara-house", 5, 4, 10, "unknown", "An outdoor swimming pool is advertised; exclusive private use is not publicly confirmed"),
  "nox-luxurious-camps-bay-retreat-w-sea-views-rock-residence": nox("luxurious-camps-bay-retreat-w-sea-views-rock-residence", 6, 4, 12, "unknown", "A hot tub and a nearby tidal pool are advertised; an on-property swimming pool is not publicly confirmed"),
  "nox-idyllic-camps-bay-villa-w-2-pools-buddha-retreat": nox("idyllic-camps-bay-villa-w-2-pools-buddha-retreat", 10, 10, 20, "unknown", "Indoor and outdoor pools are advertised; exclusive private use is not publicly confirmed"),
  "hotel-cape-grace": hotel(1, 1, 3, "https://www.cometocapetown.com/property/cape-grace/", "https://www.capegrace.com/restaurant/pool-bar/", "2 adults + 1 child (4 or younger)"),
  "hotel-one-and-only": hotel(1, 1, 3, "https://www.oneandonlyresorts.com/cape-town/stays/rooms/marina-room", "https://www.oneandonlyresorts.com/cape-town/dining/isola", "2 adults + 1 child"),
  "hotel-mount-nelson": hotel(1, 1, 2, "https://www.belmond.com/en/booking/select-accommodation?filterRoomCategory=SPLTYSTE&productId=MNH", "https://guide.michelin.com/us/en/hotels-stays/cape-town/mount-nelson-a-belmond-hotel-cape-town-5950"),
  "hotel-silo": hotel(1, 1, 2, "https://www.theroyalportfolio.com/the-silo-hotel/accommodation/rooms/", "https://www.theroyalportfolio.com/the-silo-hotel/dining/the-silo-rooftop/"),
  "hotel-table-bay": hotel(1, 1, 2, "https://www.ihg.com/intercontinental/hotels/us/en/cape-town/cpttb/hoteldetail/rooms", "https://www.ihg.com/intercontinental/hotels/us/en/cape-town/cpttb/hoteldetail"),
  "hotel-bay-hotel": hotel(1, 1, 3, "https://villagenlife.trade/wp-content/uploads/Documents/PDFS/Rack/The-Bay-Hotel-VNL-Hotels-Rack-Rates-(2026-2027).pdf", "https://thebayhotel.com/facilities/", "2 adults + 1 child"),
};

export const guestLabel = (facts: StayFacts) => facts.occupancyLabel ?? `${facts.maxGuests} guests`;

export const poolLabel = (facts: StayFacts) => {
  if (facts.pool.status === "private") return "Private pool";
  if (facts.pool.status === "shared") return "Shared pool";
  return "Not publicly confirmed";
};

export const poolAnswer = (facts: StayFacts) => {
  if (facts.pool.status === "private") return `${facts.pool.note}. It is not a shared pool.`;
  if (facts.pool.status === "shared") return `${facts.pool.note}. This is not an exclusive private pool.`;
  return `${facts.pool.note}. Your concierge will confirm availability and whether any pool is private or shared before you book.`;
};

export const stayHasPublicRate = (slug: string) => stayFacts[slug]?.rate.status === "published";

export const stayFactSummary = (slug: string) => {
  const facts = stayFacts[slug];
  if (!facts) return "";
  return `${facts.bedrooms} bed · ${facts.bathrooms} bath · ${guestLabel(facts)}`;
};

export const stayFeatureSummary = (beds: string) => beds
  .split("·")
  .map((token) => token.trim())
  .filter((token) => token && !/^\d+\s*(bed|bath|guest)/i.test(token) && !/^1 king$/i.test(token))
  .join(" · ");
