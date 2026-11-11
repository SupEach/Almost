# DESIGN-SYSTEM.md — Studio Website

> This document records reusable visual and interaction rules verified from the current implementation.
>
> Values documented here describe the code as it exists. They are not a redesign proposal.

**Last audited:** 2026-08-20  
**Implementation source:** `app/globals.css`, `app/page.tsx`, `app/works/[slug]/page.tsx`, `app/layout.tsx`, and assets under `public/`.

---

## 1. Design Objective

Studio Website is a designer portfolio. The implemented system gives visual priority to large typography, generated artwork, category navigation, and generous section spacing.

The current interface combines a restrained black/off-white base with a strong orange brand accent and section-specific presentation colors.

---

## 2. Styling Architecture

- Tailwind CSS v4 is loaded globally with `@import "tailwindcss"` and processed by `@tailwindcss/postcss`.
- Current page markup does not use Tailwind utility-class composition. Presentation is implemented through handwritten global selectors in `app/globals.css`.
- Five reusable root color variables exist. The Works section shares a local radius variable between featured cards and category previews.
- `.shell` is the primary shared width/alignment utility.
- Page-specific and artwork-specific selectors live in the same global stylesheet.

Do not introduce a second styling architecture without an explicit project decision.

---

## 3. Color

### Root tokens

| Token | Value | Current use |
| --- | --- | --- |
| `--ink` | `#0a0a0a` | Primary text / dark UI color |
| `--paper` | `#f0f0eb` | Body background |
| `--muted` | `#9b9b96` | Defined but not directly referenced outside the declaration |
| `--line` | `rgba(255,255,255,.18)` | Defined but not directly referenced outside the declaration |
| `--brand-orange` | `#ff7824` | Brand accent, focus outline, controls, chart, and selected states |

### Section colors

| Surface | Implemented value |
| --- | --- |
| Hero / About | `#fff` |
| Category page | `#f4f3ef` |
| Category archive block | `#0d0d0d` |
| Contact | `#fff` |
| Works | `#fff` |

### Text and dividers

- Primary dark text is generally `#0a0a0a` or `#111`.
- Secondary text is not tokenized; current selectors use values including `#777`, `#888`, `#8a8a85`, `#999`, `#a5a5a0`, and alpha-black variants.
- Divider colors are not tokenized; current selectors use `#aaa`, `#cfcfca`, `rgba(10,10,10,.18)`, `rgba(10,10,10,.52)`, and alpha-white variants.
- Portfolio/category placeholder art uses additional local colors inside its own selectors.

### Interaction color

- Orange is the primary interaction accent.
- Navigation underlines use dark ink.
- The contact-pill remains white at rest, hover, and focus. Its selected state uses an orange surface with a one-shot internal white shine and no specular outer rim or glow. The control is text-only and has no trailing circular index.
- Category panel arrows have an orange circular background during image preview and an orange outline on keyboard focus.

There is no verified global disabled-state color.

---

## 4. Typography

### Typeface stack

```text
Primary: "Kanit"
CJK fallback: "PingFang SC", "Microsoft YaHei"
Generic fallback: sans-serif
```

Local font files exist for Kanit weights 400, 500, 600, and 700, all with `font-display: swap`.

The `Selected Works` heading uses a local Latin subset of Montserrat with a variable weight axis.

Current CSS also requests `font-weight: 650` for several major headings. No 650 font face is declared, so exact rendering between 600 and 700 is browser-dependent. A deliberate weight decision is **To confirm**.

### Verified type roles

| Role / selector | Desktop value | Mobile value at `≤800px` |
| --- | --- | --- |
| Hero slogan | `clamp(42px, 6.1vw, 98px)`, weight 650, line-height `.92` | `clamp(38px, 12.6vw, 58px)`, line-height `.88` |
| Works display heading | `min(11.4cqi, 156px)`, weight 700, line-height `.8`, parentheses at `.9em` | `8.48cqi`, single line, parentheses at `.9em` |
| About slogan | `min(9.7vw, 153px, 20svh)`, weight 500, line-height `.96`, tracking `-.05em` | `clamp(38px, 12.2vw, 90px)`, wraps as needed |
| Category title | `clamp(72px, 11vw, 175px)`, weight 600, line-height `.78` | `clamp(60px, 19vw, 96px)` |
| Contact email | `clamp(21px, 3vw, 40px)` | `clamp(15px, 4.4vw, 21px)` |
| Biography lead | `clamp(40px, 5vw, 72px)`, line-height `1` | `34px` |
| Body biography | `16px`, line-height `1.9` | `13px`, line-height `1.75` |
| Small labels / metadata | Mostly `6px–13px` with increased letter spacing | Mostly `7px–13px` |

