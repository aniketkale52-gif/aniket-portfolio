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

## Reference videos
I often put reference videos in the `references/` folder (it is gitignored, so `@` won't find it; I'll type the file name).
Whenever I mention a video, or say "check the reference":
1. Extract frames with ffmpeg yourself, without asking me how:
   `ffmpeg -i references/<file> -vf fps=4 references/frames/<file-name>-%03d.png`
2. Look through the frames and work out the interaction: what moves, the trigger (hover, scroll, load, mouse move), direction, distance and timing.
3. Briefly tell me what you saw and your plan, then implement it on the part of the site I name.
4. Keep my existing design, colors, fonts and animations unless I say otherwise.
5. If I don't give a file name, use the newest video in `references/`. If I give just a name (like "ankitinteraction"), find the matching file in `references/`.

## Videos on the site (`media/` folder)
When I add a video to `media/` for the website:
- Compress it with ffmpeg at good quality: it must look the same, just a smaller file. If I say "keep the original", don't compress.
- Make a poster frame (a still image shown while the video loads).
- Silent preview or background clips: remove audio, and set autoplay, muted, loop, playsinline.
- If I say the video has sound: keep the audio, show play controls, and don't autoplay it.
- Keep each file under 100 MB (GitHub's limit); ideally a few MB for silent clips.