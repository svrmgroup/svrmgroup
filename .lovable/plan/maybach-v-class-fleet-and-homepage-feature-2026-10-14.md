# Maybach V-Class fleet and homepage feature

## Vehicle
- Add **Maybach V-Class** as a separate chauffeur-only vehicle in the Signature fleet at **R20,000 per day**.
- Keep the existing Mercedes V-Class at R9,000/day and the Mercedes-Maybach S-Class unchanged. Do not add the new vehicle to self-drive rentals.
- Add a short, refined description based on the supplied photos, without inventing seating capacity or amenities.

## Photos and scrollable gallery
- Convert the three supplied HEIC files into supported images, then inspect them before editing.
- Edit the actual uploaded vehicle photos: preserve the vehicle and its details, place exterior shots in a cohesive luxury Cape Town setting matching the website, and replace visible number plates with **SVRM**. Preserve interior views where appropriate.
- Deliver optimised images at 4K dimensions, with smaller versions for fast-loading cards. The originals are 1200×1600 and 1440×1920, so 4K requires upscaling rather than recovering original camera detail.
- Give this vehicle a swipeable photo gallery within its chauffeur fleet listing, with previous/next controls and a photo indicator. Keep the existing enquiry booking flow and rate conversion.

## Homepage
- Add the Maybach V-Class to the existing **“Handpicked, this season.”** scrolling offers, showing its photo, short description and R20,000/day rate.
- Link the offer directly to the vehicle’s gallery on `/chauffeur`.
- Preserve the featured Camps Bay villa and all existing offers.

## Technical details
- Extend the vehicle data with an optional gallery; use existing carousel and image components for this vehicle without changing other fleet cards’ appearance.
- Add the vehicle and homepage offer to the CMS seed content and ensure the homepage feature appears when existing CMS offers are loaded, without duplicating it or overwriting other content.
- Store converted/uploaded media through Lovable Assets; edit source photos with the image-editing tool rather than generating a different vehicle.

## Checks
- Verify all three gallery images load, gallery controls work, and the booking form shows the correct vehicle and rate.
- Verify the homepage offer opens the correct chauffeur fleet listing and the ordinary V-Class remains R9,000/day.
- Check image loading, layout and build diagnostics. Publishing is not included unless requested.