export interface Extra {
  id: string;
  label: string;
  note?: string;
}

// Add-ons offered on top of any stay enquiry.
export const stayExtras: Extra[] = [
  { id: "chauffeur", label: "Add chauffeur", note: "Daily / on-call driver" },
  { id: "chef", label: "Add private chef", note: "Breakfast, dinner, events" },
  { id: "housekeeping", label: "Daily housekeeping" },
  { id: "airport", label: "Airport transfer" },
  { id: "yacht", label: "Yacht day" },
  { id: "tour", label: "Tour package" },
  { id: "security", label: "Close protection" },
  { id: "wellness", label: "In-villa spa / wellness" },
];

// Add-ons offered on car rentals.
export const rentalExtras: Extra[] = [
  { id: "child-seat", label: "Child seat" },
  { id: "additional-driver", label: "Additional driver" },
  { id: "delivery", label: "Delivery to address" },
  { id: "chauffeur", label: "Add chauffeur" },
  { id: "wifi", label: "Mobile Wi-Fi" },
  { id: "insurance-plus", label: "Premium insurance" },
];

export const pickupLocations = [
  "Cape Town International Airport",
  "V&A Waterfront",
  "Camps Bay",
  "Custom address",
];
