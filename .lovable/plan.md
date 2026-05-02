# SVRM — Homepage v1

A single, polished homepage that establishes SVRM as a premium lifestyle management brand rooted in Cape Town. We'll build the homepage first and decide on additional pages once it sets the tone.

## Brand direction

- **Aesthetic:** Luxury dark & gold concierge feel
- **Palette:** Deep charcoal/near-black background, warm off-white text, brushed gold accent for highlights, dividers and CTAs
- **Typography:** Elegant serif for headlines (e.g. Playfair Display or Cormorant), clean sans-serif for body (e.g. Inter)
- **Tone:** Confident, understated, hospitality-grade

## Page structure (top to bottom)

### 1. Top navigation bar
- SVRM wordmark on the left in gold
- Right side: a single gold "Enquire" button. No other tabs yet — keeps focus on the homepage while the rest is planned.
- Sits transparently over the hero, picks up a subtle dark blur on scroll

### 2. Hero — full-screen cinematic (100vh)

**Background**
- Looping background video, full-screen cover (`object-fit: cover`), autoplay, muted, loop, playsInline
- Footage: Cape Town coastline / mountain pass / luxury car on a scenic road
- Poster image (high-res Cape Town still) shown instantly while video loads, and as fallback on devices that block autoplay
- Dark gradient overlay (~50% opacity, slightly heavier at the bottom) so text stays legible
- For v1 we use a placeholder video URL + premium stock still as the poster; you swap in real SVRM footage later by replacing one file

**Layout**
- Content vertically and horizontally centered, generous whitespace, minimal

**Content**
- Eyebrow (gold, uppercase, wide letter-spacing): *Cape Town · Lifestyle Management*
- Headline (large serif, off-white): *Curated, without compromise.*
- Subheading (clean sans-serif, muted off-white): *Experiences, transport, and stays — precisely arranged.*
- Buttons row:
  - Primary, gold-filled: **Make an enquiry**
  - Secondary, gold-outlined ghost: **Explore services**
- Subtle scroll-cue at the bottom edge

**Performance & accessibility**
- Video is decorative only — content is fully readable without it
- Respects `prefers-reduced-motion`: shows poster image instead of playing video
- Optimised file size; preload metadata only

### 3. Brand promise strip
- Thin section under the hero, three short value props with small gold icons: *Discreet · Bespoke · End-to-end*
- Acts as a visual breath between hero and services

### 4. Hero services preview
- Section heading: *"Three signatures."*
- Three large cards side-by-side (stack on mobile), each with its own atmospheric image, gold-accented title, 1–2 line description, and a subtle "Discover →" link:
  - **Tours** — Curated Cape Town and beyond
  - **Chauffeur** — Discreet, on-demand, anywhere
  - **Accommodation** — Stays selected, not searched
- Card links anchor to the enquiry CTA for now (real pages come later)

### 5. Bespoke / "anything you need" teaser
- Full-width darker band with a single editorial line: *"Beyond the signatures, we handle whatever life requires — cleaning, property, events, errands, the impossible."*
- Short supporting paragraph + gold "Make a request" CTA

### 6. Testimonials strip
- Heading: *"In their words."*
- Three short placeholder quotes in serif italic, each with attribution (Name · Cape Town / London / Johannesburg)
- Three-up on desktop, swipeable on mobile

### 7. Closing call-to-action
- Centered: *"Tell us what you need."*
- Single prominent gold button → enquiry (form added in a later step)

### 8. Footer
- SVRM wordmark, short tagline, Cape Town location, email/WhatsApp placeholders, copyright
- Minimal, gold dividers on dark

## What's intentionally not in v1

- Service detail pages (Tours / Chauffeur / Accommodation)
- For Business page, About page
- Working enquiry form / booking flow
- Real bespoke video footage (placeholder + premium poster used until you provide SVRM's own)

## Technical notes

- Single-page React build using the existing stack (React + Tailwind + shadcn)
- Design tokens (charcoal background, gold accent, serif/sans pairing) added to the global theme so future pages stay consistent
- Hero uses native HTML5 `<video>` with `autoPlay muted loop playsInline preload="metadata"` and a `poster` attribute
- Fully responsive: hero scales to 100vh on all devices, service cards stack, nav collapses to a simple mobile menu
- Placeholder imagery from royalty-free luxury/lifestyle libraries; one-file swap to your own assets later
