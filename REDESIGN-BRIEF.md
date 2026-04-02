# PhlebGuide Complete Redesign Brief

## OBJECTIVE
Apply the new "Clinical Excellence" design system from the Stitch reference files to ALL pages of this Next.js site. Keep ALL existing content, data fetching, functionality, and Supabase integration. Only change CSS/styling and layout structure.

## REFERENCE FILES (in ./stitch_reference/)
- `home_page_desktop/code.html` — Homepage desktop design (PRIMARY REFERENCE)
- `home_page_mobile/code.html` — Homepage mobile design
- `state_directory_ca_desktop/code.html` — State directory page desktop
- `state_directory_ca_mobile/code.html` — State directory page mobile
- `program_details_desktop/code.html` — School detail page desktop
- `program_details_mobile/code.html` — School detail page mobile
- `blog_post_desktop/code.html` — Blog post page desktop
- `blog_post_mobile/code.html` — Blog post page mobile
- `clinical_excellence/DESIGN.md` — Full design system spec
- `clinical_clarity/DESIGN.md` — Alternative design system spec

## DESIGN SYSTEM (from Stitch reference)

### Fonts
- **Headlines:** Newsreader (serif) — already in layout.tsx as `--font-newsreader`
- **Body/Labels:** Inter (sans-serif) — already in layout.tsx as `--font-inter`
- Use `font-headline` / `font-serif` class for Newsreader, `font-body` / `font-inter` for Inter

### Colors (already in tailwind.config.js)
The design tokens are already configured. Key ones:
- `secondary` (#0058be) — primary blue for CTAs, links, accents
- `secondary-container` (#2170e4) — lighter blue
- `surface` (#f7f9fb) — base background
- `surface-container-low` (#f2f4f6) — subtle section backgrounds
- `surface-container-lowest` (#ffffff) — white cards
- `primary-container` (#131b2e) — dark navy for newsletter/CTA sections
- `on-surface` (#191c1e) — primary text (NOT pure black)
- `on-surface-variant` (#45464d) — secondary text
- `outline-variant` (#c6c6cd) — subtle borders
- `on-primary-container` (#7c839b) — muted text on dark backgrounds

### CTA Gradient
```css
.cta-gradient {
  background: linear-gradient(135deg, #0058be 0%, #2170e4 100%);
}
```

### Glass Effect (for header)
```css
.bg-glass {
  background: rgba(247, 249, 251, 0.8);
  backdrop-filter: blur(20px);
}
```

### Ghost Border
```css
.ghost-border {
  border: 1px solid rgba(198, 199, 205, 0.15);
}
```

### Key Design Rules
1. **NO harsh 1px borders** — use background color shifts or ghost borders
2. **NO pure black (#000)** — use on-surface (#191c1e)
3. **Generous whitespace** — py-32 for major sections
4. **Cards:** rounded-xl, shadow-sm hover:shadow-xl, no harsh borders
5. **Labels:** uppercase, tracking-widest, text-xs, font-bold, text-secondary color
6. **Headlines:** font-serif (Newsreader), tracking-tight
7. **Buttons:** cta-gradient class, rounded-lg, font-semibold
8. **Material Symbols** for icons (already loaded in layout.tsx head)

### Header Pattern (ALL pages must use this)
```jsx
<header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
  <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
    <div className="flex items-center gap-8">
      <Link href="/" className="text-2xl font-medium font-serif text-slate-900 tracking-tight">PhlebGuide</Link>
      <nav className="hidden md:flex items-center gap-6">
        {/* nav items */}
      </nav>
    </div>
    <div className="flex items-center gap-4">
      <Link href="#get-matched" className="cta-gradient text-white px-6 py-2.5 rounded-lg font-medium text-sm">Request Info</Link>
    </div>
  </div>
  <div className="bg-slate-100/50 h-[1px] w-full"></div>
</header>
```

### Footer Pattern (ALL pages must use this)
Use the footer from the home_page_desktop/code.html reference — light footer with 4-column grid, Newsreader logo, column links, social icons using Material Symbols.

## FILES TO UPDATE

### 1. `src/app/globals.css`
- Keep existing styles
- Add any missing utility classes from the design system

### 2. `src/app/page.tsx` (Homepage)
- Match the Stitch home_page_desktop design exactly
- Keep all data fetching (getSchools, states, nationalSchools)
- Keep LeadForm component in the newsletter section
- Apply design tokens throughout

### 3. `src/app/state/[code]/page.tsx` (State Directory)
- Reference: state_directory_ca_desktop/code.html
- Keep all data fetching and generateStaticParams
- Apply consistent header/footer
- Style school cards with the new card pattern (rounded-xl, shadow-sm, ghost-border)
- Use surface color layering instead of blue-50 backgrounds

### 4. `src/app/school/[slug]/page.tsx` (School Detail)
- Reference: program_details_desktop/code.html
- Keep all data fetching and metadata generation
- Apply breadcrumb styling, stat cards with design tokens
- Use surface layering, ghost borders, design token colors

### 5. `src/app/blog/page.tsx` (Blog Index)
- Reference: blog_post_desktop/code.html style
- Keep data fetching
- Apply editorial card layout from the Stitch blog design

### 6. `src/app/blog/[slug]/page.tsx` (Blog Post)
- Reference: blog_post_desktop/code.html
- Keep renderMarkdown function and all data fetching
- Apply typography scale from design system (Newsreader headlines, Inter body)

### 7. `src/components/LeadForm.tsx`
- Restyle inputs to match design system (ghost borders, surface backgrounds, focus states with secondary blue)
- Keep all functionality

## CRITICAL RULES
1. **DO NOT** change any Supabase queries, data types, or API routes
2. **DO NOT** remove any existing content or copy
3. **DO NOT** change package.json or install new packages
4. **DO NOT** modify src/lib/ files
5. **KEEP** all generateStaticParams, generateMetadata, revalidate settings
6. **KEEP** the LeadForm component functional
7. Make sure the design is responsive (check mobile Stitch refs for patterns)
8. Use the ACTUAL Stitch HTML code as your primary reference, not just my description
9. Every page needs the SAME header and footer pattern for consistency
10. The logo is just the text "PhlebGuide" in Newsreader font — no image logo needed

## COMMIT MESSAGE
Use: "Bot Bogey: Complete design system overhaul — Clinical Excellence theme"
