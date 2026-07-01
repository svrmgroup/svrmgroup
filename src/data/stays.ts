// Hotel imports (unchanged)
import hotelCapeGrace from "@/assets/stays/hotel-capegrace.jpg";
import hotelOneAndOnly from "@/assets/stays/hotel-oneandonly.jpg";
import hotelMountNelson from "@/assets/stays/hotel-mountnelson.jpg";
import hotelSilo from "@/assets/stays/hotel-silo.jpg";
import hotelTableBay from "@/assets/stays/hotel-tablebay.jpg";
import hotelBay from "@/assets/stays/hotel-bayhotel.jpg";

// Nox Rentals — short-term villas & apartments (partnership)
import nx_1bed_cape_town_apt_stonewood_at_the_granger from "@/assets/stays/nox/1bed-cape-town-apt-stonewood-at-the-granger.jpg.asset.json";
import nx_beautifully_decorated_apartment_in_cape_town_urban_signature from "@/assets/stays/nox/beautifully-decorated-apartment-in-cape-town-urban-signature.jpg.asset.json";
import nx_old_cape_quarter_1_bedroom_units from "@/assets/stays/nox/old-cape-quarter-1-bedroom-units.jpg.asset.json";
import nx_mouille_point_1_bed_w_sea_views_skyshore_apartment from "@/assets/stays/nox/mouille-point-1-bed-w-sea-views-skyshore-apartment.jpg.asset.json";
import nx_beautiful_apartment_at_the_waterfront_marina_altmore_001 from "@/assets/stays/nox/beautiful-apartment-at-the-waterfront-marina-altmore-001.jpg.asset.json";
import nx_green_point_modern_2bed_apartment_azura_atlantic from "@/assets/stays/nox/green-point-modern-2bed-apartment-azura-atlantic.jpg.asset.json";
import nx_charming_central_apartment_aquene_bay from "@/assets/stays/nox/charming-central-apartment-aquene-bay.jpg.asset.json";
import nx_modern_sea_point_apartment_w_sea_views_alpha_sunsets from "@/assets/stays/nox/modern-sea-point-apartment-w-sea-views-alpha-sunsets.jpg.asset.json";
import nx_2bed_mouille_point_apartment_w_amazing_cape_views from "@/assets/stays/nox/2bed-mouille-point-apartment-w-amazing-cape-views.jpg.asset.json";
import nx_clifton_apartment_w_direct_beach_access_marella from "@/assets/stays/nox/clifton-apartment-w-direct-beach-access-marella.jpg.asset.json";
import nx_de_waterkant_townhouse_with_pool_access_116_dwp from "@/assets/stays/nox/de-waterkant-townhouse-with-pool-access-116-dwp.jpg.asset.json";
import nx_aqua_views_at_the_waterclub_in_cape_town from "@/assets/stays/nox/aqua-views-at-the-waterclub-in-cape-town.jpg.asset.json";
import nx_clifton_3bed_penthouse_sea_views_dunmore_horizons from "@/assets/stays/nox/clifton-3bed-penthouse-sea-views-dunmore-horizons.jpg.asset.json";
import nx_luxurious_penthouse_w_sweeping_views_sea_point_penthouse from "@/assets/stays/nox/luxurious-penthouse-w-sweeping-views-sea-point-penthouse.jpg.asset.json";
import nx_camps_bay_family_holiday_home_sunset_sanctuary from "@/assets/stays/nox/camps-bay-family-holiday-home-sunset-sanctuary.jpg.asset.json";
import nx_mountain_view_holiday_villa_w_garden_pool_iliwa from "@/assets/stays/nox/mountain-view-holiday-villa-w-garden-pool-iliwa.jpg.asset.json";
import nx_4_bed_higgovale_mountain_views_sandstone_apartment from "@/assets/stays/nox/4-bed-higgovale-mountain-views-sandstone-apartment.jpg.asset.json";
import nx_4_bed_coastal_retreat_w_pool_views_llandudno_sands from "@/assets/stays/nox/4-bed-coastal-retreat-w-pool-views-llandudno-sands.jpg.asset.json";
import nx_luxurious_villa_w_breathtaking_sea_mountain_views_hamaya from "@/assets/stays/nox/luxurious-villa-w-breathtaking-sea-mountain-views-hamaya.jpg.asset.json";
import nx_camps_bay_luxury_5_star_5_bed_w_gym_majestic_villa from "@/assets/stays/nox/camps-bay-luxury-5-star-5-bed-w-gym-majestic-villa.jpg.asset.json";
import nx_beautiful_6bed_camps_bay_view_villa_w_pool_ithemba from "@/assets/stays/nox/beautiful-6bed-camps-bay-view-villa-w-pool-ithemba.jpg.asset.json";
import nx_llandudno_beach_oasis_solmara_house from "@/assets/stays/nox/llandudno-beach-oasis-solmara-house.jpg.asset.json";
import nx_luxurious_camps_bay_retreat_w_sea_views_rock_residence from "@/assets/stays/nox/luxurious-camps-bay-retreat-w-sea-views-rock-residence.jpg.asset.json";
import nx_idyllic_camps_bay_villa_w_2_pools_buddha_retreat from "@/assets/stays/nox/idyllic-camps-bay-villa-w-2-pools-buddha-retreat.jpg.asset.json";

