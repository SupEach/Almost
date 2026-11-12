# PROJECT-STATE.md — Studio Website

> This file describes the current verified implementation state.
>
> Keep it concise and current. Replace obsolete information instead of maintaining a chronological development diary.

**Last updated:** 2026-11-12
**Audit basis:** User-approved homepage finalization, source/asset audit, responsive browser checks, type checking, and production-rendered route tests.

---

## 1. Project Summary

Studio Website is a personal portfolio website for a professional visual / graphic designer. The current implementation presents a single-page studio introduction and six category landing pages. Portfolio project-detail pages and a populated project archive do not currently exist.

The six canonical categories defined by project policy remain:

1. Brand / Identity
2. Events / Exhibitions
3. Posters / Graphics
4. Books / Music
5. Packaging / Products
6. Commercial / Web

The current UI uses alternate English labels for four categories (`Branding & Logos`, `Events & Exhibitions`, `Editorial & Music`, and `Commercial & Web`). Reconciliation with the canonical taxonomy is **To confirm**.

---

## 2. Technical Architecture

### Framework and runtime

- React `19.2.6` with TypeScript `5.9.3`.
- `vinext` `1.0.0-beta.2` provides a Next.js App Router-compatible runtime on Vite `8.0.13`.
- Source follows App Router conventions under `app/` and imports `next` APIs such as `Metadata`, `headers`, and `redirect` through the vinext compatibility layer.
- Node.js requirement: `>=22.13.0`.
- The homepage is a client component. Category pages and the root layout are server components.
- Cloudflare Worker-compatible output is configured through `@cloudflare/vite-plugin` and `worker/index.ts`.

### Package management

- pnpm 11.22.0 is declared in package.json and matches the existing installed tree.
- pnpm-lock.yaml is authoritative; package-lock.json remains historical and is not maintained.
- Added version-matched Three.js and Cloudflare Worker type declarations; no runtime library upgrade.

### Major dependencies

Runtime:

- `react` / `react-dom` `19.2.6`
- `three` `0.128.0`
- `matter-js` `0.20.0`, loaded on demand for the contact email's FallingText effect
- `motion` `14.10.0`, `@hugeicons/react` `1.1.10`, and `@hugeicons/core-free-icons` `4.4.0` for the contact control
- `simplex-noise` `2.4.0`
- `drizzle-orm` `0.45.2`

Build and development:

- `vinext` `1.0.0-beta.2`
- `vite` `8.0.13`
- `@cloudflare/vite-plugin` `1.37.1`
- `wrangler` `4.92.0`
- Tailwind CSS / PostCSS `4.2.1`
- ESLint `9.39.4` with React, Hooks, JSX accessibility, TypeScript, and Next.js rule sets
- Drizzle Kit `0.31.10`

---

## 3. Current Routes

Use the [page and module naming reference](PAGE-MODULE-MAP.zh-CN.md) when describing design changes or marking screenshots.

| Route | Current implementation |
| --- | --- |
| `/` | Home page containing hero, selected works, category navigation, about, and contact sections. |
| `/works/[slug]` | Dynamic category landing page. It is not a project-detail route. |
| `/experiments/mountain-footer` (local only) | Untracked footer study, excluded from the approved homepage snapshot and GitHub submission. Not linked from Home. |

Supported category slugs:

- `/works/branding-logos`
- `/works/events-exhibitions`
- `/works/posters-graphics`
- `/works/editorial-music`
- `/works/packaging-products`
- `/works/commercial-web`

Additional routing facts:

- `#home`, `#works`, `#about`, and `#contact` are homepage anchors, not standalone routes.
- Unsupported category slugs render an in-page “CATEGORY NOT FOUND” state; the route does not call the framework `notFound()` helper. HTTP status behavior is **To confirm**.
- No standalone project index, project-detail, about, resume, or application API route exists under `app/`.
- `examples/d1/app/api/notes/route.ts` is example code outside the active `app/` route tree.
- Authentication paths described in `README.md` are hosting-platform-owned paths, not application route files.

---

## 4. Current Page State

### Home

**Status:** Implemented.

Current sections and behavior:

- fixed global navigation with desktop anchor links and a mobile menu;
- hero with a Three.js generative wireframe graphic driven by 36 deterministic, peak-preserving terrain profiles: 12 based on well-known real mountains and 24 original mountain variations;
- the orange `STUDIO ALMOST,` hero wordmark uses its original SVG contours for TechText interaction. Hover reveals a dashed outline, selection frame, size label, and specks per glyph. Dragging keeps the full glyph inside the hero, then springs it back on release. Clicking sends a ripple through adjacent glyphs. The original SVG is shown at rest and with reduced motion;
- hero quotation credits display the author and nationality only, without era or century details;
- the “下一座山” control is 150% of its former width while retaining its existing text size; its unselected and hover states remain white, while the selected orange surface uses a restrained one-shot white shine without an outer rim or glow;
- six rotating multilingual slogans selected by the “下一座山” control across 36 mountain scenes; each slogan enters with a brief center-out decryption effect whose temporary characters are restricted to the matching writing system, and all names and coordinates share the same concise presentation without an origin suffix;
- centered hero footer combining the studio introduction and browse prompt, with the orange down arrow below. `Since 2014`, `Visual Design`, `leVel`, `FuZhou`, `Scroll`, and `Explore More` take turns jittering with chromatic offsets in a fast randomized loop;
- continuously scrolling featured-work strip with 18 inline records duplicated for seamless motion, above the single-line `Selected Works` heading without parentheses. React Bits TextPressure loops from Light (`300`, fully transparent) to ExtraBold (`800`, fully opaque), holding each peak for `1s` before easing back. Pointer interaction can still reach Heavy (`900`); the fill remains `#000000`. Local Montserrat stays upright with `-.05em` tracking and natural centered spacing, reaches `156px` on desktop, and uses a `36px` minimum. Motion pauses offscreen or in a background tab; reduced motion displays static, opaque Bold text;
- a white Works section with a full-width grid of twelve category panels below the featured strip. Row rules are inset horizontally and column rules stop at each panel's `16px` corner zones. Each panel has an English title, Chinese label, an `18` case-count placeholder, and an inset arrow to the existing parent category page. Desktop hover or compact-layout tap reveals the full-tile visual with `16px` corners and an orange arrow circle. All twelve image previews include a white React Bits SpotlightCard overlay with pointer-following light, grain, edge light, and a pressed flare. The overlay does not change the white text state or intercept existing controls;
- white About section beginning with two FlowingMenu member rows, followed by the existing viewport-height draggable poster, English slogan, and orange banner composition;
- a black-on-white partner LogoLoop between About and Contact, matching the contact shell width. User-approved React, Next.js, TypeScript, and Tailwind CSS icons temporarily stand in for final partner SVGs; they do not identify actual studio clients. The loop runs right at `100px/s`, uses `48px` logos with `60px` gaps, pauses on hover/focus, and supports dragging/swiping. `partnerLogos` in `app/content/home.ts` is the replacement entry point;
- compact white contact footer using `studioalmostworks@gmail.com`, including its `mailto:` destination. FallingText uses seven word tokens (`studio`, `almost`, `works`, `@`, `gmail`, `.`, `com`) without visible separators. The first three are brand orange; the domain retains the ink color. The `56px` physics area's floor aligns with the sling button's bottom. Tokens can be dragged without activating the mail link and return after settling for `2s` with the pointer away. The solid orange sling displays the supplied brand icon at `44px` in white, without an outer well; the original SVG stays intact. Its fixed “DRAG ME →” label shares the hero footer typography and stays `24px` from the icon (`18px` in compact layouts). At `≤360px`, the label moves above the icon to preserve the complete email. An armed release throws orange particles before opening the existing project-confirmation dialog; click and keyboard activation still work. Copyright and the supplied full orange SVG logo sit below the divider;

#### Locked Home baseline

The complete Home page is the user-approved final design as of **2026-11-12**. Its fixed backup branch is `codex/homepage-final-2026-11-12`; see [the backup guide](HOMEPAGE-FINAL-BACKUP-2026-11-12.zh-CN.md) and [asset inventory](HOMEPAGE-ASSET-INVENTORY-2026-11-12.zh-CN.md).