### Typography behavior

- Major display text uses negative tracking. `Selected Works` and the English hero slogan share `-.025em` tracking.
- Hero slogan tracking changes by language through `:lang()` selectors.
- The desktop hero slogan is single-line; mobile permits wrapping.
- Metadata and navigation use small sizes with uppercase Latin text and wide tracking.

There is no centralized semantic type-token API; roles are selector-based.

---

## 5. Spacing

### Current status

No named spacing scale is implemented. Values are hardcoded by selector, so a formal `space-*` scale is **Unknown / not currently present**.

### Verified recurring layout values

| Relationship | Desktop | Mobile `≤800px` |
| --- | --- | --- |
| Global shell gutter | `40px` each side | `18px` each side |
| Global shell maximum | `1440px` | No separate maximum change |
| Nav outer inset | `18px` sides, `14px` top | `10px` sides, `8px` top |
| Works vertical padding | `84px` top / `170px` bottom | `72px` top / `100px` bottom |
| About vertical padding | `clamp(20px, 5svh, 64px)` on both ends | `24px` top / `72px` bottom |
| Featured card gap | `8px` | `8px` |
| Category-grid top margin | `180px` | `96px` |
| About slogan top margin | No margin | `clamp(28px, 6vw, 48px)` |

Do not infer a broader spacing scale from these values without a separate normalization decision.

---

## 6. Grid and Layout

### Global content width

```css
.shell { width: min(100% - 80px, 1440px); margin-inline: auto; }
```

At `≤800px`:

```css
.shell { width: calc(100% - 36px); }
```

### Verified layouts

| Area | Desktop | Mobile `≤800px` |
| --- | --- | --- |
| Homepage category panel group | Full-width grid, 12 panels in 3 columns | Full-width grid, 12 panels in 2 columns |
| About composition | One viewport tall. Centered slogan above an orange banner aligned to the homepage navigation edges. The `3 / 4` draggable sheet starts at the right | Content determines height. The banner uses the compact navigation width, and the sheet starts centered above the slogan |
| Category intro | `25% 1fr` | Block layout |

The homepage hero, category hero, and desktop About section use viewport-height sizing with `svh`.

---

## 7. Breakpoints

### Current breakpoints

```text
Mobile / compact layout: max-width 800px
Reduced motion: prefers-reduced-motion: reduce
```

No additional width breakpoints exist.

```text
Tablet-specific breakpoint: Not present
Desktop-specific breakpoint: Not present
Large-desktop breakpoint: Not present
```

From 801px upward, the interface uses the same layout rules with fluid `clamp()`, viewport units, flex/grid sizing, and the 1440px shell maximum.

---

## 8. Navigation

### Desktop

- Fixed near the top of the viewport: `top: 14px`, `left/right: 18px`, height `64px`.
- Rounded translucent white surface with blur, border, gradient, and shadow.
- Chinese brand logo aligns left, Works/About/Contact anchors center, and the 116px-wide “下一座山” control aligns right.
- Desktop links use an animated underline on hover.

### Mobile

- Fixed at `top: 8px`, `left/right: 10px`, height `58px`.
- The central anchor list is replaced by a text menu button.
- Open navigation appears below the bar as a vertical translucent panel.
- `aria-expanded` and contextual open/close labels are implemented on the menu button.

### Category pages

- Use a separate fixed navigation implementation at the same general visual style.
- Provide the Chinese logo and an “ALL WORKS” link back to `/#works`.

There is no current-route active state because primary navigation targets homepage anchors. Navigation markup is not currently a reusable component.

---

## 9. Project Cards and Category Panels

### Featured cards

- The strip spans the width above the works heading. The strip has `clamp(4px, .55vw, 9px)` bottom padding and the heading has `clamp(12px, 1.25vw, 24px)` top margin. The strip reserves the default card height and cards expand upward on hover.
- Visual ratio: `3 / 4`.
- Card radius: `16px`; inner visual radius: `15px`.
- Desktop width: `(100vw - 72px) / 9`.
- Mobile width: `(100vw - 28px) / 3`.
- Featured records are rendered twice for continuous horizontal scrolling.
- Default scroll duration: `58s`; mobile: `42s`.
- Hover pauses the track and expands a card to `2.05×` desktop width or `1.45×` mobile width.
- Current visuals are CSS-generated placeholder compositions, not image assets.
- Only the record number and English title are rendered in each visual; title/category/year metadata styles exist in CSS but are not rendered by the current card markup.

