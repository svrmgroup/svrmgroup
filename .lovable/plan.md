## Refinements — lighter palette + new SVRM mark

Two goals: make the site feel less "AI-default dark template" and refine the brand mark per your direction.

### 1. SVRM wordmark — new treatment

Applied in both `Nav.tsx` (top-left) and `Footer.tsx`.

- Letters **SVRM** in pure off-white (not gold), keep the wide serif letter-spacing
- Directly below the wordmark: a short horizontal **gold line that tapers to a sharp point** on the right (and softens on the left), roughly the width of the letter "S"
- Built with a thin SVG (or a styled div using a gradient that fades to 100% opacity then ends at a clipped triangular tip) so the end is genuinely sharp, not just a fade
- Sits centered under the wordmark with tight spacing (~4px gap)

```text
  S V R M
  ──────▶   (gold, thin, sharp tip)
```

### 2. Lighter, less "AI-dark" palette

Currently the background is almost pure black (`30 8% 6%`), which reads as the default Lovable dark template. We'll lift it to a warm, deep stone — still luxurious, but with daylight in it.

Token changes in `src/index.css`:

| Token | Before | After |
|---|---|---|
| `--background` | `30 8% 6%` (near black) | `32 10% 12%` (warm graphite) |
| `--surface-deep` | `30 10% 4%` | `32 10% 9%` |
| `--surface-raised` | `30 8% 10%` | `32 9% 16%` |
| `--card` | `30 8% 8%` | `32 10% 14%` |
| `--muted` | `30 6% 14%` | `32 8% 20%` |
| `--border` | `36 12% 18%` | `36 14% 26%` (more visible, softer) |
| `--foreground` | `36 25% 92%` | `36 22% 94%` (slightly warmer white) |
| `--muted-foreground` | `36 12% 65%` | `36 14% 72%` (more readable) |
| `--primary` (gold) | `40 55% 60%` | `40 48% 66%` (softer champagne gold, less neon) |
| `--primary-glow` | `42 70% 70%` | `42 55% 78%` |

Hero overlay also lightened so the video shows through more:
- `--gradient-hero-overlay` top stop `0.55 → 0.4`, mid `0.35 → 0.2`, bottom `0.85 → 0.7`

Result: warmer, lighter, more editorial — closer to a hospitality brand site than a default dark dashboard.

### 3. Small de-AI touches (low risk)

- Bespoke section: remove the radial gold blob background (it reads very "AI gradient"). Replace with a single thin gold hairline above the heading.
- Slightly reduce the heaviness of section paddings on mobile so the page breathes more on your 714px viewport.

### Files touched

- `src/index.css` — color tokens + hero overlay
- `src/components/svrm/Nav.tsx` — new SVRM mark with tapered gold underline
- `src/components/svrm/Footer.tsx` — same mark treatment
- `src/components/svrm/Bespoke.tsx` — drop radial gradient, add hairline

### Out of scope

No structural/layout changes to Hero, Services, Testimonials or page order — only color and the wordmark.
