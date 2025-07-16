import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const primeVueTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e0ffe0',
      100: '#c8fec8',
      200: '#79fe79',
      300: '#2df52d',
      400: '#28e228',
      500: '#25d325',
      600: '#1aa41a',
      700: '#117c11',
      800: '#085308',
      900: '#022d02',
      950: '#011b01',
      1000: '',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.400}',
          inverseColor: '#ffffff',
          hoverColor: '{primary.300}',
          activeColor: '{primary.400}',
        },
        highlight: {
          background: '{primary.400}',
          focusBackground: '{primary.400}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{primary.400}',
          inverseColor: '#092343',
          hoverColor: '{primary.300}',
          activeColor: '{primary.400}',
        },
        surface: {
          0: '#ffffff',
          50: '{neutral.50}',
          100: '{neutral.100}',
          200: '{neutral.200}',
          300: '{neutral.300}',
          400: '{neutral.400}',
          500: '{neutral.500}',
          600: '{neutral.600}',
          700: '{neutral.700}',
          800: '{neutral.800}',
          900: '#181818',
          950: '{neutral.950}'
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
  components: {
    progressspinner: {
      colorScheme: {
        light: {
          root: {
            colorOne: '{primary.500}',
            colorTwo: '{primary.400}',
            colorThree: '{primary.600}',
            colorFour: '{primary.700}',
          },
        },
        dark: {
          root: {
            colorOne: '{primary.500}',
            colorTwo: '{primary.400}',
            colorThree: '{primary.600}',
            colorFour: '{primary.700}',
          },
        },
      },
    },
  },
})
