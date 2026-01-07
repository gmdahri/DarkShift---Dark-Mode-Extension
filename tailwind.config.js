/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
            boxShadow: '0 0 0 0 rgba(251, 113, 133, 0)'
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '1',
            boxShadow: '0 0 12px 4px rgba(251, 113, 133, 0.8)'
          },
        }
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

