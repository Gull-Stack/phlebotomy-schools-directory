/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clinical Excellence Design Tokens
        "primary-container": "#131b2e",
        "surface-bright": "#f7f9fb", 
        "on-primary": "#ffffff",
        "on-secondary-fixed": "#001a42",
        "surface": "#f7f9fb",
        "on-tertiary": "#ffffff",
        "on-background": "#191c1e",
        "on-primary-container": "#7c839b",
        "tertiary-container": "#0b1c30",
        "inverse-surface": "#2d3133",
        "primary": "#000000",
        "tertiary": "#000000", 
        "on-secondary-container": "#fefcff",
        "primary-fixed": "#dae2fd",
        "surface-container": "#eceef0",
        "tertiary-fixed": "#d3e4fe",
        "secondary-fixed": "#d8e2ff",
        "on-error-container": "#93000a",
        "outline": "#76777d",
        "surface-container-low": "#f2f4f6",
        "surface-container-highest": "#e0e3e5",
        "primary-fixed-dim": "#bec6e0",
        "on-tertiary-container": "#75859d",
        "on-secondary": "#ffffff",
        "secondary": "#0058be",
        "on-tertiary-fixed": "#0b1c30",
        "on-surface-variant": "#45464d",
        "surface-tint": "#565e74",
        "surface-variant": "#e0e3e5", 
        "background": "#f7f9fb",
        "outline-variant": "#c6c6cd",
        "on-surface": "#191c1e",
        "inverse-on-surface": "#eff1f3",
        "on-tertiary-fixed-variant": "#38485d",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "inverse-primary": "#bec6e0",
        "error-container": "#ffdad6",
        "on-primary-fixed": "#131b2e",
        "on-primary-fixed-variant": "#3f465c", 
        "on-secondary-fixed-variant": "#004395",
        "secondary-container": "#2170e4",
        "surface-dim": "#d8dadc",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#adc6ff",
        "tertiary-fixed-dim": "#b7c8e1",
        "surface-container-high": "#e6e8ea"
      },
      fontFamily: {
        "headline": ["var(--font-newsreader)", "serif"],
        "serif": ["var(--font-newsreader)", "serif"],
        "body": ["var(--font-inter)", "sans-serif"], 
        "inter": ["var(--font-inter)", "sans-serif"],
        "label": ["var(--font-inter)", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.75rem",
        "lg": "1rem",
        "xl": "1.25rem", 
        "2xl": "1.5rem",
        "full": "9999px"
      },
      backdropBlur: {
        'xl': '20px'
      },
      backgroundImage: {
        'cta-gradient': 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)',
      }
    },
  },
  plugins: [],
}