
const IMPERMAX_BLACK_HAZE = Object.freeze({
  500: '#f5f6f7'
});

module.exports = {
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        impermaxBlackHaze: {
          DEFAULT: IMPERMAX_BLACK_HAZE[500]
        }
      },
      backgroundColor: {
        default: IMPERMAX_BLACK_HAZE[500]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
