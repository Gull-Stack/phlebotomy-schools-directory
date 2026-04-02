# Design System Specification: Editorial Authority in Healthcare

## 1. Overview & Creative North Star: "The Clinical Curator"
This design system moves beyond the cold, sterile nature of traditional medical interfaces to embrace a "Clinical Curator" aesthetic. The goal is to blend the precision of a high-tech laboratory with the prestige of a heritage medical journal. 

We achieve this by breaking the traditional "grid-of-boxes" layout. We use **intentional asymmetry**, where large editorial serifs command the eye, and **tonal layering**, where depth is defined by soft shifts in surface color rather than harsh lines. This creates a "clean room" feel—spacious, breathable, and hyper-organized—while maintaining a sense of elite authority.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep, authoritative navies and crisp, functional blues, balanced by a sophisticated neutral scale.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning content. To define boundaries, designers must use **background color shifts**. For example, a `surface-container-low` component should sit directly on a `surface` background. The eye should perceive the change in depth through the shift in tone, not a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a physical environment of stacked materials. 
- **Base Layer:** `surface` (#f7f9fb)
- **Secondary Content Areas:** `surface-container-low` (#f2f4f6)
- **High-Priority Interactive Cards:** `surface-container-lowest` (#ffffff)
- **Deep Insets/Modals:** `surface-container-high` (#e6e8ea)

### The "Glass & Gradient" Rule
To evoke a sense of modern medical technology (glass, optics, precision), use **Glassmorphism** for floating navigation or overlay elements. Use a semi-transparent `surface` color with a `backdrop-blur` of 20px. 
*Signature CTA:* Main buttons should utilize a subtle linear gradient from `secondary` (#0058be) to `secondary_container` (#2170e4) at a 135-degree angle to provide a "jewel-like" depth.

---

## 3. Typography: The Tension of Precision
The typographic system relies on the contrast between a high-end serif for narrative authority and a geometric sans-serif for functional clarity.

*   **Display & Headlines (Newsreader/Serif):** Used for "The Voice." These should be set with generous leading and occasional intentional asymmetry (e.g., left-aligned headlines with right-aligned body copy) to feel like a premium publication.
*   **UI & Data (Inter/Sans-Serif):** Used for "The Tool." Inter provides high legibility for clinical data, labels, and interactive components.

| Level | Token | Font | Size | Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Display LG** | `display-lg` | Newsreader | 3.5rem | 500 |
| **Headline MD** | `headline-md` | Newsreader | 1.75rem | 600 |
| **Title LG** | `title-lg` | Inter | 1.375rem | 600 |
| **Body LG** | `body-lg` | Inter | 1rem | 400 |
| **Label MD** | `label-md` | Inter | 0.75rem | 500 (All Caps / Spaced) |

---

## 4. Elevation & Depth
In this system, depth is a tool for focus, not just decoration.

### The Layering Principle
Do not use shadows for static cards. Instead, stack `surface-container-lowest` on `surface-container-low`. The 4-point tonal difference is enough to signify a new layer.

### Ambient Shadows
When an element must float (e.g., a diagnostic popover), use an **Ambient Shadow**:
- **Color:** A tinted version of `on-surface` (Deep Navy) at 4–6% opacity.
- **Blur:** Large and diffused (32px to 64px).
- **Spread:** -5px to ensure the shadow stays "tucked" under the element.

### The "Ghost Border" Fallback
If contrast is required for accessibility (e.g., input fields), use a **Ghost Border**. Apply the `outline-variant` (#c6c6cd) at **15% opacity**. This provides a guide for the eye without breaking the "clean room" aesthetic.

---

## 5. Components

### Buttons (The Precision Tools)
- **Primary:** Gradient from `secondary` to `secondary_container`. Roundedness `md` (0.75rem). No border.
- **Secondary:** Surface `surface-container-highest` with `on-surface` text.
- **Tertiary:** Text-only in `secondary` (#0058be) with an underline that appears only on hover.

### Input Fields
- **Styling:** Background of `surface-container-lowest` (#ffffff) with a 1px Ghost Border. 
- **States:** On focus, the border transitions to a 1.5px solid `secondary` blue, and a subtle `secondary_fixed` (#d8e2ff) outer glow is applied.

### Cards & Lists (The Editorial Feed)
- **Rule:** **Never use dividers.** Use the Spacing Scale (specifically `8` / 2.75rem) to separate list items. 
- **Clinical Data Cards:** Use `surface-container-low` with a `title-sm` header. The "clean room" feel is maintained by ensuring padding is never less than `5` (1.70rem) on all sides.

### Sophisticated Tooltips
- **Styling:** `inverse_surface` (#2d3133) background with 80% opacity and a `backdrop-blur`. This ensures they feel like temporary overlays rather than permanent UI.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use extreme white space. If a layout feels "finished," add 20% more padding.
*   **Do** use cool-toned, high-fidelity photography. Subjects should be in natural light with a blue-shifted white balance.
*   **Do** use `label-md` for metadata, set in Uppercase with 0.05em letter spacing for a "technical" feel.

### Don’t
*   **Don’t** use 100% black (#000000) for text. Use `on_surface` (#191c1e) to maintain a soft, premium contrast.
*   **Don’t** use default 4px rounded corners. Stick to the `md` (12px) scale to soften the clinical edge.
*   **Don’t** use bright "Warning" yellows. For alerts, use `error_container` (#ffdad6) with `on_error_container` (#93000a) for a more refined, urgent look.

---

## 7. Imagery Guidelines
All imagery must follow a **"Clinical Precision"** grade:
1.  **Color Grade:** De-saturate warm tones (reds/yellows); boost the whites and the `secondary_fixed` blue tones.
2.  **Composition:** Use "Rule of Thirds" with significant negative space to allow for `display-lg` typography overlays.
3.  **Subject Matter:** Macro shots of medical tech or candid, professional interactions. Avoid "smiling at camera" stock photography.