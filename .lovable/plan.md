# SVRM Group — Google SEO & AI Search Implementation

Implements the uploaded brief in priority order, keeping the design, logo, booking forms, admin, WhatsApp links and /chauffeur URL unchanged.

## Decisions taken from the brief
- **Star rating removed from search data.** The homepage currently tells Google "5.0 stars" with no reviews behind it on the site. The brief forbids unbacked ratings, and Google already flagged it. Reviews will keep living on your Google profile.
- **Range Rover and BMW X5:** described as "available on request, subject to availability". The site won't claim you own them.
- **Partner services** (jets, helicopters, yachts, security, safaris): worded as "arranged through trusted specialist partners".
- **No street address** in the search data. The site will show a Cape Town service area only.
- **Blog:** no mass publishing. The site gets a list of 8 article ideas for you to review, plus at most 2 finished articles where we already have real facts (chauffeur guide, chauffeur vs self-drive).

## 1. Chauffeur page (top priority)
- Title "Luxury Chauffeur Services Cape Town | SVRM Group"; one main heading "Luxury Chauffeur Services in Cape Town".
- New short sections, all in the current style: airport collections, executive and corporate travel, full-day chauffeurs, private tours, multi-day transport, how booking works, and international visitors (UK, US, UAE and Saudi guests, family trips, halal-conscious arrangements).
- One WhatsApp button per section, using the brief's chauffeur message.

## 2. Tours
- Better titles and descriptions for the tours page and each tour page, focused on private tours (Peninsula, Cape Point, Boulders, Winelands, Stellenbosch, Franschhoek, Hermanus, Garden Route).
- A "Why a private tour" section: flexibility, privacy and pickup anywhere. Only real itinerary facts; no new inclusions or prices.
- A tour-specific WhatsApp message.

## 3. Business identity and search data
- One shared set of business details (name, email, WhatsApp, Instagram and TikTok @SVRMGROUP, logo) used everywhere.
- Organization, WebSite and LocalBusiness search data, with service area only. Service search data on the main pages, plus page-path ("breadcrumb") data on service and tour pages.
- Remove duplicate or conflicting search data between the fallback homepage file and individual pages.

## 4. About and trust
- Expand the About section on the home page: what SVRM does directly, what partners provide, discretion and personal service. No invented testimonials, press or credentials.

## 5. AI search answers
- Add the brief's six customer questions to the FAQ. Each gets a real answer and the clickable WhatsApp number, using the existing FAQ system.

## 6. Technical SEO
- Check every public page for title, description, canonical link, a single main heading and alt text on images, and fix gaps.
- Confirm /travel redirects to /chauffeur, the sitemap lists only live pages, and admin and private pages are marked "do not index".
- **Crawlers that don't run JavaScript:** after each build, generate a static page for each main public URL with the right title, description, canonical link, search data and a short text summary. The live app keeps running normally on top. Full server rendering would mean moving the site to Lovable's newer template, which I won't do without asking.

## 7. Speed and tracking
- Check the main images' sizes and loading order on chauffeur, tours and airport pages, without lowering photo quality.
- Make sure enquiry-form submissions fire a conversion alongside the existing WhatsApp click tracking.

## 8. Final report
- Written into your marketing documents, covering the brief's 10 points.
- It will clearly separate what was done from what needs you: Google Business Profile categories and photos, the Bing Webmaster account, publishing, Search Console re-inspection, and genuine review requests.

## Technical details
- `src/lib/business.ts` holds the business details; JSON-LD builders reuse it.
- `Index.tsx` drops `aggregateRating`; deduplicate JSON-LD against `index.html`.
- A Vite `closeBundle` plugin writes `dist/<route>/index.html` from a route-meta table (title, description, canonical, JSON-LD, `<noscript>` summary). Needs a check that the hosting serves nested index.html files before the SPA fallback.
- FAQ additions go in `src/data/faqExpansion.ts` and must pass the existing `faq.test.ts`. Add a test that the homepage schema has no `aggregateRating`, and one that every sitemap URL is a real route.
- Update `AGENTS.md` (business-details rule, prerender rule) and `roadmap.md`.
