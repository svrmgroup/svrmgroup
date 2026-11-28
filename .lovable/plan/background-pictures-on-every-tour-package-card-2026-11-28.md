# Background pictures on every tour package card

Every package card on every tour page gets a soft, see-through picture behind its text. The cards will look like the three Cape Peninsula cards: same fade, same text shadow, and the writing stays easy to read. Existing photos come first. New pictures are made only where nothing fitting exists, and each new car picture shows the SVRM GROUP number plate.

## Which picture goes where

Existing photos (the site's own tour, fleet, stay and service images):

| Tour | Packages and photo |
| --- | --- |
| Bo-Kaap | Cooking experience: Bo-Kaap cooking photo. Heritage day: cultural photo |
| Safari | Kruger essentials: safari photo. Sabi Sand: safari service photo. Madikwe & Kruger: Aquila photo. Grand safari: **new** (lodge deck at sunset) |
| Hunting | Plains game: hunting photo |
| Cultural | Cape heritage: cultural photo. National parks: Garden Route photo. Grand tour: **new** (Cape Dutch manor with a luxury car) |
| Adventure | Short: adventure photo. Cape & bush: safari photo. Land, sea & sky: helicopter photo |
| Marine | Penguins & Cape Point: SUV at Boulders photo. Hermanus whales: marine photo. Grand circuit: yacht photo |
| Garden Route | Essentials: Garden Route photo. Coast & forest: **new** (forest road with a V-Class). Cape to Addo: **new** (elephants at Addo) |
| Aerial | Heli flip: helicopter photo. Two Oceans: aerial photo. Balloon: **new** (hot-air balloon over the Winelands) |
| Culinary | Cooking class: Bo-Kaap cooking photo. Markets: culinary photo. Signature: wine photo |
| Wellness | Spa day: wellness service photo. Mountain retreat: wellness photo. Cederberg: **new** (hot springs among rocks) |
| Photography | Lion's Head sunrise: photography photo. Cape Town in a day: Maybach at Cape of Good Hope photo. Signature: **new** (camera at a Clifton sunset) |
| Group travel | City transfer: airport transfer photo. Peninsula group: V-Class Winelands photo. Garden Route group: group travel photo. Weddings & corporate: **new** (event at a wine estate) |
| Romantic / honeymoon | Proposal: anniversary roses photo. Anniversary escape: anniversary photo. Honeymoon signature: romantic photo. Grand romantic: villa photo. Anniversary grand: second anniversary photo. Bespoke honeymoon: **new** (couple's table on a private yacht at sunset) |
| Aquila | Morning, midday and sunset: **new** pictures for each time of day (sunset uses the Aquila photo) |

That makes about 12 new pictures in total. People are shown from behind or not at all, and new pictures carry no brand logos.

## Steps

1. Make the new pictures and keep them in the same style as the current Cape Peninsula ones.
2. Give each package its picture.
3. Check desktop and phone views of every tour page, making sure every card has a picture and the text is readable.

## Technical details

- Packages in `src/data/tours.ts` already have an optional `image` field, which `PricingCard.tsx` already uses for the overlay. The only change is importing the images and setting `image` on each package.
- New images go in `src/assets/tours/` as imported JPGs, under 1600px wide.
- No change to the card's layout, prices or wording.
