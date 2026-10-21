# TikTok section on Contact + Contact hover menu

## Credit check
Before building, I check your credit balance. This is a small change that uses no paid image or video generation, so it costs very little. If your balance is too low, I stop and tell you.

## 1. TikTok section (bottom of Contact page, above the footer)
- Heading: "Follow us on TikTok", with the @svrmgroup handle and a "Follow on TikTok" button.
- 3 clickable cards, each showing the video's own TikTok thumbnail (no new images made). Clicking a card opens that video on TikTok in a new tab.
- Videos:
  1. .../video/7692917244375960854
  2. .../video/7683999741947972886
  3. .../video/7684334622863346966
- Titles: I take each video's caption from TikTok and shorten it into a clean title. If a caption can't be read, I write a short title from what the video shows, and tell you so you can change it.
- Styled like the rest of the site (dark luxury look, gold on hover, stacked on phones).

## 2. Contact hover menu in the top menu
Hovering "Contact" opens a dropdown like the other main menu items:
- Concierge & WhatsApp
- Enquiry form
- FAQ
- TikTok

Each one scrolls to that part of the Contact page.

## Technical details
- Get the thumbnail and caption from TikTok's public oEmbed endpoint (`https://www.tiktok.com/oembed?url=...`) once while building. Save the thumbnails as project images, because TikTok thumbnail links expire. Keep the video links clean, without `?q=&t=`.
- Add a `src/components/svrm/TikTokSection.tsx` component and reuse `TIKTOK_URL`/`SOCIAL_HANDLE` from `src/lib/whatsapp.ts`.
- Add anchors `#concierge`, `#enquiry`, `#faq` and `#tiktok` to `Contact.tsx` with `scroll-mt`, and update the `/contact` entry in `src/lib/navCategories.ts`.
