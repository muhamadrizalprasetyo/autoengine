/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TOKYO DRIFT PALETTE
        tokyo: {
          black: '#050505',    // Deep Carbon Black
          red: '#FF1E1E',      // Neon Red
          white: '#FFFFFF',    // Pure White
        },
        // Primary Colors (Kept for compatibility with other pages)
        primary: {
          DEFAULT: '#DC2626', // Red 600
          hover: '#B91C1C',    // Red 700
        },
        secondary: {
          DEFAULT: '#3B82F6', 
          hover: '#2563EB',   
        },
        // Status Colors
        success: {
          DEFAULT: '#10B981', 
          light: '#D1FAE5',   
        },
        warning: {
          DEFAULT: '#F59E0B', 
          light: '#FEF3C7',   
        },
        error: {
          DEFAULT: '#EF4444', 
          light: '#FEE2E2',   
        },
        info: {
          DEFAULT: '#3B82F6', 
          light: '#DBEAFE',   
        },
        // Neutral Colors
        neutral: {
          0: '#ffffff',
          50: '#F8FAFC',     
          100: '#F1F5F9',    
          200: '#E2E8F0',    
          300: '#CBD5E1',    
          400: '#94A3B8',    
          500: '#64748B',    
          600: '#475569',    
          700: '#334155',    
          800: '#1E293B',    
          900: '#0F172A',    
          950: '#020617',    
        },
        // Payment Method Badge Colors
        payment: {
          tunai: '#6B7280',   
          bca: '#3B82F6',     
          qris: '#8B5CF6',    
          bri: '#F59E0B',     
        },
      },
      fontFamily: {
        "headline-md": ["Hanken Grotesk"],
        "body-lg": ["Hanken Grotesk"],
        "label-md": ["Hanken Grotesk"],
        "headline-lg-mobile": ["Hanken Grotesk"],
        "label-caps": ["Hanken Grotesk"],
        "headline-lg": ["Hanken Grotesk"],
        "body-sm": ["Hanken Grotesk"]
      },
      fontSize: {
        "headline-md": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "label-md": ["13px", { "lineHeight": "18px", "fontWeight": "500" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "700" }],
        "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }]
      },
      spacing: {
        "gutter": "24px",
        "margin-desktop": "40px",
        "container-max-width": "1280px",
        "unit": "4px",
        "margin-mobile": "16px",
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
