export const CHAUFFEUR_DESCRIPTION = "Cape Town private chauffeurs: Maybach, Rolls-Royce, Mercedes, Range Rover and BMW. Airport transfers, Cape Peninsula tours, full-day and multi-day hire.";
export const FLAGSHIP_SLUG = "rolls-royce-phantom";
export const MAYBACH_DESCRIPTION = "Step into the Mercedes-Maybach S-Class and leave the world outside. Sink into generous rear-seat comfort, settle into the quiet of the cabin and let Cape Town unfold beyond your window. With your private SVRM chauffeur at the wheel, every journey becomes a moment to unwind — arriving refreshed, composed and ready for whatever awaits.";
export const PHANTOM_DESCRIPTION = "SVRM's flagship chauffeur experience: the Rolls-Royce Phantom combines commanding presence with an unhurried, private journey. A dedicated chauffeur takes care of Cape Town airport arrivals, special occasions, full-day itineraries and multi-day stays.";

const vehicleUses = {
  Signature: "Luxury airport transfers, weddings and private full-day or multi-day journeys.",
  "Premium SUV": "Private Cape Peninsula tours, airport transfers and full-day family travel.",
  Executive: "Airport transfers, business meetings and corporate chauffeur hire.",
  Everyday: "Private airport transfers and day-to-day transport during your stay.",
  Budget: "Airport transfers and private transport for extended Cape Town stays.",
  "Group Travel": "Chauffeured group airport transfers, private tours and conference transport.",
};

interface SearchVehicle {
  name: string;
  slug: string;
  tier: keyof typeof vehicleUses;
}

export function vehicleServiceDescription(vehicle: SearchVehicle) {
  if (vehicle.slug === "mercedes-maybach-s-class") return MAYBACH_DESCRIPTION;
  if (vehicle.slug === FLAGSHIP_SLUG) return PHANTOM_DESCRIPTION;
  return `${vehicle.name} chauffeur hire in Cape Town. ${vehicleUses[vehicle.tier]}`;
}

export function vehicleSearchKeywords(fleet: SearchVehicle[]) {
  return fleet.flatMap(vehicle => [
    `${vehicle.name} chauffeur Cape Town`,
    `${vehicle.name} with driver Cape Town`,
    `${vehicle.name} airport transfer Cape Town`,
  ]).join(", ");
}

export function vehicleServiceOffers(fleet: SearchVehicle[]) {
  return fleet.map(vehicle => ({
    "@type": "Offer",
    url: `https://svrm.group/chauffeur/${vehicle.slug}`,
    itemOffered: {
      "@type": "Service",
      name: `${vehicle.name} chauffeur service Cape Town`,
      description: vehicleServiceDescription(vehicle),
      serviceType: "Private chauffeur hire",
      areaServed: { "@type": "City", name: "Cape Town" },
      provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" },
    },
  }));
}