- Tasks that do not explicitly request a Home-page change must preserve `app/page.tsx` and Home-specific selectors in `app/globals.css`.
- Changes to shared styles or reusable UI must be checked to ensure they do not alter the Home page unless the user explicitly requests that effect.
- The locked hero/navigation baseline includes: logo left, desktop links centered, the enlarged white-default “下一座山” control with an internal white selected-state shine at the right edge, orange hero logo with pointer-driven TechText interaction, language-matched center-out slogan decryption, centered slogan/coordinates, 36 mountain scenes without origin suffixes, nationality-only quotation credits, and a centered hero footer.
- The sections and content inventory listed above are part of this baseline; future changes require an explicit Home-page instruction.

### Footer interaction study

**Status:** Local untracked prototype awaiting approval; not integrated into Home or included in the final snapshot.

- `/experiments/mountain-footer` starts as a white, fixed-view 2.5D black wireframe plane. Pointer contact raises bounded terrain; upward movement raises taller peaks and successive strokes leave multiple mountains.
- Contact uses the existing `#ff7824` brand orange with a gradual return to black along the wires. Terrain slowly returns to its original plane; controls provide an example, shape preservation, and reset.
- The experiment is self-contained under `app/experiments/mountain-footer/`, with no new dependencies or changes to the Home page or global styles. It supports touch drawing and keyboard input. Reduced motion uses immediate updates and retains the shape until reset.
- Canvas resolution is capped; rendering sleeps when settled and pauses offscreen or in a background tab. The compact view reduces visible mesh density.
- Approval of the form, height response, and return speed is still pending. These are experimental choices, not established design-system rules.

### Work browsing

**Status:** Partially implemented on the homepage.

- Category links route to six category landing pages.
- The twelve homepage panels split each category into two visual entries. Their arrows use the same six landing routes.
- Category pages currently end with a `PROJECT ARCHIVE` placeholder stating that project content will be added later.
- There is no populated archive, category filtering of project records, or standalone work index.

### Project detail

**Status:** Not implemented.

- No project-detail route or reusable project-detail module exists.
- No current previous/next-project navigation exists.

### About / Resume

**Status:** About content is implemented as a homepage section.

- Two member rows above the poster composition share the orange banner's width: `leVel` reveals `Director`, and `Pamela` reveals `Co-founder`, each with a circular grayscale sample portrait. Top, middle, and bottom black rules frame the rows. A carried black FlowingMenu band follows pointer/focus/touch and scrolls white role text and portraits. Photos are explicit placeholders under `public/team/`; names, roles, and image paths live in `teamMembers` in `app/content/home.ts`.
- The existing desktop poster composition remains `100svh`; the member rows add height above it. Its base layer pairs the centered `Complete Incomplete` slogan with an orange image that shares the homepage navigation width. The `3 / 4` paper poster starts at the right of the banner on desktop and above the title on compact screens. The paper bends and tilts with the drag. On release, it keeps its new position and angle while the curl and depth gradually settle. The print and banner use `public/about-poster-placeholder.svg` and `public/about-image-placeholder.svg` respectively.
- A PDF exists under `Resume/`, but no application link references it.
- Resume download behavior is **Unknown / To confirm**.

---

## 5. Components and Shared Code

Content lives under app/content and animation components under app/components. Current major surfaces are:

