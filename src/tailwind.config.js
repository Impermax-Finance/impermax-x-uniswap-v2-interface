
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
const IMPERMAX_CARNATION = Object.freeze({
  50: '#fef6f6',
  100: '#fdeeee',
  200: '#fad4d4',
  300: '#f7bbbb',
  400: '#f18787',
  500: '#eb5454',
  600: '#d44c4c',
  700: '#b03f3f',
  800: '#8d3232',
  900: '#732929'
});
const IMPERMAX_ASTRAL = Object.freeze({
  50: '#f5f8fa',
  100: '#eaf1f5',
  200: '#cbdce6',
  300: '#abc7d7',
  400: '#6d9db8',
  500: '#2e739a',
  600: '#29688b',
  700: '#235674',
  800: '#1c455c',
  900: '#17384b'
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
          50: IMPERMAX_JADE[50],
          100: IMPERMAX_JADE[100],
          200: IMPERMAX_JADE[200],
          300: IMPERMAX_JADE[300],
          400: IMPERMAX_JADE[400],
          DEFAULT: IMPERMAX_JADE[500],
          600: IMPERMAX_JADE[600],
          700: IMPERMAX_JADE[700],
          800: IMPERMAX_JADE[800]
        },
        impermaxCarnation: {
          DEFAULT: IMPERMAX_CARNATION[500]
        },
        impermaxAstral: {
          DEFAULT: IMPERMAX_ASTRAL[500]
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
    extend: {
      borderRadius: [
        'first',
        'last'
      ]
    }
  },
  plugins: []
};
