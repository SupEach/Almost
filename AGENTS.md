# AGENTS.md — Studio Website

## 1. Project Purpose

This repository contains the personal portfolio website of a professional visual / graphic designer.

The website is intended to present selected professional work clearly, consistently, and with a strong visual hierarchy.

The portfolio currently uses the following six primary project categories:

1. Brand / Identity
2. Events / Exhibitions
3. Posters / Graphics
4. Books / Music
5. Packaging / Products
6. Commercial / Web

The website should prioritize the presentation of the work itself. Code, interaction, animation, and layout should support the portfolio content rather than compete with it.

---

## 2. Source of Truth

When working on this project, use the following order of authority:

1. The user's latest explicit instruction
2. `AGENTS.md`
3. `docs/PROJECT-STATE.md`
4. `docs/DESIGN-SYSTEM.md`
5. Existing implementation in the repository
6. Older conversation context

If older discussion conflicts with the current repository or these documents, follow the current repository and project documents.

Do not restore an older design or behavior only because it appeared earlier in a conversation.

---

## 3. Required Start-of-Task Workflow

Before making meaningful changes:

1. Read `AGENTS.md`.
2. Read `docs/PROJECT-STATE.md`.
3. Read `docs/DESIGN-SYSTEM.md` when the task involves UI, layout, typography, animation, responsive behavior, or visual styling.
4. Inspect only the files relevant to the requested task.
5. Identify existing reusable components before creating new ones.
6. Keep the task scope limited to the user's request.

For a small isolated fix, do not scan the entire repository unless necessary.

---

## 4. Scope Control

Do not modify unrelated pages, components, styles, assets, routes, dependencies, or configuration files unless the requested task genuinely requires it.

Examples:

- A homepage change should not redesign the project-detail page.
- A mobile bug fix should not change desktop layout without reason.
- A typography adjustment should not introduce a new global color system.
- A project-card change should reuse existing card logic whenever possible.
- A bug fix should not become an unrelated architecture refactor.

If a broader change is technically necessary, explain the dependency before making the change.

---

## 5. Preserve Established Decisions

Treat decisions recorded in `PROJECT-STATE.md` as established unless the user explicitly changes them.

Do not repeatedly revisit already approved:

- page structures;
- category names;
- navigation logic;
- project-card behavior;
- typography choices;
- image ratios;
- responsive breakpoints;
- interaction patterns;
- animation direction;
- asset organization.

When the user changes an established decision, update the relevant project documentation after implementing the change.

---

## 6. Design Preservation

This is a design portfolio.

Visual consistency has higher priority than adding decorative features.

Do not introduce a new visual language without explicit instruction.

Prefer:

- fewer strong layout ideas over many decorative effects;
- consistent spacing over arbitrary spacing;
- restrained interaction over excessive animation;
- clear typography over ornamental typography;
- large, well-presented project imagery;
- predictable navigation;
- reusable layout patterns.

Do not independently add:

- gradients;
- glassmorphism;
- excessive shadows;
- random rounded cards;
- decorative icons;
- animated backgrounds;
- cursor effects;
- parallax;
- unnecessary loading animations;
- trendy UI treatments;

unless they already belong to the established design system or are explicitly requested.

---

## 7. Component Rules

Before creating a component, check whether an existing component can be extended.

Prefer:

`existing component + controlled variant`

over:

`duplicate component with slightly different styling`

Shared patterns should be reusable where appropriate, including:

- navigation;
- project cards;
- project metadata;
- section headings;
- image containers;
- captions;
- buttons and text links;
- project-detail modules;
- footer elements.

Avoid premature abstraction. A component should only become shared when there is a meaningful reusable pattern.

---

## 8. CSS and Styling Rules

Follow the styling architecture already used by the repository.

Do not introduce a second styling system without explicit approval.

Prefer existing:

- design tokens;
- CSS variables;
- spacing rules;
- type scales;
- layout utilities;
- breakpoints.

Avoid unexplained one-off values when an existing token can be used.

Do not globally override styles to solve a local problem.

---

## 9. Responsive Rules

Always consider:

- large desktop;
- standard desktop;
- tablet;
- mobile.

Responsive changes should preserve content hierarchy, not merely shrink the desktop interface.

Check for:

- text wrapping;
- image cropping;
- horizontal overflow;
- navigation collisions;
- overly narrow reading widths;
- touch target size;
- viewport-height issues;
- fixed-position elements;
- mobile Safari behavior where relevant.

Do not hide important content on mobile merely to make the layout easier.

---

## 10. Asset Rules

Portfolio artwork is source material and should be treated conservatively.

Do not:

