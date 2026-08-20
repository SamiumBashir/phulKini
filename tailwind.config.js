/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#610000',
          dark: '#4A0000',
          container: '#8B0000',
          light: '#FFDAD4',
          subtle: '#FFF5F4',
        },
        surface: {
          bg: '#FCF9F8',
          white: '#FFFFFF',
          soft: '#F6F3F2',
          light: '#F0EDED',
        },
        border: {
          muted: '#E3BEB8',
          subtle: '#F0D5D0',
          light: '#F4ECE9',
        },
        secondary: {
          DEFAULT: '#6B5A60',
          light: '#8D7B81',
        },
        main: {
          text: '#1B1C1C',
          muted: '#5A403C',
          subtle: '#7A625E',
        },
        accent: {
          green: '#374639',
          'green-light': '#E8EFE9',
          gold: '#C59B27',
          rose: '#D9777F',
        }
      },
      fontFamily: {
        bengali: ['var(--font-hind-siliguri)', 'Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
        sans: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['var(--font-hind-siliguri)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(97, 0, 0, 0.05)',
        'soft': '0 4px 20px -2px rgba(97, 0, 0, 0.07)',
        'soft-lg': '0 10px 30px -4px rgba(97, 0, 0, 0.1)',
        'soft-xl': '0 20px 40px -6px rgba(97, 0, 0, 0.12)',
        'glow': '0 0 25px rgba(139, 0, 0, 0.25)',
      },
      borderRadius: {
        'card': '16px',
        'pill': '9999px',
      },
      maxWidth: {
        'container': '1240px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
};
