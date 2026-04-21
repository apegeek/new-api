---
name: "saas-premium-revamp"
description: "Design and implement premium SaaS/admin UI revamps (Vuexy/Materialize-like). Invoke when user wants cleaner, high-end enterprise style pages or dashboard redesign."
---

# SaaS Premium Revamp

Turn existing product pages into a premium, enterprise-grade SaaS style inspired by modern admin systems (clean light surface, clear hierarchy, strong usability, restrained accents).

## When To Invoke

Invoke this skill when the user asks to:
- upgrade page visuals to "higher-end", "professional", "product-grade";
- mimic or reference styles like Vuexy, Materialize, modern SaaS dashboard templates;
- redesign setup/admin/dashboard/table/form pages without changing backend logic;
- improve visual consistency, spacing rhythm, and component hierarchy.

## Design Philosophy

This style is not about flashy effects. It is about **high information efficiency + calm visual confidence**.

- **Hierarchy First**: typography and spacing define structure before color.
- **Card-Driven Layout**: content is organized into clear cards/sections with consistent elevation.
- **Low-Noise Surfaces**: neutral background + white content planes to keep focus on data/forms.
- **Controlled Accent**: one primary brand hue for actions, status, and focus states.
- **Density With Breathability**: compact enough for admin productivity, but never cramped.
- **Predictable Interactions**: hover/focus/active states are subtle, fast, and consistent.

## Visual DNA (Token Direction)

Use a stable token system and avoid random per-page colors.

- **Primary**: `#5B6CFF` (or brand-aligned nearby blue)
- **Primary hover**: `#4B5BFF`
- **Success**: `#22C55E`
- **Warning**: `#F59E0B`
- **Danger**: `#EF4444`
- **Text primary**: `#0F172A`
- **Text secondary**: `#475569`
- **Page bg**: `#F7F8FC`
- **Card bg**: `#FFFFFF`
- **Border**: `#E9ECF3`
- **Radius scale**: `8 / 12 / 16`
- **Shadow**: very soft, short distance, low opacity

## Layout Rules

- Use a clear shell: `top bar + optional sidebar + centered content container`.
- Keep max content width stable (`1200~1400px`) to avoid over-stretch on wide screens.
- Use 8px spacing grid (`8/12/16/24/32`) and keep it consistent across blocks.
- Important actions stay in predictable corners (primary action right side).
- Tables/forms should preserve generous row height and clear label/value separation.

## Component Styling Rules

- **Cards**: white background, subtle border, minimal blur, gentle shadow.
- **Forms**: label clarity first; inputs with clear focus ring; avoid over-dark backgrounds.
- **Buttons**: primary filled, secondary outlined/ghost; consistent height and radius.
- **Status tags**: low-saturation backgrounds + readable text contrast.
- **Steps/Wizard**: strong current-step emphasis, weak inactive state, visible completion state.
- **Charts/metrics**: prioritize legibility over decoration; no heavy gradients by default.

## Setup Page Revamp Pattern

For pages like `/setup`:

- Build a premium hero container with:
  - short title + concise subtitle;
  - progress stepper with clear active/completed contrast;
  - single dominant form card instead of fragmented panels.
- Group fields into semantic sections (account/security/mode), not raw field list.
- Keep call-to-action path obvious:
  - left/back action is weak;
  - right/next or finish action is visually dominant.
- Add restrained polish:
  - subtle background gradient mesh;
  - soft edge highlights;
  - micro transitions (`120~220ms`).

## Non-Negotiables

- Do not alter backend API contracts or form field semantics.
- Do not reduce Chinese readability for style effects.
- Do not introduce high-contrast neon palettes unless explicitly requested.
- Do not sacrifice interaction clarity for visual novelty.

## Delivery Checklist

When applying this skill, ensure:

- The page has a coherent tokenized visual system.
- Spacing and typography hierarchy are consistent across sections.
- Primary actions are obvious within 2 seconds of scan.
- Empty/loading/error states remain visually integrated.
- Existing business logic and API behavior remain unchanged.

## Prompt Template

Use this template when executing:

`Apply saas-premium-revamp to <page/path>. Keep business logic unchanged. Rebuild visuals with clean enterprise SaaS style, card hierarchy, tokenized colors, and high readability for Chinese content.`