- delete original artwork;
- overwrite originals;
- rename large groups of assets without permission;
- change file formats without reason;
- crop source files destructively;
- recompress assets unnecessarily.

Generated derivatives should be clearly distinguishable from originals.

Use the existing asset directory structure whenever practical.

Do not move assets merely for cosmetic organization if it creates unnecessary path changes.

---

## 11. Content Rules

Do not rewrite project titles, descriptions, credits, dates, client names, categories, or professional information without explicit instruction.

Do not invent missing portfolio content.

When content is missing, preserve the current placeholder or identify the missing field.

Category naming should remain consistent throughout the site.

Primary category names:

- Brand / Identity
- Events / Exhibitions
- Posters / Graphics
- Books / Music
- Packaging / Products
- Commercial / Web

---

## 12. Dependency Rules

Before installing a package:

1. Check whether the task can be completed using the existing stack.
2. Check whether an existing dependency already provides the required capability.
3. Avoid dependencies for trivial functionality.

Do not change package managers as part of an unrelated task.

Do not regenerate lockfiles unnecessarily.

Do not remove dependencies unless their usage has been verified.

If both npm- and pnpm-related files exist, inspect the repository before deciding which workflow is authoritative.

---

## 13. Repository Hygiene

Never intentionally commit or treat the following as project source unless specifically required:

- `node_modules`
- framework caches
- build caches
- local package stores
- temporary files
- local environment files
- OS metadata
- editor caches

Respect `.gitignore`.

Do not modify `.git`, Git remotes, branches, or repository history unless the task explicitly concerns Git.

Do not run destructive Git commands to solve a UI or application problem.

---

## 14. Performance

Portfolio pages may contain many high-resolution images.

Avoid solutions that unnecessarily:

- load all project images immediately;
- render hidden media;
- duplicate large assets;
- trigger expensive animation continuously;
- cause repeated layout recalculation;
- block the initial page with secondary content.

Preserve image quality while using appropriate web delivery techniques.

Performance optimization must not visibly degrade important portfolio imagery without explicit approval.

---

## 15. Accessibility and Usability

Maintain basic accessibility even when pursuing a visually minimal design.

Ensure where applicable:

- interactive elements are keyboard accessible;
- links and buttons remain distinguishable;
- meaningful images receive appropriate alt text;
- focus states are not accidentally removed;
- text remains readable;
- motion does not interfere with navigation;
- touch targets remain usable.

Do not sacrifice basic usability for visual novelty.

---

## 16. Animation Rules

Animation should clarify state, hierarchy, or navigation.

Prefer:

- subtle entrance transitions;
- restrained hover transitions;
- smooth page or content transitions;
- consistent timing.

Avoid animation that delays access to content.

Do not create multiple competing motion systems.

Any new global motion rule should be documented in `DESIGN-SYSTEM.md`.

---

## 17. Bug-Fix Rules

When fixing a bug:

1. Identify the root cause.
2. Prefer the smallest reliable fix.
3. Avoid unrelated refactoring.
4. Check whether the same issue affects reusable components.
5. Verify desktop and mobile behavior when relevant.

Do not hide an error by disabling functionality unless explicitly requested.

---

## 18. Project-State Documentation

Update `docs/PROJECT-STATE.md` when a task results in a meaningful project-level change, including:

- a page being completed;
- a feature being completed;
- an important design decision;
- a route change;
- a new reusable component;
- a major architectural decision;
- a known issue being resolved;
- a new known issue being discovered.

Do not update `PROJECT-STATE.md` for trivial formatting fixes.

Keep the file concise and current.

Replace obsolete information rather than endlessly appending history.

---

## 19. Design-System Documentation

Update `docs/DESIGN-SYSTEM.md` only when an established reusable visual or interaction rule changes.

Examples:

- typography scale;
- global spacing system;
- colors;
- grid;
- image ratios;
- breakpoint policy;
- global animation timing;
- navigation pattern;
- button/link treatment.

Do not document temporary experiments as design-system rules.

---

## 20. Definition of Done

A task is complete when:

- the requested behavior is implemented;
- unrelated behavior remains intact;
- obvious errors are resolved;
- the implementation follows existing project patterns;
- responsive implications have been considered;
- documentation is updated when a lasting project decision changed.

Before declaring a large task complete, briefly identify:

- what changed;
- which files were changed;
- whether any known issues remain.

---

## 21. Thread Philosophy

Conversation threads are temporary working contexts.

The repository is the long-term project memory.

Important decisions must therefore live in:

- code;
- `AGENTS.md`;
- `PROJECT-STATE.md`;
- `DESIGN-SYSTEM.md`;

rather than existing only inside a Codex conversation.

When beginning a new thread, reconstruct context from the repository instead of relying on assumptions about previous threads.