- `RootLayout` in `app/layout.tsx` — shared HTML shell and site metadata.
- `Home` in `app/page.tsx` — the complete homepage.
- `GenerativeCanvas` in `app/components/GenerativeCanvas.tsx` — lazy-loaded Three.js scene with resize guards, cleanup, and WebGL initialization failure isolation.
- `LanguageDecryptedText` in `app/components/LanguageDecryptedText.tsx` — language-specific slogan animation.
- `TextPressure` in `app/components/TextPressure.jsx` — Selected Works pressure, pulse, and ripple animation. The earlier `VariableProximity` component remains available but is no longer used by Home.
- `SpotlightCard` in `app/components/SpotlightCard.jsx` — React Bits spotlight with an overlay variant used by all twelve category image previews; rendering pauses offscreen and in background tabs.
- `AboutPoster` in `app/components/AboutPoster.tsx` — draggable paper with a lazily loaded Three.js scene and a draggable flat fallback.
- `FlowingMenu` in `app/components/FlowingMenu.jsx` — two member rows with a spring-driven carried marquee band, keyboard focus, touch toggling, offscreen pausing, and a static reduced-motion state. Placeholder portrait backgrounds load when the member area enters view. Inactive floating layers are removed from painting as a whole and their child visibility is cleared. Pointer exits finish within the configured duration; scroll hit-testing resets stale pointer activation. This fixes portrait fragments after fast scrolling while preserving the hover, row-switching, focus, and touch interactions.
- `SlingButton` in `app/components/SlingButton.jsx` — React Bits contact control with pointer and keyboard activation and a directional burst on an armed release.
- `LogoLoop` in `app/components/LogoLoop.jsx` — React Bits loop supporting image/node items, pointer/touch dragging, hover pausing, entrance motion, and a static reduced-motion state. Rendering pauses offscreen and in hidden tabs. The homepage uses the horizontal line variant; the component preserves the supplied alternate-layout API.
- `FallingText` in `app/components/FallingText.jsx` — React Bits physics with optional explicit `tokens` and `separator` controls. The `.02em`-tracked email uses seven word tokens with bounce and width-bounded random scatter. Only the resting text receives hover events, so blank space in the larger physics stage cannot trigger a fall. Only text-token clicks open mail; blank clicks are ignored during physics as well. Keyboard/assistive activation remains available. The full stage remains interactive during falling/restoration. It lazy-loads Matter.js, preserves the accessible mail link, supports dragging/restoration, and stays static with reduced motion. Physics pauses offscreen/in background tabs and sleeps when settled.
- `TechText` in `app/components/TechText.jsx` — React Bits component adapted to animate the hero wordmark's original SVG paths.
- `CategoryPage` in `app/works/[slug]/page.tsx` — shared template for all six category slugs.
- `app/chatgpt-auth.ts` — reusable hosting-header authentication helpers; no current page imports them.

Navigation is not a shared React component: the homepage and category template contain separate navigation markup. Global presentation rules are shared through `app/globals.css` and the `.shell` layout class.

---

## 6. Styling System

- Tailwind CSS v4 is loaded through `@import "tailwindcss"` and `@tailwindcss/postcss`.
- The implemented UI is styled primarily with handwritten global selectors in `app/globals.css`; the page markup uses semantic project-specific class names rather than Tailwind utility classes.
- Five root CSS custom properties are defined: `--ink`, `--paper`, `--muted`, `--line`, and `--brand-orange`.
- Many section, artwork, border, shadow, spacing, and motion values remain hardcoded at component-selector level.
- Local Kanit font files are provided for weights 400, 500, 600, and 700.
- Detailed verified values and responsive rules are documented in `docs/DESIGN-SYSTEM.md`.

---

## 7. Project and Content Data

All current portfolio and profile content is hardcoded in TypeScript:

- `categories` in app/content/categories.ts — six shared category records with a safe slug lookup;
- `featuredProjects` — 18 featured records;
- `homeCategoryPanels` — 12 homepage panel labels, preview artwork keys, and parent category links;
- `heroSlogans` — six language variants;
- `mountainScenes` — 36 coordinate, quotation, and terrain-profile records (12 real mountains plus 24 original mountain variations);
- Category introductions and labels now share the same category source as Home.

Current structural facts:

- There is no CMS, JSON content directory, MDX layer, or populated database schema.
- `db/schema.ts` is intentionally empty; `.openai/hosting.json` declares no D1 or R2 binding.
- Featured/profile values and slogans live in app/content/home.ts; terrain records live in app/content/mountains.ts.
- Removed the unused six-record projects array; rendered featured content is preserved.
- Current featured records contain metadata and CSS artwork keys, not project media paths or detail-page slugs.

---

## 8. Asset Structure

```text
/Brand Assets/       Three source SVG files
/public/             Runtime-served SVGs, Open Graph PNG, and fonts
/public/fonts/       Kanit 400, 500, 600, and 700 TTF files
/Resume/             One resume PDF
```

Verified asset behavior:

