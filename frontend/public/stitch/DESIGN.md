---
name: Human Professional
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#5c403c'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#916f6b'
  outline-variant: '#e6bdb8'
  surface-tint: '#bf0715'
  primary: '#b70011'
  on-primary: '#ffffff'
  primary-container: '#dc2626'
  on-primary-container: '#fff6f5'
  inverse-primary: '#ffb4ab'
  secondary: '#5f5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e4e1e6'
  on-secondary-container: '#656467'
  tertiary: '#005e8d'
  on-tertiary: '#ffffff'
  tertiary-container: '#0078b2'
  on-tertiary-container: '#f3f8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#e4e1e6'
  secondary-fixed-dim: '#c8c5ca'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#cbe6ff'
  tertiary-fixed-dim: '#90cdff'
  on-tertiary-fixed: '#001e30'
  on-tertiary-fixed-variant: '#004b71'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  container-max-width: 1280px
---

## Brand & Style

This design system shifts the brand from a utilitarian utility to a sophisticated, "Human Professional" workspace. The aesthetic is anchored in **Minimalism** with a focus on high-clarity information density. By utilizing a pure white canvas and generous negative space, the interface reduces cognitive load for workshop managers.

The tone is authoritative yet approachable—moving away from generic "template" vibes toward a bespoke, high-end SaaS feel. It balances the precision of automotive engineering with a modern, airy atmosphere that prioritizes legibility and intentional action. Red is no longer a background filler but a high-signal tool for guidance and conversion.

## Colors

The palette is strictly curated to emphasize clarity and hierarchy. 

- **Primary Red (#DC2626):** Reserved exclusively for primary Call-to-Actions, critical status alerts (e.g., "Overdue Repair"), and active brand touchpoints.
- **Pure White (#FFFFFF):** The foundational background color to create an open, expansive feel.
- **Subtle Grays:** A ramp of neutral zincs is used for layout structure. `#F4F4F5` is the standard for secondary containers, providing a soft contrast against the white base without the weight of dark slate.
- **Deep Zinc (#18181B):** Used for primary text and high-contrast iconography to ensure maximum readability.

## Typography

The design system utilizes **Hanken Grotesk** for all roles to maintain a cohesive, sharp, and contemporary feel. Its precise geometry reflects engineering excellence, while its open apertures ensure a "human" feel.

- **Headlines:** Use tight letter-spacing and bold weights to command attention.
- **Body Text:** Set with generous line-heights to facilitate scanning long service logs or customer lists.
- **Labels:** Small caps with tracking are used for metadata and category headers to provide a structural "architectural" feel to the interface.

## Layout & Spacing

The layout follows a **Fluid Grid** logic within a fixed-width container for desktop. A strict 4px baseline grid ensures vertical rhythm.

- **Desktop:** 12-column grid with 24px gutters. Page margins are set to 40px to create a "letterhead" style framing that feels premium.
- **Mobile:** Single column with 16px horizontal margins.
- **Padding:** Use "Airy" padding (minimum 16px) inside all cards and containers to prevent content from feeling cramped—essential for a high-traffic workshop environment where speed-of-read is critical.

## Elevation & Depth

This design system avoids heavy shadows in favor of **Ambient Depth**. 

- **Level 0 (Base):** Pure White (#FFFFFF).
- **Level 1 (Subtle Tiers):** Used for the main content background in dashboard views, utilizing `#F8F8F9`.
- **Level 2 (Cards):** White surfaces with a very soft, highly diffused shadow (e.g., `0px 4px 20px rgba(0, 0, 0, 0.04)`) and a 1px border in `#E4E4E7`.
- **Focus States:** A 2px outer glow using a transparent version of the Primary Red to signify active input or selection.

## Shapes

The shape language is **Rounded**, reflecting a modern software tool rather than a legacy industrial terminal. 

- **Standard Components:** Buttons and Input fields use a 0.5rem (8px) radius.
- **Large Components:** Main dashboard cards and modal containers use a 1rem (16px) radius to soften the overall visual impact of the grid.
- **Iconography:** Icons should feature slightly rounded terminals to match the font and corner radius.

## Components

- **Buttons:** Primary buttons are Solid Red (#DC2626) with White text. Secondary buttons are Ghost-style with a Zinc-200 border.
- **Cards:** Cards are the primary vessel for information. They feature no internal borders; instead, use spacing and Hanken Grotesk’s varied weights to create hierarchy.
- **Input Fields:** Use a subtle `#F4F4F5` background with a bottom-only border or a light 1px stroke. The label should always sit above the field in the `label-md` style.
- **Status Indicators:** Use small, high-saturation circular dots for "Live" status. "Urgent" tasks use a light red tint background with the Primary Red text.
- **Lists:** Service records and parts inventories should use "Zebra" striping with very low-contrast grays (#FAFAFA) to maintain readability across hundreds of rows.
- **Chips/Tags:** Used for "Vehicle Type" or "Service Status," these should have a 100px radius (pill) and use neutral color-coding unless an action is required.