### Category panels

- Square white tiles span the page width. The `1px` column rules are split by row, with each segment inset `16px` from the top and bottom to align with the preview's corner radius. Horizontal rules between rows are inset to each tile's text edges. Each tile has a left-aligned English title and a lower row with a black Chinese label, white count pill, and `→` link.
- The preview fades in across the entire tile with the featured card's `16px` corner radius as the title and badges fade out. The arrow gains a 36px orange circle inside its 44px link target. Tile dimensions stay fixed during preview.
- A fine hover pointer reveals the preview on desktop. Compact and touch layouts toggle the preview by tapping the tile, and a keyboard user can toggle it with Enter or Space. A new tap selection closes the previous one.
- Each count displays the provisional value `18`. The arrow links to the corresponding parent category page.

---

## 10. Project Images and Visual Media

### Current implemented roles

- Site logos (`public/*.svg`)
- Open Graph image (`public/og.png`, declared as 1792×931 in metadata)
- CSS-generated featured-card visuals
- CSS-generated category-panel and category-hero visuals
- Replaceable About poster and banner SVGs
- Three.js hero canvas

No real project-cover, hero, content-grid, image-pair, process-image, video, or caption module exists yet. Image ratios and delivery rules for real portfolio media are therefore **To confirm**.

Current rules that can be verified:

- The featured placeholder ratio is `3 / 4`.
- The About poster ratio is `3 / 4`.
- The About banner uses a `24 / 7` desktop ratio capped at `44svh`, and a `2.2 / 1` compact ratio. It crops its replacement image to fill the frame.
- Artwork surfaces use intentional clipping through `overflow: hidden`.
- Framework/Cloudflare image optimization is configured at worker level but not exercised by the current page components.

---

## 11. Category Page Layout

The existing dynamic route is a category landing page, not a project-detail template.

Current hierarchy:

1. Fixed category navigation
2. Full-viewport category hero
3. Two-column category introduction
4. Dark project-archive placeholder block

The category hero has a `28px` radius on desktop and `22px` on mobile. The current archive does not render project cards or detail links.

A reusable project-detail layout is **Unknown / not implemented**.

---

## 12. Links and Controls

### Text links

- Global anchors inherit color and remove underlines.
- Desktop navigation links show a dark animated underline on hover.
- Category panel arrows sit on an orange circle while their panel preview is active.
- The white contact footer places the mail link on the left and the frosted orange sling control on the right of a shared row with a `2px` dark bottom rule.

### Focus

An explicit orange `2px` focus-visible outline with `4px` offset is implemented for:

- brand link;
- primary navigation links;
- menu button;
- round scroll link.

The contact pill shares its hover and focus-visible visual state. Category panel previews and arrows have a visible orange inset outline on keyboard focus.

### Buttons

- `contact-pill`: rounded “下一座山” control with active, hover, focus, pressed, and 650ms internal white-shine states; its width is 116px desktop and 104px mobile while text sizing remains unchanged.
- `menu-button`: text-only compact-layout navigation control.
- `round-link`: circular orange anchor centered under the studio copy in the hero footer. The link scrolls to `#works`.
- `SlingButton`: circular frosted contact control with a brand-orange face, a mail icon, and a visible “一键联系” label.
- `category-enter`: 44px square arrow link inset from the lower-right corner by the panel's horizontal text padding and `8px` from the bottom. The arrow shares this position in both preview states.

There is no generic reusable button component or variant API.

---

## 13. Borders, Radius, Blur, and Shadows

### Borders

- Glass surfaces commonly use `1px` alpha-white borders.
- Dividers commonly use `1px` dark/gray borders.
- The contact row uses a `2px` dark bottom border.

### Radius

The Works section shares `--works-card-radius` (`16px`) between featured cards and category previews. Other repeated values include:

- `18–21px` for navigation surfaces;
- `16px` / `15px` for featured cards;
- Square corners for the homepage category panels;
- `28px` desktop / `22px` mobile for category-page blocks;
- `999px` or `50%` for pills and circles.

### Blur and shadow

- Navigation and glass cards use `backdrop-filter` blur between `20px` and `22px` with saturation.
- Multiple one-off shadows define navigation, featured-card, pill, and circular-link elevation.
- There is no shared elevation scale.

---

## 14. Motion

### Implemented motion roles

