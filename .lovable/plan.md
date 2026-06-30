## Sitemap verification — findings

**Good:**
- `public/sitemap.xml` exists, uses correct domain `https://svrm.group`
- `robots.txt` references the sitemap correctly
- Covers: Home, Travel, Rentals, Security, Stays, Tours, Tour Builder, Lifestyle, Experiences, Blog (+ 6 posts), Contact

**Missing — 11 tour detail pages** are not listed individually:
`/tours/safari`, `/hunting`, `/cultural`, `/adventure`, `/marine`, `/garden-route`, `/aerial`, `/culinary`, `/wellness`, `/photography`, `/group-travel`

These exist as real routes (`/tours/:slug`) with unique content, so Google should be told about them. Right now Googlebot can still find them by crawling links from `/tours`, but listing them explicitly speeds up indexing and gives them their own priority.

## Plan

1. Add the 11 `/tours/<slug>` URLs to `public/sitemap.xml` (priority 0.7, monthly).
2. Remove the stray blank line in the current file.
3. Leave everything else as-is.

After publishing, resubmit `https://svrm.group/sitemap.xml` in Search Console so Google picks up the new entries.