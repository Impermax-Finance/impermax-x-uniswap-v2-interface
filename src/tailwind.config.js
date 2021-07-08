
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

const { BREAKPOINTS } = require('./utils/constants/styles');

const IMPERMAX_BLACK_HAZE = Object.freeze({
  50: '#ffffff',
  100: '#fefefe',
  200: '#fdfdfd',
  300: '#fbfbfc',
  400: '#f8f9f9',
  500: '#f5f6f7',
  600: '#ddddde',
  700: '#b8b9b9',
  800: '#939494',
  900: '#787979'
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
const IMPERMAX_MERCURY = Object.freeze({
  50: '#fefefe',
  100: '#fdfdfd',
  200: '#f9f9f9',
  300: '#f5f5f5',
  400: '#eeeeee',
  500: '#e7e7e7',
  600: '#d0d0d0',
  700: '#adadad',
  800: '#8b8b8b',
  900: '#717171'
});

module.exports = {
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: BREAKPOINTS,
    extend: {
      colors: {
        impermaxBlackHaze: {
          50: IMPERMAX_BLACK_HAZE[50],
          100: IMPERMAX_BLACK_HAZE[100],
          200: IMPERMAX_BLACK_HAZE[200],
          300: IMPERMAX_BLACK_HAZE[300],
          400: IMPERMAX_BLACK_HAZE[400],
          DEFAULT: IMPERMAX_BLACK_HAZE[500],
          600: IMPERMAX_BLACK_HAZE[600],
          700: IMPERMAX_BLACK_HAZE[700],
          800: IMPERMAX_BLACK_HAZE[800],
          900: IMPERMAX_BLACK_HAZE[900]
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
          800: IMPERMAX_JADE[800],
          900: IMPERMAX_JADE[900]
        },
        impermaxCarnation: {
          50: IMPERMAX_CARNATION[50],
          100: IMPERMAX_CARNATION[100],
          200: IMPERMAX_CARNATION[200],
          300: IMPERMAX_CARNATION[300],
          400: IMPERMAX_CARNATION[400],
          DEFAULT: IMPERMAX_CARNATION[500],
          600: IMPERMAX_CARNATION[600],
          700: IMPERMAX_CARNATION[700],
          800: IMPERMAX_CARNATION[800],
          900: IMPERMAX_CARNATION[900]
        },
        impermaxAstral: {
          50: IMPERMAX_ASTRAL[50],
          100: IMPERMAX_ASTRAL[100],
          200: IMPERMAX_ASTRAL[200],
          300: IMPERMAX_ASTRAL[300],
          400: IMPERMAX_ASTRAL[400],
          500: IMPERMAX_ASTRAL[500],
          DEFAULT: IMPERMAX_ASTRAL[500],
          600: IMPERMAX_ASTRAL[600],
          700: IMPERMAX_ASTRAL[700],
          800: IMPERMAX_ASTRAL[800],
          900: IMPERMAX_ASTRAL[900]
        },
        impermaxMercury: {
          50: IMPERMAX_MERCURY[50],
          100: IMPERMAX_MERCURY[100],
          200: IMPERMAX_MERCURY[200],
          300: IMPERMAX_MERCURY[300],
          400: IMPERMAX_MERCURY[400],
          500: IMPERMAX_MERCURY[500],
          DEFAULT: IMPERMAX_MERCURY[500],
          600: IMPERMAX_MERCURY[600],
          700: IMPERMAX_MERCURY[700],
          800: IMPERMAX_MERCURY[800],
          900: IMPERMAX_MERCURY[900]
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
          900: IMPERMAX_JADE[900]
        },
        secondary: {
          50: IMPERMAX_CARNATION[50],
          100: IMPERMAX_CARNATION[100],
          200: IMPERMAX_CARNATION[200],
          300: IMPERMAX_CARNATION[300],
          400: IMPERMAX_CARNATION[400],
          DEFAULT: IMPERMAX_CARNATION[500],
          600: IMPERMAX_CARNATION[600],
          700: IMPERMAX_CARNATION[700],
          800: IMPERMAX_CARNATION[800],
          900: IMPERMAX_CARNATION[900]
        }
      },
      backgroundColor: {
        default: IMPERMAX_BLACK_HAZE[500]
      },
      textColor: {
        textPrimary: colors.coolGray[900],
        textSecondary: colors.coolGray[500]
      },
      // MEMO: inspired by https://material-ui.com/customization/default-theme/
      zIndex: {
        impermaxMobileStepper: 1000,
        impermaxSpeedDial: 1050,
        impermaxAppBar: 1100,
        impermaxDrawer: 1200,
        impermaxModal: 1300,
        impermaxSnackbar: 1400,
        impermaxTooltip: 1500
      }
    }
  },
  variants: {
    extend: {
      borderRadius: [
        'first',
        'last'
      ],
      margin: ['important']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({
      addBase,
      theme,
      addVariant
    }) {
      // MEMO: inspired by https://tailwindcss.com/docs/adding-base-styles#using-a-plugin
      addBase({
        body: {
          color: theme('textColor.textPrimary')
        }
      });

      // MEMO: inspired by https://github.com/tailwindlabs/tailwindcss/issues/493#issuecomment-610907147
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`;
          rule.walkDecls(decl => {
            decl.important = true;
          });
        });
      });
    })
  ]
};
