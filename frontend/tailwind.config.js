/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'display': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading': ['36px', { lineHeight: '1.3', fontWeight: '600' }],
        'large': ['28px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['24px', { lineHeight: '1.5' }],
        'small': ['20px', { lineHeight: '1.5' }],
      },
      spacing: {
        'touch': '60px',
        'touch-lg': '80px',
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
        },
        success: {
          DEFAULT: '#16a34a',
          hover: '#15803d',
        },
        danger: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
        },
      },
      minHeight: {
        'touch': '60px',
        'touch-lg': '80px',
      },
      minWidth: {
        'touch': '120px',
      },
    },
  },
  plugins: [],
}
