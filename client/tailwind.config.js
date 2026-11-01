/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#17271F', paper: '#F5F3EA', mint: '#D6F36A', coral: '#F27A5E', amber: '#F0BA58', moss: '#617467', line: '#DFE3D7' },
      boxShadow: { soft: '0 18px 50px rgba(23, 39, 31, 0.08)' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
};
