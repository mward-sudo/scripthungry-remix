module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      'brand-normal': ['BIZ UDPGothic Normal'],
      'brand-bold': ['BIZ UDPGothic Bold'],
    },
  },
  daisyui: {
    themes: ['dark'],
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('daisyui'),
  ],
}
