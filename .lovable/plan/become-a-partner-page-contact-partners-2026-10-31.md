# Become a Partner page (/contact/partners)

## Note on wording
Your saved rule says SVRM never uses "partner" wording. This page applies it only to suppliers joining SVRM, never to how SVRM delivers its services. Other pages keep the current wording.

## Public page
- New page at `/contact/partners` in the current black, gold and cream style. Its heading is "Partner With SVRM Group" and its subheading is "Exceptional Assets. Extraordinary Opportunities."
- An intro covers extra income, access to clients and flexible arrangements.
- Four category cards: Vehicle owners, Property owners, Experience providers and Professional services.
- An application form with these required fields: full name, email, WhatsApp number (using the existing country-code field), location, category, description, proposed rates, availability and privacy consent. Business name and photos (up to 6) are optional.
- Extra fields appear for each category:
  - Vehicle: make/model, year, seats, vehicle type
  - Property: property type, bedrooms, area
  - Experience: experience type, capacity
  - Professional: service type, years of experience
- The page works on phones. After submitting, a thank-you message shows. The submission also counts toward the existing Website Enquiry tracking (subject to cookie consent).
- "Become a Partner" is added to the Contact dropdown, in the menu on desktop and on mobile.

## Admin
- A new "Partners" section in /admin lists applications, newest first. You can filter by status and search.
- Each application opens to show all its details, its photos and the proposed rates.
- Statuses are New, Reviewing, Approved and Declined, with an admin notes field.
- Only admins can see applications. Visitors can submit but cannot read anything back.

## Notification
- A new-application email goes to info@svrm.group, using the email setup the site already has, if sending is working. If it isn't, applications are still saved and appear in admin.

## SEO
- Title: "Partner With SVRM Group | Vehicle, Property & Tourism Suppliers", plus a natural description about Cape Town luxury vehicle, holiday property and tourism suppliers.
- Canonical link to https://svrm.group/contact/partners, open to indexing, added to the sitemap and to the static crawler pages.
- The admin pages stay hidden from search, as they are now.

## Technical details
- Table `partner_applications`: name, business, email, phone, location, category, description, rates, availability, details jsonb, photo_urls text[], consent bool, status (default 'new'), admin_notes and timestamps. GRANT INSERT to anon/authenticated, all to service_role; RLS allows insert for anon and select/update/delete for admins only (has_role).
- A private storage bucket `partner-photos` that allows anon insert only. Admins view photos through signed URLs.
- Validation with zod plus the existing phone validation helper. The route goes in App.tsx and `src/seo/prerenderRoutes.ts`, and the nav goes in Nav.tsx/navCategories.ts.
- The admin page follows the existing AdminEnquiries pattern. The route and nav link go in AdminLayout.
- If the email domain is verified: add an owner-notification template with a fixed `to` of info@svrm.group, sent after insert.
- Testing: one test submission through the form, a check that it appears in admin, then deleting that one test row.
