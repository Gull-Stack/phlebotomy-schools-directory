# Design System Document: The Clinical Editorial Scale

## 1. Overview & Creative North Star

**Creative North Star: "The Digital Clinician"**

This design system moves beyond the generic "directory" look to establish a high-end, editorial experience that mirrors the precision of the medical field. Our goal is to balance **Clinical Authority** with **Human Trust**. 

We achieve this through an "Editorial-First" layout strategy. Instead of rigid, boxed-in grids, we utilize intentional white space, sophisticated tonal layering, and high-contrast typography scales. The interface should feel like a premium medical journal—authoritative yet breathable—breaking the "template" feel with overlapping elements and asymmetric compositions that guide the eye naturally through complex certification data.

---

## 2. Colors & Surface Philosophy

The palette is rooted in deep medical navies and surgical teals, engineered to provide a sense of sterile reliability without feeling cold.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1-pixel solid borders to define sections. Layout boundaries must be established solely through background color shifts. For example, a `surface-container-low` section should sit directly against a `surface` background to create a clean, modern break.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Base:** `surface` (#f8f9ff)
*   **Layer 1 (Subtle Inset):** `surface-container-low` (#eef4ff)
*   **Layer 2 (Elevated Card):** `surface-container-lowest` (#ffffff)
*   **Emphasis:** Use `surface-bright` for areas requiring maximum user attention.

### The "Glass & Gradient" Rule
To elevate the brand beyond a standard bootstrap look:
*   **Glassmorphism:** Use for floating navigation or hovering "Quick Info" panels. Apply `surface` at 70% opacity with a 12px-20px backdrop-blur.
*   **Signature Textures:** For primary CTAs and hero backgrounds, use a subtle linear gradient (135°) transitioning from `primary` (#004ac6) to `primary_container` (#2563eb). This adds "visual soul" and depth.

---

## 3. Typography

The typographic system utilizes a dual-font approach to marry clinical precision with modern accessibility.

*   **Display & Headlines (Inter):** High-waisted, neutral, and highly legible. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero sections to create an editorial impact.
*   **Labels & Accents (Plus Jakarta Sans):** A slightly more geometric and "friendly" sans-serif used for metadata, tags, and small utility text. This contrast signals a shift from "Reading" to "Action."

**Hierarchy Intent:** 
*   **Headlines** convey the "Medical Grade" authority.
*   **Body Text** focuses on "Accessible Trust," utilizing `body-lg` (1rem) for maximum readability in school descriptions.

---

## 4. Elevation & Depth

We eschew traditional "Drop Shadows" in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking surface tokens. A `surface-container-lowest` card placed on a `surface-container-low` background creates a soft, natural lift without the need for visual noise.
*   **Ambient Shadows:** Where floating is required (e.g., a sticky "Apply Now" button), use extra-diffused shadows.
    *   *Spec:* `0 20px 40px rgba(18, 28, 40, 0.06)`. The shadow color must be a tinted version of `on-surface` rather than pure black.
*   **Ghost Borders:** If a border is required for accessibility (e.g., in high-contrast situations), use the `outline-variant` token at **20% opacity**. Never use 100% opaque, high-contrast borders.

---

## 5. Components

### Buttons
*   **Primary:** Uses the "Signature Texture" gradient. `md` roundedness (0.75rem). Text is `label-md` uppercase for authority.
*   **Secondary:** `surface-container-lowest` with a "Ghost Border."
*   **Tertiary:** Text-only using `tertiary` color (#006058), reserved for low-priority actions like "Learn More."

### Cards & Lists
*   **The Divider Rule:** Forbid the use of horizontal rules. Separate school listings using vertical white space (Spacing `8` or `10`) or alternating background tints between `surface` and `surface-container-low`.
*   **School Cards:** Use `xl` roundedness (1.5rem) for a friendly, modern feel.

### Input Fields
*   **State:** Default state uses `surface-container-low`.
*   **Focus:** Transition to a `primary` ghost border (2px) with a subtle `primary-fixed` outer glow.
*   **Labels:** Always use `label-sm` in `on-surface-variant` for a clean, clinical aesthetic.

### Additional Signature Components
*   **The "Credential Chip":** Use `tertiary_container` with `on_tertiary_container` text for school certifications (e.g., "CAAHEP Accredited"). 
*   **Success Indicator:** For "Fast Completion" or "High Salary" callouts, use a soft `tertiary_fixed` background to suggest growth and health.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. For example, offset a school's hero image to the right, allowing the headline to break the vertical grid line on the left.
*   **Do** prioritize "Breathing Room." If a section feels crowded, increase the padding to the next step in the spacing scale (e.g., move from `12` to `16`).
*   **Do** use high-quality photography with cool color grading to match the `primary` blue tones.

### Don't
*   **Don't** use 1px solid black or grey dividers. This shatters the "editorial" feel and makes the site look like a legacy database.
*   **Don't** use sharp 90-degree corners. Everything should feel approachable, utilizing the `md` (0.75rem) or `lg` (1rem) corner radius.
*   **Don't** use harsh drop shadows. If a component doesn't look elevated through color alone, re-evaluate the surface hierarchy before adding a shadow.