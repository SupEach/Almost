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
- Five reusable root color variables exist. Spacing, typography, radius, shadow, and motion tokens are not centralized as CSS variables.
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
| Contact | `#b8ff24` |
| Works | Gradient: `#ff7824` → `#ff9a5d` → `#ffd5bb` → `#fff` |

### Text and dividers

- Primary dark text is generally `#0a0a0a` or `#111`.
- Secondary text is not tokenized; current selectors use values including `#777`, `#888`, `#8a8a85`, `#999`, `#a5a5a0`, and alpha-black variants.
- Divider colors are not tokenized; current selectors use `#aaa`, `#cfcfca`, `rgba(10,10,10,.18)`, `rgba(10,10,10,.52)`, and alpha-white variants.
- Portfolio/category placeholder art uses additional local colors inside its own selectors.

### Interaction color

- Orange is the primary interaction accent.
- Navigation underlines use dark ink.
- The contact-pill remains white at rest, hover, and focus. Its selected state uses an orange surface with a one-shot internal white shine and no specular outer rim or glow. The control is text-only and has no trailing circular index.
- Category filter hover/focus/active states change to orange.

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

Current CSS also requests `font-weight: 650` for several major headings. No 650 font face is declared, so exact rendering between 600 and 700 is browser-dependent. A deliberate weight decision is **To confirm**.

### Verified type roles

| Role / selector | Desktop value | Mobile value at `≤800px` |
| --- | --- | --- |
| Hero slogan | `clamp(42px, 6.1vw, 98px)`, weight 650, line-height `.92` | `clamp(38px, 12.6vw, 58px)`, line-height `.88` |
| Works display heading | `clamp(70px, 10.4vw, 154px)`, weight 650, line-height `.86` | `clamp(56px, 18.4vw, 90px)` |
| About display heading | `clamp(58px, 8.7vw, 132px)`, weight 600, line-height `.88` | `clamp(52px, 15vw, 78px)` |
| Category title | `clamp(72px, 11vw, 175px)`, weight 600, line-height `.78` | `clamp(60px, 19vw, 96px)` |
| Contact display | `clamp(52px, 8.5vw, 130px)`, line-height `.92` | `16vw` |
| Biography lead | `clamp(40px, 5vw, 72px)`, line-height `1` | `34px` |
| Body biography | `16px`, line-height `1.9` | `13px`, line-height `1.75` |
| Small labels / metadata | Mostly `6px–13px` with increased letter spacing | Mostly `7px–13px` |

### Typography behavior

- Major display text uses negative tracking; the works heading uses slight positive tracking.
- Hero slogan tracking changes by language through `:lang()` selectors.
- The desktop hero slogan is single-line; mobile permits wrapping.
- Metadata and navigation use small sizes with uppercase Latin text and wide tracking.
- The outlined second line in the contact heading uses transparent fill with a `1.5px` dark stroke.

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
| Works vertical padding | `150px` top / `170px` bottom | `100px` top / bottom |
| About vertical padding | `170px` top / bottom | `100px` top / bottom |
| Featured/category repeated gap | `8px` | `8px` |
| Category-grid top margin | `180px` | `96px` |
| About major section separation | commonly `170px` | commonly `110px` |

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
| Category filters | 6 equal grid columns | Horizontal overflow row |
| Category navigator | 6-panel flex accordion | Horizontal snap scroller; panels `min(82vw, 340px)` |
| Experience stats | 4 columns | 2 columns |
| About intro | `minmax(160px, 240px) 1fr` | `92px 1fr` |
| Capability chart | 5 equal columns | 5 equal columns with vertical labels |
| Client list | 5 columns | 2 columns |
| Category intro | `25% 1fr` | Block layout |

The hero, navigation, category hero, and contact sections use viewport-height sizing with `svh`.

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

- Desktop: six-panel flex accordion, height `clamp(510px, 52vw, 690px)`.
- Collapsed width: `clamp(68px, 6.8vw, 102px)`.
- Expanded panel consumes the remaining width after five collapsed panels and five gaps.
- Radius: `24px`; mobile radius: `20px`.
- Desktop expansion is driven by pointer hover or keyboard focus.
- Mobile renders all panels as full visual cards in a horizontal snap scroller.

