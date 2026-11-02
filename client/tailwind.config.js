/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#11120F', paper: '#F5F3EA', mint: '#D6F36A', coral: '#F27A5E', amber: '#F0BA58', moss: '#68685F', line: '#E2E0D6' },
      boxShadow: { soft: '0 18px 50px rgba(17, 18, 15, 0.08)' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
};