export type StayType = "villa" | "apartment" | "hotel";

export interface Stay {
  slug: string;
  name: string;
  area: string;
  beds: string;
  fromZAR: number; // indicative low-season nightly rate (ZAR)
  image: string;
  blurb: string;
  type: StayType;
  /** Sourced via SVRM's Nox Rentals partnership */
  nox?: boolean;
}

export const stays: Stay[] = [
  { slug: "nox-1bed-cape-town-apt-stonewood-at-the-granger", name: "Stonewood at The Granger", area: "City Centre", beds: "1 bed \u00b7 CBD", fromZAR: 1800, image: nx_1bed_cape_town_apt_stonewood_at_the_granger.url, blurb: "Compact CBD studio at The Granger \u2014 walk to everywhere, budget entry.", type: "apartment", nox: true },
  { slug: "nox-beautifully-decorated-apartment-in-cape-town-urban-signature", name: "Urban Signature Apartment", area: "City Centre", beds: "1 bed \u00b7 designer", fromZAR: 2100, image: nx_beautifully_decorated_apartment_in_cape_town_urban_signature.url, blurb: "Beautifully styled 1-bed in the heart of the city.", type: "apartment", nox: true },
  { slug: "nox-old-cape-quarter-1-bedroom-units", name: "Old Cape Quarter Residences", area: "De Waterkant", beds: "1 bed \u00b7 village", fromZAR: 2400, image: nx_old_cape_quarter_1_bedroom_units.url, blurb: "Old Cape Quarter 1-bed with village caf\u00e9s at your doorstep.", type: "apartment", nox: true },
  { slug: "nox-mouille-point-1-bed-w-sea-views-skyshore-apartment", name: "Skyshore Apartment, Mouille Point", area: "Mouille Point", beds: "1 bed \u00b7 sea view", fromZAR: 2800, image: nx_mouille_point_1_bed_w_sea_views_skyshore_apartment.url, blurb: "Sea-facing 1-bed on the Mouille Point promenade.", type: "apartment", nox: true },
  { slug: "nox-beautiful-apartment-at-the-waterfront-marina-altmore-001", name: "Altmore Marina Apartment", area: "V&A Waterfront", beds: "1 bed \u00b7 marina view", fromZAR: 3200, image: nx_beautiful_apartment_at_the_waterfront_marina_altmore_001.url, blurb: "1-bed marina apartment inside the V&A precinct.", type: "apartment", nox: true },
  { slug: "nox-green-point-modern-2bed-apartment-azura-atlantic", name: "Azura Atlantic, Green Point", area: "Green Point", beds: "2 bed \u00b7 stadium view", fromZAR: 3600, image: nx_green_point_modern_2bed_apartment_azura_atlantic.url, blurb: "Modern 2-bed near the stadium and Atlantic promenade.", type: "apartment", nox: true },
  { slug: "nox-charming-central-apartment-aquene-bay", name: "Aquene Bay Apartment", area: "City Centre", beds: "2 bed \u00b7 central", fromZAR: 3900, image: nx_charming_central_apartment_aquene_bay.url, blurb: "Charming 2-bed in central Cape Town \u2014 near the Company Gardens.", type: "apartment", nox: true },
  { slug: "nox-modern-sea-point-apartment-w-sea-views-alpha-sunsets", name: "Alpha Sunsets, Sea Point", area: "Sea Point", beds: "2 bed \u00b7 ocean view", fromZAR: 4400, image: nx_modern_sea_point_apartment_w_sea_views_alpha_sunsets.url, blurb: "Modern 2-bed with sweeping Atlantic sunsets.", type: "apartment", nox: true },
  { slug: "nox-2bed-mouille-point-apartment-w-amazing-cape-views", name: "Mouille Point Cape View Apartment", area: "Mouille Point", beds: "2 bed \u00b7 Cape views", fromZAR: 4800, image: nx_2bed_mouille_point_apartment_w_amazing_cape_views.url, blurb: "2-bed Mouille Point apartment with panoramic Cape views.", type: "apartment", nox: true },
  { slug: "nox-clifton-apartment-w-direct-beach-access-marella", name: "Marella, Clifton Beach", area: "Clifton", beds: "2 bed \u00b7 beach access", fromZAR: 6500, image: nx_clifton_apartment_w_direct_beach_access_marella.url, blurb: "Rare Clifton apartment with direct beach access.", type: "apartment", nox: true },
  { slug: "nox-de-waterkant-townhouse-with-pool-access-116-dwp", name: "116 De Waterkant Townhouse", area: "De Waterkant", beds: "3 bed \u00b7 pool access", fromZAR: 7200, image: nx_de_waterkant_townhouse_with_pool_access_116_dwp.url, blurb: "3-bed De Waterkant townhouse with shared pool.", type: "apartment", nox: true },
  { slug: "nox-aqua-views-at-the-waterclub-in-cape-town", name: "Aqua Views at The Waterclub", area: "V&A Waterfront", beds: "2 bed \u00b7 Waterclub", fromZAR: 8500, image: nx_aqua_views_at_the_waterclub_in_cape_town.url, blurb: "Waterclub 2-bed on the Atlantic seafront.", type: "apartment", nox: true },
  { slug: "nox-clifton-3bed-penthouse-sea-views-dunmore-horizons", name: "Dunmore Horizons Penthouse, Clifton", area: "Clifton", beds: "3 bed \u00b7 penthouse", fromZAR: 12500, image: nx_clifton_3bed_penthouse_sea_views_dunmore_horizons.url, blurb: "Clifton penthouse with 180\u00b0 Atlantic views.", type: "apartment", nox: true },
  { slug: "nox-luxurious-penthouse-w-sweeping-views-sea-point-penthouse", name: "Sea Point Penthouse", area: "Sea Point", beds: "3 bed \u00b7 penthouse", fromZAR: 14000, image: nx_luxurious_penthouse_w_sweeping_views_sea_point_penthouse.url, blurb: "Luxurious Sea Point penthouse with sweeping views.", type: "apartment", nox: true },
  { slug: "nox-camps-bay-family-holiday-home-sunset-sanctuary", name: "Sunset Sanctuary, Camps Bay", area: "Camps Bay", beds: "3 bed \u00b7 pool \u00b7 sea view", fromZAR: 9500, image: nx_camps_bay_family_holiday_home_sunset_sanctuary.url, blurb: "Serene 3-bed Camps Bay family home with pool and ocean views.", type: "villa", nox: true },
  { slug: "nox-mountain-view-holiday-villa-w-garden-pool-iliwa", name: "Iliwa Mountain View Villa", area: "Higgovale", beds: "3 bed \u00b7 mountain \u00b7 pool", fromZAR: 10500, image: nx_mountain_view_holiday_villa_w_garden_pool_iliwa.url, blurb: "3-bed villa under Table Mountain with garden and pool.", type: "villa", nox: true },
  { slug: "nox-4-bed-higgovale-mountain-views-sandstone-apartment", name: "Higgovale Sandstone Residence", area: "Higgovale", beds: "4 bed \u00b7 mountain view", fromZAR: 14000, image: nx_4_bed_higgovale_mountain_views_sandstone_apartment.url, blurb: "4-bed sandstone home with mountain views above the CBD.", type: "villa", nox: true },
  { slug: "nox-4-bed-coastal-retreat-w-pool-views-llandudno-sands", name: "Llandudno Sands Coastal Retreat", area: "Llandudno", beds: "4 bed \u00b7 coastal pool", fromZAR: 18000, image: nx_4_bed_coastal_retreat_w_pool_views_llandudno_sands.url, blurb: "4-bed Llandudno coastal retreat with pool and sea views.", type: "villa", nox: true },
  { slug: "nox-luxurious-villa-w-breathtaking-sea-mountain-views-hamaya", name: "Hamaya Villa, Bantry Bay", area: "Bantry Bay", beds: "4 bed \u00b7 sea & mountain", fromZAR: 22000, image: nx_luxurious_villa_w_breathtaking_sea_mountain_views_hamaya.url, blurb: "Bantry Bay 4-bed with breathtaking sea and mountain vistas.", type: "villa", nox: true },
  { slug: "nox-camps-bay-luxury-5-star-5-bed-w-gym-majestic-villa", name: "Majestic Villa, Camps Bay", area: "Camps Bay", beds: "5 bed \u00b7 gym \u00b7 pool", fromZAR: 32000, image: nx_camps_bay_luxury_5_star_5_bed_w_gym_majestic_villa.url, blurb: "5-star 5-bed Camps Bay villa with gym and pool.", type: "villa", nox: true },
  { slug: "nox-beautiful-6bed-camps-bay-view-villa-w-pool-ithemba", name: "Ithemba Villa, Camps Bay", area: "Camps Bay", beds: "6 bed \u00b7 pool \u00b7 sea view", fromZAR: 42000, image: nx_beautiful_6bed_camps_bay_view_villa_w_pool_ithemba.url, blurb: "Iconic 6-bed Camps Bay view villa with pool \u2014 Ithemba.", type: "villa", nox: true },
  { slug: "nox-llandudno-beach-oasis-solmara-house", name: "Solmara House, Llandudno", area: "Llandudno", beds: "5 bed \u00b7 beach oasis", fromZAR: 48000, image: nx_llandudno_beach_oasis_solmara_house.url, blurb: "Llandudno beach oasis \u2014 5 beds moments from the sand.", type: "villa", nox: true },
  { slug: "nox-luxurious-camps-bay-retreat-w-sea-views-rock-residence", name: "Rock Residence, Camps Bay", area: "Camps Bay", beds: "6 bed \u00b7 sea view", fromZAR: 58000, image: nx_luxurious_camps_bay_retreat_w_sea_views_rock_residence.url, blurb: "Rock Residence \u2014 6-bed Camps Bay retreat with sea views.", type: "villa", nox: true },
  { slug: "nox-idyllic-camps-bay-villa-w-2-pools-buddha-retreat", name: "Buddha Retreat, Camps Bay", area: "Camps Bay", beds: "10 bed \u00b7 2 pools", fromZAR: 95000, image: nx_idyllic_camps_bay_villa_w_2_pools_buddha_retreat.url, blurb: "Buddha Retreat \u2014 flagship Camps Bay 10-bed with two pools.", type: "villa", nox: true },
  // HOTEL ROOMS (SVRM direct — quote on request)
  { slug: "hotel-cape-grace", name: "Cape Grace — Luxury Room", area: "V&A Waterfront", beds: "1 king · harbour view", fromZAR: 11500, image: hotelCapeGrace, blurb: "Five-star landmark on its own private quay.", type: "hotel" },
  { slug: "hotel-one-and-only", name: "One&Only — Marina Room", area: "V&A Waterfront", beds: "1 king · marina view", fromZAR: 14500, image: hotelOneAndOnly, blurb: "Resort-style city hotel with full-service spa.", type: "hotel" },
  { slug: "hotel-mount-nelson", name: "Mount Nelson — Garden Suite", area: "Gardens", beds: "1 king · suite", fromZAR: 12000, image: hotelMountNelson, blurb: "Iconic pink palace at the foot of Table Mountain.", type: "hotel" },
  { slug: "hotel-silo", name: "The Silo — Designer Room", area: "V&A Silo District", beds: "1 king · pillow windows", fromZAR: 13500, image: hotelSilo, blurb: "Reimagined grain silo above the Zeitz MOCAA museum.", type: "hotel" },
  { slug: "hotel-table-bay", name: "Table Bay — Marina Suite", area: "V&A Waterfront", beds: "1 king · marina suite", fromZAR: 9500, image: hotelTableBay, blurb: "Grand waterfront hotel with direct mall access.", type: "hotel" },
  { slug: "hotel-bay-hotel", name: "The Bay Hotel — Beach Room", area: "Camps Bay", beds: "1 king · beach front", fromZAR: 7500, image: hotelBay, blurb: "Boutique five-star directly opposite Camps Bay beach.", type: "hotel" },
];

export const stayTypeLabels: Record<StayType, string> = {
  villa: "Villas",
  apartment: "Apartments",
  hotel: "Hotel Rooms",
};