| Role | Current implementation |
| --- | --- |
| Hero slogan entrance | `500ms`, cubic-bezier `(.22,.8,.3,1)`, fade/translate/blur |
| Hero footer copy | Six keyword groups jitter one at a time with chromatic offsets. Pauses are `120–480ms` between groups and `450–900ms` between rounds. The loop runs while the copy is visible. |
| Selected Works title | React Bits VariableProximity interpolates Montserrat weight from `700` to `900` with linear falloff within `100px` of the pointer. Letters and parentheses ease back to Bold as the pointer moves away. |
| About paper poster | The textured sheet curls at the grabbed edge and tilts with the direction and extent of the drag. It holds its drop position and angle as the bend and depth settle. Reduced motion uses a flat drag. |
| Navigation underline | `250ms` |
| Contact pill | mostly `250ms`; selected internal white shine `650ms` |
| Featured-card expansion | `480ms`, cubic-bezier `(.2,.8,.2,1)` |
| Featured track | `58s` linear infinite; `42s` mobile |
| Homepage category preview | `250ms` opacity transition |
| Contact sling | The icon stretches the band with the pointer. An armed release recoils and throws brand-orange particles before opening the mail draft. Click and keyboard activation open the draft directly. |
| Hero canvas | continuous requestAnimationFrame rotation |

There is no centralized fast/standard/slow motion token set.

### Reduced motion

At `prefers-reduced-motion: reduce`:

- smooth scrolling is disabled;
- CSS animation and transition are disabled globally.
- The hero footer and Selected Works title display as static text.
- The contact sling opens the draft with an immediate return and no particle burst under reduced motion.

The Three.js hero loop is JavaScript-driven and does not currently check reduced-motion preference, so it continues to render. Whether it should stop is **To confirm**.

---

## 15. Responsive Behavior

At `≤800px`, the implementation:

- reduces shell and navigation insets;
- replaces desktop navigation links with a menu;
- enlarges the English hero logo beyond viewport width while keeping the hero clipped;
- allows the hero slogan to wrap;
- reduces featured-card width and expansion;
- lays out the category panels in two columns and activates tap previews;
- preserves side gutters around the enlarged About poster;
- stacks category introductions;
- reduces the contact email size so the email and action fit on one row.

There is no intermediate tablet-specific layout. Behavior on viewport widths near 800px should be treated as one breakpoint transition.

---

## 16. Accessibility

Verified current support:

- root document language is `zh-CN`;
- menu button exposes `aria-expanded` and contextual labels;
- hero slogan updates use `aria-live="polite"`;
- decorative logo usage supplies empty alt text where an adjacent accessible label exists;
- the hero English logo has `alt="Studio Almost"`;
- the Three.js canvas wrapper is `aria-hidden`;
- the project strip, category navigation, and About poster have labels;
- the About poster can be moved with the arrow keys and lifted with Enter or Space;
- reduced-motion CSS is present;
- key navigation controls have explicit focus styling.

Current limitations that are directly visible in source:

- focus styling is not unified across all links;
- the JavaScript hero animation does not honor reduced-motion preference.

Color-contrast conformance has not been measured and is **To confirm**.

---

## 17. Design-System Audit Summary

### Verified coverage

- Font family and available weights: documented
- Major type roles: documented
- Root colors and major section colors: documented
- Global gutters and maximum width: documented
- Current grid structures: documented
- Breakpoint policy: documented
- Featured-card and About poster ratios: documented
- Navigation behavior: documented
- Common radius / shadow / blur patterns: documented
- Motion durations and easing: documented
- Reduced-motion CSS: documented

### Not established in current code

- semantic spacing scale;
- semantic type token names;
- radius or elevation token scale;
- centralized motion tokens;
- real project-image roles and delivery rules;
- project-detail layout modules;
- tablet and large-desktop breakpoints;
- generic reusable link/button component APIs.

### Verified consistency risks

1. Only colors have root variables; other repeated design values remain selector-specific.
2. Secondary text and divider colors use several near-equivalent hardcoded values.
3. Major heading styles request weight 650 without a matching local font file.
4. Navigation patterns are visually related but implemented separately.
5. Real project-media behavior cannot be documented until real media modules exist.

These risks are audit findings only. They are not authorization to refactor or redesign the implementation.

---

## 18. Change Policy

Update this document only when a reusable visual or interaction rule changes, including:

- global type scale or font selection;
- site gutters or grid behavior;
- breakpoint policy;
- project-card ratio or interaction;
- navigation behavior;
- global color or motion treatment;
- real project-image module behavior.

A one-off project composition does not automatically become a system rule.