- The Chinese logo, orange English logo, and main circle graphic in `public/` are byte-identical copies of files in `Brand Assets/`.
- Contact uses `public/brand-logo-icon.svg` and `public/brand-logo-full-orange.svg`, byte-identical copies of the user-supplied `Brand Logo-ICON.svg` and `Brand Logo-FULL Orange.svg` in `D:/Works/Almost/Brand Assets/`. The hero wordmark asset is unchanged.
- `public/partners/` holds four black Simple Icons placeholders and their CC0 license/source notes. Replace the `partnerLogos` configuration with final artwork; no icon package was added.
- The finalized homepage uses 12 independent visible image/icon files (10 SVGs and 2 JPEGs), plus 5 local font files. `public/og.png` is a separate share image, actually `1731×909`; metadata now matches its real dimensions. Repeated loop copies, CSS-generated artwork, canvases, and text glyph icons are counted separately in the [asset inventory](HOMEPAGE-ASSET-INVENTORY-2026-11-12.zh-CN.md).
- Application code currently references the Chinese logo, orange English logo, Open Graph PNG, the About poster SVG, four Kanit font files, and Montserrat Latin.
- `brand-logo-en-green.svg`, `main-graphic-circle.svg`, `file.svg`, `globe.svg`, `window.svg`, `favicon.svg`, and the resume PDF have no direct reference in current application source.
- Current project/card visuals are generated with CSS. The About poster and banner use separate SVG placeholders.
- Image optimization support exists in `worker/index.ts`, but current page code does not use the framework image component.

---

## 9. Responsive Strategy

- The main width breakpoint is `@media (max-width: 800px)`. A contact-only `≤360px` adjustment moves the sling label above the icon so the longer email remains readable.
- There are no separate tablet, desktop, or large-desktop media-query breakpoints.
- Above 800px, layouts rely on CSS grid/flex behavior, `clamp()`, viewport units, and a shared 1440px maximum shell.
- At 800px and below, navigation becomes menu-driven, featured cards narrow, and the category panel grid switches from three to two columns with tap previews.
- A `prefers-reduced-motion: reduce` query disables animation and transitions and removes smooth scrolling.

---

## 10. Build and Deployment

- `dev`, `build`, and `start` scripts invoke the local vinext CLI.
- `vite.config.ts` composes vinext, a local Sites packaging plugin, and the Cloudflare Vite plugin.
- `worker/index.ts` delegates application requests to vinext and handles `/_vinext/image` through Cloudflare image transformation.
- `.openai/hosting.json` contains a Sites project ID and currently sets both `d1` and `r2` to `null`.
- `build/sites-vite-plugin.ts` copies hosting metadata and Drizzle migrations into `dist/.openai` after a build.
- Drizzle is configured for SQLite, but the active schema and migration journal contain no application tables or migrations.
- No Docker, Vercel, Netlify, or GitHub Actions deployment configuration exists in the repository.
- Current hosted URL, access policy, and production deployment status are **Unknown / To confirm** from outside the repository.

---

## 11. Preview and Maintenance Status

- Preview restored at http://127.0.0.1:3000/. Initially no process listened on port 3000; default localhost startup bound only to IPv6 ::1. Vite now uses explicit IPv4 and a strict port.
- Type checking passes, including optional Cloudflare DB binding declarations.
- Finalization validation runs type checking and the production build/rendered-route tests. Lint was not rerun for this finalization; earlier lint notes are historical.
- Production build and 10 rendered-route tests pass. Obsolete starter skeleton tests were replaced.
- Homepage, categories, and animation code are separated without a visual redesign. Three.js is loaded through a lazy component; its chunk still exceeds the build advisory size threshold.
- Unknown slugs including constructor and __proto__ now reach the existing fallback instead of resolving inherited object properties. The existing in-page fallback still returns HTTP 200.
- .pnpm-store and TypeScript build info are now ignored. The previously tracked store file has not been removed from Git.
- README documents preview recovery, checks, and editing entry points.
- Existing taxonomy differences, placeholder portfolio media, and unlinked resume remain.

---

## 12. Open Questions

- Should the implemented English category labels be changed to the canonical project taxonomy?
- What is the approved project-detail route and content schema?
- Which real portfolio assets replace the current CSS-generated project visuals and About poster?
- Should the existing resume PDF be exposed through the site?
- What is the intended source-to-public asset publishing workflow?
- What are the current production URL and Sites access policy?

Do not guess these answers. Confirm them before changing implementation.

---

## 13. Update Rules

Update this document when:

- a major feature is completed;
- a significant design decision becomes final;
- a project-level architecture decision changes;
- a route is introduced or removed;
- a major known issue appears or is resolved.

Do not use this file as a chat transcript or changelog.
