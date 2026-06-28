## SEO foundation for SVRM — approved version

You approved this. Click **Implement plan** below to let me apply it. I will **not** publish — you'll review in the preview first.

### What I'll change

**1. Fix duplicate domain → svrm.group is the official address**
- `index.html` — canonical + og:url → `https://svrm.group/`
- `src/components/Seo.tsx` — base URL → `https://svrm.group`
- `public/sitemap.xml` — all URLs → `svrm.group`, add `/security` and `/rentals`, drop stale ones
- `public/robots.txt` — sitemap line → `svrm.group`

**2. Per-page titles & meta descriptions** (shown in Google results, not on the site)
Updated in each page's `<Seo>` component:
- Home → *SVRM | Luxury Lifestyle Management & Concierge Cape Town*
- Travel → *Luxury Chauffeur Service Cape Town | Private Transfers — SVRM*
- Tours → *Private Cape Town Tours | Safari, Garden Route, Marine — SVRM*
- Stays → *Luxury Villas & Accommodation Cape Town — SVRM Stays*
- Security → *Armed Close Protection & Armoured Vehicles Cape Town — SVRM*
- Rentals → *Luxury Car Rental Cape Town | Self-Drive Premium Fleet — SVRM*
- Lifestyle → *Luxury Lifestyle Management Cape Town — Yachting & Charters | SVRM*
- Experiences → *Bespoke Luxury Experiences Cape Town — SVRM Concierge*
- Blog → *The SVRM Journal — Luxury Travel & Lifestyle Cape Town*
- Contact → *Contact SVRM | Luxury Concierge Cape Town*
- Tour Builder → *Build a Custom Cape Town Tour | Bespoke Itinerary — SVRM*

**3. LocalBusiness structured data in `index.html`**
Invisible JSON-LD block describing SVRM to Google: Cape Town location, services catalogue (chauffeur, tours, stays, security, rentals, charter, concierge), WhatsApp, email, Instagram/TikTok, geo coordinates. Single biggest lever for *"… Cape Town"* searches.

**4. Light keyword copy — added, not replaced**
On each page I'm extending the existing eyebrow/subtitle by a few words to include the searchable terms. Examples (existing words kept, additions in bold-ish here):
- Travel eyebrow → "Travel · Cape Town Chauffeur, Jets, Helicopters & Yachts"
- Travel subtitle → "Private chauffeur-driven cars across Cape Town and the Western Cape, plus private jets, helicopters and luxury yacht charter — switch the category and send the brief."
- Tours eyebrow → "Tours · Private Guided Cape Town & South Africa"
- Stays eyebrow → "Stays · Luxury Villas, Apartments & Hotels in Cape Town"
- Security eyebrow → "Security · Armed Close Protection & Armoured Transport"
- Rentals eyebrow → "Car Rentals · Self-Drive Luxury in Cape Town"
- Lifestyle eyebrow → "Lifestyle · Private Yachting & Curated Days in Cape Town"
- Experiences eyebrow → "Custom Experiences · Bespoke Concierge in Cape Town"
- Blog eyebrow → "Journal · Luxury Travel & Lifestyle Notes from Cape Town"
- Contact eyebrow → "Contact · Luxury Concierge Cape Town"

Nothing removed, no new sections, no design changes — just longer subtitles in the spot they already exist.

### What I'll NOT do
- Not publish (you said hold).
- Not change layout, colours, fonts, imagery, navigation, or any existing copy beyond the eyebrow/subtitle extensions above.
- Not add SEO image (`og:image` already exists).

### After I implement
1. You preview and approve.
2. You publish when ready.
3. I walk you through Google Search Console + Google Business Profile setup (the real unlock for Cape Town searches).

**Click "Implement plan" to proceed.**