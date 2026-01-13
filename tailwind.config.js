/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
        roboto: ['Roboto', 'sans-serif'],
        ubuntu: ['Ubuntu Sans Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
