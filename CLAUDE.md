# Aniket Kale portfolio

Static site: plain HTML, CSS and JavaScript. No framework, no build step.
Preview locally with `npm run dev` (zero-dependency server in `dev-server.mjs`, auto-reloads on save).

## Structure
- `index.html`: the whole homepage (styles in the `<style>` block at the top, scripts at the bottom).
- `media/`: case study videos (`case-1.mp4` … `case-4.mp4`) and their poster frames.
- `images/`: portrait (`aniket-eyes-open.webp`, `pupil.webp`), footer card art, logo, icons.
- `logos/`: company logos for the Experience section.

## Design tokens (in `:root`)
- Canvas lavender `#E3E3FF`, cloud cream `#FFF9F1`, ink `#262626`.
- Fonts: Goldman (display, headings, stat numbers) and Space Grotesk (body), from Google Fonts.

## Sections, top to bottom
Navbar (sticky, frosted) → Hero (layered clouds, cursor drift, eyes follow cursor) → Skills marquee →
Bio + stat pills → Work (pinned shrinking heading, 4 case study cards, "View more" cursor pill) →
Experience → Testimonials → Footer (clouds, "Contact me" ticker, floating 3D character card).

## Rules when editing
- Keep text colour `#262626` unless a section says otherwise.
- Respect `prefers-reduced-motion`; every animation has a reduced-motion fallback.
- Case study pages (coming next) should reuse the same navbar, fonts and tokens.
