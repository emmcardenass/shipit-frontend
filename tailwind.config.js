// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0601FB',
        secondary: '#FF7925',
        darkBackground: '#0d1117',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.7s ease-out forwards",
        slideUp: "slideUp 0.3s ease-out forwards",
        'pulse-scale': 'pulseScale 1s ease-in-out infinite',
      },
      
    },
  },
  plugins: [],
};

