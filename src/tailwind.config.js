
const IMPERMAX_BLACK_HAZE = Object.freeze({
  500: '#f5f6f7'
});
const IMPERMAX_JADE = Object.freeze({
  50: '#f2fbf8',
  100: '#e6f8f1',
  200: '#bfeddc',
  300: '#99e1c7',
  400: '#4dcb9d',
  500: '#00b573',
  600: '#00a368',
  700: '#008856',
  800: '#006d45',
  900: '#005938'
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
        },
        impermaxJade: {
          DEFAULT: IMPERMAX_JADE[500]
        },
        primary: {
          50: IMPERMAX_JADE[50],
          100: IMPERMAX_JADE[100],
          200: IMPERMAX_JADE[200],
          300: IMPERMAX_JADE[300],
          400: IMPERMAX_JADE[400],
          DEFAULT: IMPERMAX_JADE[500],
          600: IMPERMAX_JADE[600],
          700: IMPERMAX_JADE[700],
          800: IMPERMAX_JADE[800],
          contrastText: '#333333'
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