### Category filters

- Six equal desktop columns.
- Default label is English; pointer/focus relationships may replace it with the Chinese category label.
- Mobile presents a horizontally scrollable list.

---

## 10. Project Images and Visual Media

### Current implemented roles

- Site logos (`public/*.svg`)
- Open Graph image (`public/og.png`, declared as 1792×931 in metadata)
- CSS-generated featured-card visuals
- CSS-generated category-panel and category-hero visuals
- CSS-generated portrait placeholder
- Three.js hero canvas

No real project-cover, hero, content-grid, image-pair, process-image, video, or caption module exists yet. Image ratios and delivery rules for real portfolio media are therefore **To confirm**.

Current rules that can be verified:

- The featured placeholder ratio is `3 / 4`.
- The portrait placeholder ratio is `3 / 4`.
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
- Category filters use orange on hover, focus-visible, or active state.
- The mail link uses a `2px` bottom border and a large arrow glyph.
- The footer contains telephone and back-to-top links without a separate component style.

### Focus

An explicit orange `2px` focus-visible outline with `4px` offset is implemented for:

- brand link;
- primary navigation links;
- menu button;
- round scroll link.

The contact pill shares its hover and focus-visible visual state. Category filter links have a focus-visible color change. A single global focus treatment for all other interactive elements is not implemented.

### Buttons

- `contact-pill`: rounded “下一座山” control with active, hover, focus, pressed, and 650ms internal white-shine states; its width is 116px desktop and 104px mobile while text sizing remains unchanged.
- `menu-button`: text-only compact-layout navigation control.
- `round-link`: circular orange anchor used for scroll navigation.
- `category-enter`: pill-shaped text inside expanded category links.

There is no generic reusable button component or variant API.

---

## 13. Borders, Radius, Blur, and Shadows

### Borders

- Glass surfaces commonly use `1px` alpha-white borders.
- Dividers commonly use `1px` dark/gray borders.
- The mail link uses a `2px` dark bottom border.

### Radius

No radius tokens exist. Repeated values include:

- `18–21px` for navigation surfaces;
- `16px` / `15px` for featured cards;
- `24px` desktop / `20px` mobile for category panels;
- `28px` desktop / `22px` mobile for category-page blocks;
- `18px` desktop / `12px` mobile for the portrait;
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
| Navigation underline | `250ms` |
| Contact pill | mostly `250ms`; selected internal white shine `650ms` |
| Featured-card expansion | `480ms`, cubic-bezier `(.2,.8,.2,1)` |
| Featured track | `58s` linear infinite; `42s` mobile |
| Category expansion | `720ms`, cubic-bezier `(.2,.75,.2,1)` |
| Category art transform | `900ms`, same easing family |
| Availability pulse | `1.5s` infinite |
| Hero canvas | continuous requestAnimationFrame rotation |

There is no centralized fast/standard/slow motion token set.

### Reduced motion

At `prefers-reduced-motion: reduce`:

- smooth scrolling is disabled;
- CSS animation and transition are disabled globally.

The Three.js hero loop is JavaScript-driven and does not currently check reduced-motion preference, so it continues to render. Whether it should stop is **To confirm**.

---

## 15. Responsive Behavior

At `≤800px`, the implementation:

- reduces shell and navigation insets;
- replaces desktop navigation links with a menu;
- enlarges the English hero logo beyond viewport width while keeping the hero clipped;
- allows the hero slogan to wrap;
- reduces featured-card width and expansion;
- changes filters and category panels to horizontal scrolling;
- changes category panels from accordion presentation to card presentation;
- changes statistics from four to two columns;
- compresses the portrait/biography layout;
- changes the client grid from five to two columns;
- stacks category introductions;
- adapts footer alignment and contact typography.

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
- capability chart, project strip, category navigation, and experience stats have labels;
- reduced-motion CSS is present;
- key navigation controls have explicit focus styling.

Current limitations that are directly visible in source:

- focus styling is not unified across all links;
- the CSS-generated portrait is explicitly labeled as a placeholder;
- mobile category behavior still retains pointer/focus-driven expanded state in component state, though layout makes every card full-width;
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
- Featured-card and portrait ratios: documented
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
