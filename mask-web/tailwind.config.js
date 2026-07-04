/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mask: {
          bg: '#0f0f1a',
          surface: '#1a1a2e',
          'surface-light': '#252542',
          primary: '#7c6bff',
          'primary-light': '#9b8fff',
          accent: '#ff6b9d',
          text: '#e8e8f0',
          'text-muted': '#8888a0',
          border: '#2a2a4a',
        },
      },
    },
  },
  plugins: [],
}
