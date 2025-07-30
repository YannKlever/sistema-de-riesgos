export const PRINT_OPTIONS = {
  PAGE_SIZE: {
    A4: 'A4',
    LETTER: 'letter',
    LEGAL: 'legal'
  },
  ORIENTATION: {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape'
  },
  MARGIN: {
    SMALL: '0.5cm',
    MEDIUM: '1cm',
    LARGE: '2cm'
  }
};

export const DEFAULT_PRINT_CONFIG = {
  pageSize: 'A4',
  orientation: 'portrait',
  margin: '1cm',
  header: true,
  footer: true,
  styles: 'BASIC'
};