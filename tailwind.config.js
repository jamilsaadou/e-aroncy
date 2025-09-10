/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'aroncy-orange': '#F57C00',
        'aroncy-blue': '#1aaf44',
        'aroncy-green': '#388E3C',
        'aroncy-light-gray': '#F5F5F5',
        'aroncy-dark-gray': '#212121',
      },
      fontFamily: {
        'display': ['Montserrat', 'system-ui', 'sans-serif'],
        'body': ['Open Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'aroncy-gradient': 'linear-gradient(135deg, #388E3C 0%, #1aaf44 50%, #388E3C 100%)',
      },
    },
  },
  plugins: [],
}
