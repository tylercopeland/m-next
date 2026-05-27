// Color palette for m-next. Method's existing 10-family palette,
// restructured from the flat hyphenated keys in @m-next/styles to a nested
// shape that's friendlier for autocomplete and CSS variable generation.
//
//   colors.blue.base       // canonical base
//   colors.blue.dark
//   colors.blue.lighter
//
// CSS variables are emitted as --color-{family} for base, --color-{family}-{shade}
// for everything else. See css-variables.js.

const colors = {
  black: '#000000',
  white: '#FFFFFF',
  concrete: '#F6FAFB',

  blue: {
    darkest: '#022266',
    darker: '#022266',
    dark: '#064499',
    base: '#0D71C8',
    light: '#B3E5FF',
    lighter: '#E5F7FF',
    lightest: '#E5F7FF',
  },
  green: {
    darkest: '#053023',
    darker: '#053023',
    dark: '#115B40',
    base: '#007B4A',
    light: '#A9D9BF',
    lighter: '#E7F5F0',
    lightest: '#E7F5F0',
  },
  fuchsia: {
    darkest: '#470219',
    darker: '#470219',
    dark: '#940D33',
    base: '#D81F47',
    light: '#FFABB5',
    lighter: '#FFF0F0',
    lightest: '#FFF0F0',
  },
  yellow: {
    darkest: '#634002',
    darker: '#634002',
    dark: '#B07F0D',
    base: '#FDCB2E',
    light: '#FFEA80',
    lighter: '#FFFAD1',
    lightest: '#FFFAD1',
  },
  red: {
    darkest: '#540009',
    darker: '#540009',
    dark: '#A10007',
    base: '#DA211E',
    light: '#FFACA1',
    lighter: '#FFF3F0',
    lightest: '#FFF3F0',
  },
  grey: {
    darkest: '#0F1B31',
    darker: '#0F1B31',
    dark: '#2A394A',
    base: '#545F67',
    light: '#BACAD0',
    lighter: '#EEF5F7',
    lightest: '#EEF5F7',
  },
  purple: {
    darkest: '#0A1071',
    darker: '#0A1071',
    dark: '#1C26AA',
    base: '#3B4AED',
    light: '#91A2FF',
    lighter: '#E3E9FF',
    lightest: '#E3E9FF',
  },
  orange: {
    darkest: '#471602',
    darker: '#471602',
    dark: '#94390D',
    base: '#E05D2A',
    light: '#FFCDAB',
    lighter: '#FFFAF0',
    lightest: '#FFFAF0',
  },
  teal: {
    darker: '#03384F',
    dark: '#0F7999',
    base: '#2EC9E8',
    light: '#84F3FF',
    lighter: '#D6FEFF',
  },

  // Brand
  method: {
    base: '#022266',
    light: '#344A62',
    lightest: '#677D95',
  },
};

export const families = [
  'blue',
  'green',
  'fuchsia',
  'yellow',
  'red',
  'grey',
  'purple',
  'orange',
  'teal',
];

export const shades = ['darkest', 'darker', 'dark', 'base', 'light', 'lighter', 'lightest'];

export default colors;
