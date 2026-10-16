# FIKA Cafe — Website Redesign

A premium, editorial, Scandinavian-inspired multi-page site for FIKA Cafe (28 Kensington Ave, Toronto), built to drive in-person visits.

## Research first
- Fetch fika.ca pages (home, cafe-menu, products, faq, press, contact-us) to pull real menu items, prices, hours, story copy, press mentions, Instagram URL and contact email.
- Only verified facts appear. Anything not confirmed (hours, phone, events) shows a clear "to be confirmed" note or is omitted.

## Pages
- **Home**: header, image-led hero ("Make Time for Fika." + Explore the Menu / Find Us), fika intro, signature items (cardamom latte, kanelbulle, semla, etc.), atmosphere & garden, gallery preview, press, shop teaser (links to official shop), Visit section with map + Get Directions, Instagram link, footer.
- **Menu**: sticky category tabs (signature hot/iced, coffee & pour-over, tea & matcha, food, pastries, seasonal), prices only where verified, link to the official live menu.
- **Our Story**: fika tradition, design inspiration, coffee and pastry approach.
- **Gallery**: editorial masonry grid with keyboard-accessible lightbox.
- **Visit**: address (copy button), embedded Google Map, directions, hours, dine-in/takeaway/delivery info.
- **Shop**: explains retail vs. café ordering; links out to the official shop — no fake cart.
- **FAQ & Contact**: accordion FAQ, verified contact details (no form unless a destination exists).
- Events omitted unless real events are found.

## Visual direction
- Warm ivory / cream backgrounds, charcoal text, muted sage and taupe accents (adapted to the real logo).
- Editorial serif headlines (e.g. Fraunces or Cormorant) + clean sans body (e.g. Karla).
- Asymmetric grids, generous whitespace, alternating light/dark sections, minimal shadows and rounding.
- Mobile-first with a polished slide-out menu and a sticky "Menu / Directions" bar on phones.

## Imagery
- Real FIKA photos aren't usable without permission, so I'll generate tasteful placeholder imagery (coffee, cinnamon buns, a cozy book-lined interior, garden) that is easy to swap, labelled internally as temporary. You can upload the real photos and logo anytime.

## Technical details
- TanStack routes: `/`, `/menu`, `/story`, `/gallery`, `/visit`, `/shop`, `/faq`, each with its own head() metadata.
- Menu data in a single typed data file for easy updates.
- Design tokens in `src/styles.css` (oklch); fonts via `<link>` in root.
- No backend needed; all commerce goes to fika.ca external links.
