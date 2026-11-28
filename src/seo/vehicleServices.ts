export const CHAUFFEUR_DESCRIPTION = "Cape Town private chauffeurs: Maybach, Rolls-Royce, Mercedes, Range Rover and BMW. Airport transfers, Cape Peninsula tours, full-day and multi-day hire.";

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
    url: `https://svrm.group/chauffeur?cat=cars&vehicle=${vehicle.slug}#${vehicle.slug}`,
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