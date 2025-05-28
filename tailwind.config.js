/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          primary: '#0D0D0D',    // Charcoal primary background
          secondary: '#111111',   // Near black alternative
          card: '#1A1A1A',      // Slightly lighter for cards/sections
        },
        
        // Text colors
        text: {
          primary: '#F5F5F5',    // Off-white primary text
          secondary: '#E0E0E0',  // Light gray secondary text
          muted: '#B3B3B3',     // Muted text for less important content
        },
        
        // Gold accent colors
        gold: {
          50: '#FFF9E6',         // Very light gold tint
          100: '#FFF3CC',        // Light gold tint
          200: '#FFE699',        // Light gold
          300: '#FFD966',        // Medium light gold
          400: '#FFD700',        // Bright gold for highlights
          500: '#D4AF37',        // Rich gold primary
          600: '#C5A059',        // Medium rich gold
          700: '#B89B31',        // Gold for borders/lines
          800: '#9D7E1A',        // Dark gold
          900: '#7A5F00',        // Very dark gold
        },
        
        // Border and line colors
        border: {
          primary: '#2C2C2C',    // Soft gray borders
          gold: '#B89B31',       // Gold border accent
          muted: '#1F1F1F',      // Very subtle borders
        },
        
        // Optional deep accents
        accent: {
          navy: '#0A1F44',       // Navy deep accent
          emerald: '#014421',    // Emerald deep accent
        },
        
        // Legacy primary colors (keeping for compatibility)
        primary: {
          50: '#FFF9E6',
          500: '#D4AF37',
          600: '#C5A059',
          700: '#B89B31',
        }
      },
      
      // Custom gradients for buttons and highlights
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C5A059 0%, #FFD700 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #B89B31 0%, #D4AF37 100%)',
      },
      
      // Typography
      fontFamily: {
        'sans': ['Roboto', 'Inter', 'Outfit', 'Satoshi', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia', 'serif'], // For prestigious headers
      },
      
      // Shadows for glassmorphism and elevation
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'gold-glow': '0 0 30px rgba(212, 175, 55, 0.5)',
        'luxe': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      
      // Animation for hover effects
      animation: {
        'gold-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} 