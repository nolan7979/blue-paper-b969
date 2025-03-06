/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './node_modules/flowbite-react/**/*.js',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      mediaQuery: {
        '2xl': '(min-width: 1536px)',
      },
      backgroundSize: {
        '100-70': '100% 70%',
      },
      margin: {
        2.75: '0.6875rem',
      },
      inset: {
        2.75: '0.6875rem',
      },
      height: {
        4.5: '1.125rem',
      },
      spacing: {
        18: '4.5rem', // Define the spacing value you need
        22: '5.5rem',
        26: '6.5rem',
      },
      width: {
        '1/15': '6.6%',
        '1/8': '13.75%',
        '1/20': '5%',
        '2/25': '8%',
        275: '27.5%',
        350: '35%',
        96: '96%',
        99: '99%',
        129.5: '32.375rem',
      },
      maxWidth: {
        limit: '86rem',
        52: '13rem',
        12: '3rem',
      },
      minWidth: {
        limit: '86rem',
        52: '13rem',
        12: '3rem',
      },
      screens: {
        xs: '375px',
        xsm: '500px',
        '3xl': '1720px',
      },
      fontFamily: {
        primary: ['Be Vietnam Pro', ...fontFamily.sans],
        oswald: ['Oswald', ...fontFamily.sans],
        uniscore: ['UniscoreSans'],
        montserrat: ['Montserrat'],
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        csm: '0.8125rem',
        xss: '0.813rem', //13px
        ccsm: '0.75rem', //12px
        msm: '0.688rem', //11px
        mxs: '0.65rem',
        cxs: '0.6rem',
        xxss: '0.563rem', //9px
        xxs: '0.5rem',
        clg: '1rem',
      },
      colors: {
        'light-primary': '#004FFF',
        'light-darkGray': '#272A31',
        'light-default': '#000000',
        'light-secondary': '#8d8e92',
        'light-red': '#D34D4D',
        'light-blue': '#5183E5',
        'light-black': '#222222',
        'light-selected': 'rgba(52, 147, 228, 0.2)', // selected hd2 border
        'light-line-stroke-cd': '#CDDDED', // TODO ?
        'light-stroke': '#CDDDED', // TODO ?
        'light-team': '#093454',
        'light-detail-away': '#F6B500',
        'logo-blue': '#2187E5',
        'light-draw': '#E38263',
        'logo-yellow': '#E0A500',
        'light-match': '#F2F6F9',
        'light-hdp-odds': '#0062BC',
        'light-tx-odds': '#333333',
        'match-score': '#f6b500',
        'light-green': 'rgba(51, 183, 122, 1)',
        'light-active': '#004fff',

        'dark-main': '#01040D',
        'dark-score': '#030A32',
        // dark: 'rgb(var(--tw-color-primary-900))',
        'dark-default': '#e4e6eb', // gray / #e4e6eb
        'dark-text': 'rgb(149, 153, 157)',
        'dark-text-full': 'rgb(170, 170, 170)',
        'all-blue': '#2187E5',
        'line-dark-blue': '#0038E0',
        'dark-hl': '#2e89ff',
        'dark-blue': '#7DA9FF',
        'dark-red': '#E77C7C',
        'dark-white': '#FFFFFF',
        'dark-orange': '#DA6900',
        'dark-green': '#48ff5a',
        'dark-home': '#A582DF', // TODO change purple to blue logo
        'dark-away': '#D84E5F', // TODO change red to yellow logo
        'dark-rating': '#DB122B',
        'dark-stroke': '#1F1F1F', // Line stroke 1F
        'dark-shadow-card': '#06060669', // Line stroke 2D
        'dark-win': '#2EA76F',
        'standings-t': '#48FF5A',
        'standings-h': '#2187E5',
        'standings-b': '#DD2704',
        match: '#222222',
        'red-neg': '#b7422b',
        'dark-draw': 'rgba(255, 255, 255, 0.5)',
        'dark-loss': '#CA2100',
        'dark-dark-blue': '#073253',
        strength: '#05FF00',
        weekness: '#FFB775',
        'gray-light': 'rgb(170, 170, 170, 0.2)',
        hdp: '#dc4232',
        std1x2: '#FFFFFF',
        tx: '#7aa4e2',
        'score-paler': '#FFFFFF66',
        basic: '#555',
        'rega-blue': '#2187E5',
        'surface-1': 'rgba(229, 233, 239, 0.4);',
        'surface-2': '#22222673',
        'surface-3': 'rgba(34, 34, 38, 0.15)',
        'dark-hl-3': '#171717',
        'dark-hdp-odds': '#007DF1',
        'dark-tx-odds': '#D0D0D0',
        'live-score': '#CA2727',
        'custom-gradient-start': 'rgba(10, 31, 85, 0.5)',
        'custom-gradient-middle': 'rgba(16, 44, 115, 0.5)',
        'custom-gradient-item-row': '#09379447',
        'custom-gradient-end': 'rgba(12, 26, 76, 0.5)',
        'icon-highlight': 'rgba(33, 135, 229, 1)',
        'color-accent-secondary-solid-yellow-500': 'rgba(246, 181, 0, 1)',
        'dark-text': '#8D8E92',
        'primary-mask': 'rgba(9, 55, 148, 0.28)',
        'dark-line': 'rgba(1, 4, 13, 0.92)',
        'all-red': '#E96C54',
        'dark-card': '#020C20',
        'primary-disabled': '#043591',
        minute: '#FF2A01',
      },
      backgroundColor: {
        // light mode
        'primary-gradient':
          'linear-gradient(124.54deg, rgba(10, 31, 85, 0.4) 0%, rgba(16, 44, 115, 0.4) 27.66%, rgba(12, 26, 76, 0.4) 70.02%)',
        light: '#FFFFFF',
        'light-main': '#ECF1F5',
        'light-thumb': '#e5e5e5',
        'light-line-stroke-cd': '#CDDDED', // TODO ?
        'light-hl-1': '#F9FCFF',
        'light-hl-2': '#F2F7FC',
        'light-match': '#F2F6F9',
        'light-detail-home': '#2187E5',
        'light-detail-away': '#F6B500',
        'light-default': '#1E7BD0',
        'light-hd2-selected': 'rgba(52, 147, 228, 0.1)',
        'light-increase-odds': '#EAFFF1',
        'light-reduce-odds': '#FFEEED',
        'live-score': '#CA2727',
        'light-home-score': 'rgba(226, 235, 249, 1)',
        'light-away-score': 'rgba(226, 235, 249, 1)',
        'light-score': '#2568EF',
        'yellow-card': '#F6B500',
        'dark-container': '#020A1D',

        // dark mode
        'dark-main': '#01040d',
        'dark-hl-1': '#1F1F1F', // dark-highlight-1
        'dark-hl-2': '#1D1D1D',
        'dark-hl-3': '#171717',
        'dark-match': '#1B1B1B',
        modal: '#0E1112',
        'dark-dark-blue': '#073253',
        'dark-gray': '#151820',
        'dark-draw': '#555555',
        'dark-win': '#2EA76F',
        'dark-win-score': '#26B783',
        'dark-loss': '#CA2100',
        'dark-cornor': '#FFD089',
        'dark-icon': '#133F61',
        'dark-sub-bg-main': '#222222',
        'dark-track': '#2B2B2B',
        'dark-thumb': '#6B6B6B',
        'dark-disable': 'var(--neutral-alpha-04, rgba(2, 2, 15, 0.15))',
        'dark-modal': '#1F222A',
        'red-neg': '#b7422b',
        '': '#3D9F53',
        strength: '#05FF00',
        weakness: '#FFB775',
        'dark-orange': '#DA6900',
        'dark-skeleton': '#1C1C1C',
        score: '#F9F9F9',
        'score-dark': '#CDFCF6',
        'dark-stadium-line': '#8D8E92',
        'dark-icon-dark': '#1A4B70',
        'dark-increase-odds': '#053D08',
        'dark-reduce-odds': '#390808',
        'high-light': 'rgb(145, 196, 243)', //#2187E5
        'dark-brand-box': '#001552',
        'dark-stadium': '#091557',
        'dark-hover': '#013090B2',
        'dark-blue': '#162587',
        'dark-blue-border': '#0A269E',
        'dark-wrap-match': 'rgba(11, 55, 144, 0.08)',
        'primary-alpha-01': 'rgba(11, 55, 144, 0.08)',
        'dark-button': '#0038E0',
        'dark-head-lineups': 'rgba(0, 19, 56, 0.95)',
        'dark-head-tab': '#171B2E',
        highlight: 'rgba(33, 135, 229, 1)',
        'info-blue-700': 'rgba(23, 96, 163, 1)',
        'neutral-alpha-04': 'rgba(2, 2, 15, 0.15)',
        'neutral-alpha-06': 'rgba(2, 4, 13, 0.45)',
        'semantic-error-red-700': 'rgba(223, 152, 2, 0.78)',
        'semantic-info-blue-700': 'rgba(1, 44, 130, 0.89)',
        'accent-secondary-alpha-02': 'rgba(251, 172, 9, 0.24)',
        'accent-primary-alpha-03': 'rgba(4, 53, 145, 0.41)',
        'draw-blue': '#0033CC',
        'dark-card': '#020C20',
        'dark-summary': '#08124c',
        'primary-mask': 'rgba(9, 55, 148, 0.28)',
        'menu-dark': '#1630B6',
        'dark-green': '#48ff5a',
        'light-active': '#004fff',
        'line-default': '#E2EBF9',
        'dot-light': '#B0C1F5',
        'head-tab': '#F4F5F7',
        'bar-chart': '#FFB412',
        'inning-score': '#C0C0C3',
        'active-squad': '#3360E6',
        'add-button': '#041840',
        'add-button-tab': '#01060f',
        'dark-blur-line': 'rgba(255, 255, 255, 0.02)',
        'light-blur-line': 'rgba(0, 0, 0, 0.02)',
      },
      borderColor: {
        'dark-hightlight': '#2e89ff', // blue
        'dark-card': '#1F1F1F',
        'dark-head-lineups': '#044009',
        'dark-button': '#3D3D3D',
        'dark-tickets': '#2e2e2e',
        'dark-draw': '#aaaaaa',
        'dark-hl-3': '#171717',
        'light-default': '#1E7BD0',
        'dark-match': '#1B1B1B',
        'match-score': '#f6b500',
        'head-tab': '#171B2E',
        'dark-time-tennis': '#272A31',
        'player-summary': 'rgba(9, 55, 148, 0.28)',
        'light-active': '#004fff',
        'draw-blue': '#0033CC',
        'line-default': '#E2EBF9',
        'dark-green': '#48ff5a',
        'light-theme': '#eaeaea',
        'line-heatmap': '#00207b',
        'underline-team': '#D9D9DB',
        'dark-gray': '#151820',
      },
      borderWidth: {
        1.5: '1.5px',
      },
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(124.54deg, rgba(10, 31, 85, 0.5) 0%, rgba(16, 44, 115, 0.5) 27.66%, rgba(12, 26, 76, 0.5) 68.97%)',
        'bkg-border-gradient':
          'linear-gradient(129deg, rgba(20, 86, 255, 0.20) 1.2%, rgba(18, 37, 86, 0.20) 50.89%, rgba(9, 55, 148, 0.28) 100.58%)',
        'bkg-login':
          'linear-gradient(264.06deg, #091557 4.35%, #122690 59.76%, #203397 95.98%)',
      },
      borderRadius: {
        cmd: '0.25rem',
      },
      lineHeight: {
        4.5: '1.125rem', // Customize the line height value here
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: 0.99,
            filter:
              'drop-shadow(0 0 1px rgba(62, 92, 167, 0.7)) drop-shadow(0 0 7px rgba(43, 103, 255, 0.2)) drop-shadow(0 0 1px rgba(35, 63, 160, 0.7))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: 0.9,
            filter:
              'drop-shadow(0 0 1px rgba(10, 31, 85, 0.5)) drop-shadow(0 0 7px rgba(16, 44, 115, 0.5)) drop-shadow(0 0 1px rgba(12, 26, 76, 0.5))',
          },
        },
        
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
        shine: {
          '0%, 100%': {
            background: 'transparent',
          },
          '50%': {
            background: 'rgba(255, 255, 255, 0.5)',
          },
        },
        fadeInLeft: {
          0: {
            opacity: 0,
            transform: 'translateX(100%)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        fadeOutLeft: {
          0: {
            opacity: 1,
            transform: 'translateX(0)',
          },
          '100%': {
            opacity: 0,
            display: 'none',
            transform: 'translateX(100%)',
          },
        },
        linearPosition: {
          '0%': {
            backgroundPosition: '0 50%',
          },
          '100%': {
            backgroundPosition: '100% 50%%',
          },
        }
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        position: 'linearPosition 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
        shine: 'shine 1s linear infinite',
        fadeIn: 'fadeInLeft 0.3s ease-in forwards',
        fadeOut: 'fadeOutLeft 0.3s ease-out forwards',
        expand: 'expand 0.3s ease-in-out forwards',
        collapse: 'collapse 0.3s ease-in-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    // require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    require('flowbite/plugin'),
    require('tailwindcss-debug-screens'),
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.scrollbar': {
          '&::-webkit-scrollbar': {
            width: '5px !important',
            height: '8px !important',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('backgroundColor.light-line-stroke-cd'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('backgroundColor.light-main'),
            borderRadius: '4px !important',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            background: theme('backgroundColor.light-thumb'),
          },
        },
        '.dark .scrollbar': {
          '&::-webkit-scrollbar-track': {
            background: theme('backgroundColor.dark-track'),
            border: `1px solid ${theme('borderColor.dark-button')}`,
            borderRadius: '4px !important',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('backgroundColor.dark-thumb'),
          },
          '&:hover::-webkit-scrollbar-thumb': {
            background: theme('colors.scrollbar.dark.hover'),
          },
        },
        '.bg-custom-gradient': {
          background: 'linear-gradient(124.54deg, var(--tw-gradient-stops))',
          '--tw-gradient-from': 'var(--tw-color-custom-gradient-start)',
          '--tw-gradient-stops':
            'var(--tw-gradient-from), var(--tw-color-custom-gradient-middle) 27.66%, var(--tw-color-custom-gradient-end) 68.97%',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none' /* Chrome, Safari, and Opera */,
        },
        '.no-scrollbar:hover::-webkit-scrollbar': {
          display: 'block' /* Chrome, Safari, and Opera */,
        },
      };

      addUtilities(newUtilities, ['dark', 'hover']);
    },
  ],
};
