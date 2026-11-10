/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'scirocco': {
          // Core Brand Colors
          'noam': '#5C2F18',           // Dark brown - deepest, richest
          'desert': '#D4A574',         // Desert tan
          'copper': '#945C4F',         // Reddish brown
          'camel': '#A87F66',          // Camel brown
          'ivory': '#E8E0D6',          // Off-white/cream
          // Complementary Colors
          'deep-sand': '#C4A68A',      // Collage tile backing
          'wheat': '#F5DEB3',          // Beige for light text (as in "Sourcing Without Borders")
        }
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'lora': ['Lora', 'serif'],
        'baskerville': ['"Libre Baskerville"', 'serif'],
      },
    },
  },
  plugins: [],
}
