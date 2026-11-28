// Verified stay facts, checked against the linked property or hotel listing on 28 November 2026.
// Keep occupancy separate from marketing copy so cards, detail pages and search data agree.
export interface StayFacts {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  occupancyLabel?: string;
  source: string;
}

const nox = (slug: string, bedrooms: number, bathrooms: number, maxGuests: number): StayFacts => ({
  bedrooms,
  bathrooms,
  maxGuests,
  source: `https://www.noxrentals.com/rentals/${slug}`,
});

export const stayFacts: Record<string, StayFacts> = {
  "camps-bay-5-bed-signature-villa": {
    bedrooms: 5,
    bathrooms: 5,
    maxGuests: 10,
    source: "https://villasincapetown.com/listings/atlantic-villa",
  },
  "a-la-penthouse": {
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    source: "https://www.capevillas.co.za/properties/a-la-penthouse/",
  },
  "nox-1bed-cape-town-apt-stonewood-at-the-granger": nox("1bed-cape-town-apt-stonewood-at-the-granger", 1, 1, 2),
  "nox-beautifully-decorated-apartment-in-cape-town-urban-signature": nox("beautifully-decorated-apartment-in-cape-town-urban-signature", 1, 1, 2),
  "nox-old-cape-quarter-1-bedroom-units": {
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    source: "https://old-cape-quarter-1-bedroom-units.capetown-best-hotels.com/en/",
  },
  "nox-mouille-point-1-bed-w-sea-views-skyshore-apartment": nox("mouille-point-1-bed-w-sea-views-skyshore-apartment", 1, 1, 2),
  "nox-beautiful-apartment-at-the-waterfront-marina-altmore-001": nox("beautiful-apartment-at-the-waterfront-marina-altmore-001", 1, 1, 2),
  "nox-green-point-modern-2bed-apartment-azura-atlantic": nox("green-point-modern-2bed-apartment-azura-atlantic", 2, 2, 4),
  "nox-charming-central-apartment-aquene-bay": nox("charming-central-apartment-aquene-bay", 2, 2, 4),
  "nox-modern-sea-point-apartment-w-sea-views-alpha-sunsets": nox("modern-sea-point-apartment-w-sea-views-alpha-sunsets", 2, 2, 4),
  "nox-2bed-mouille-point-apartment-w-amazing-cape-views": nox("2bed-mouille-point-apartment-w-amazing-cape-views", 2, 1, 4),
  "nox-clifton-apartment-w-direct-beach-access-marella": nox("clifton-apartment-w-direct-beach-access-marella", 2, 2, 4),
  "nox-de-waterkant-townhouse-with-pool-access-116-dwp": nox("de-waterkant-townhouse-with-pool-access-116-dwp", 3, 2, 6),
  "nox-aqua-views-at-the-waterclub-in-cape-town": nox("aqua-views-at-the-waterclub-in-cape-town", 2, 2, 4),
  "nox-clifton-3bed-penthouse-sea-views-dunmore-horizons": nox("clifton-3bed-penthouse-sea-views-dunmore-horizons", 3, 2, 6),
  "nox-luxurious-penthouse-w-sweeping-views-sea-point-penthouse": nox("luxurious-penthouse-w-sweeping-views-sea-point-penthouse", 3, 3, 6),
  "nox-camps-bay-family-holiday-home-sunset-sanctuary": nox("camps-bay-family-holiday-home-sunset-sanctuary", 3, 3, 6),
  "nox-mountain-view-holiday-villa-w-garden-pool-iliwa": nox("mountain-view-holiday-villa-w-garden-pool-iliwa", 3, 3, 6),
  "nox-4-bed-higgovale-mountain-views-sandstone-apartment": nox("4-bed-higgovale-mountain-views-sandstone-apartment", 4, 4, 8),
  "nox-4-bed-coastal-retreat-w-pool-views-llandudno-sands": nox("4-bed-coastal-retreat-w-pool-views-llandudno-sands", 4, 4, 8),
  "nox-luxurious-villa-w-breathtaking-sea-mountain-views-hamaya": nox("luxurious-villa-w-breathtaking-sea-mountain-views-hamaya", 4, 4, 8),
  "nox-camps-bay-luxury-5-star-5-bed-w-gym-majestic-villa": nox("camps-bay-luxury-5-star-5-bed-w-gym-majestic-villa", 5, 5, 10),
  "nox-beautiful-6bed-camps-bay-view-villa-w-pool-ithemba": nox("beautiful-6bed-camps-bay-view-villa-w-pool-ithemba", 6, 6, 12),
  "nox-llandudno-beach-oasis-solmara-house": nox("llandudno-beach-oasis-solmara-house", 5, 4, 10),
  "nox-luxurious-camps-bay-retreat-w-sea-views-rock-residence": nox("luxurious-camps-bay-retreat-w-sea-views-rock-residence", 6, 4, 12),
  "nox-idyllic-camps-bay-villa-w-2-pools-buddha-retreat": nox("idyllic-camps-bay-villa-w-2-pools-buddha-retreat", 10, 10, 20),
  "hotel-cape-grace": {
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 3,
    occupancyLabel: "2 adults + 1 child (4 or younger)",
    source: "https://www.cometocapetown.com/property/cape-grace/",
  },
  "hotel-one-and-only": {
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 3,
    occupancyLabel: "2 adults + 1 child",
    source: "https://www.oneandonlyresorts.com/cape-town/stays/rooms/marina-room",
  },
  "hotel-mount-nelson": {
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    source: "https://www.belmond.com/en/booking/select-accommodation?filterRoomCategory=SPLTYSTE&productId=MNH",
  },
  "hotel-silo": {
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    source: "https://www.theroyalportfolio.com/the-silo-hotel/accommodation/rooms/",
  },
  "hotel-table-bay": {
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    source: "https://www.ihg.com/intercontinental/hotels/us/en/cape-town/cpttb/hoteldetail/rooms",
  },
  "hotel-bay-hotel": {
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 3,
    occupancyLabel: "2 adults + 1 child",
    source: "https://villagenlife.trade/wp-content/uploads/Documents/PDFS/Rack/The-Bay-Hotel-VNL-Hotels-Rack-Rates-(2026-2027).pdf",
  },
};

export const guestLabel = (facts: StayFacts) => facts.occupancyLabel ?? `${facts.maxGuests} guests`;

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
