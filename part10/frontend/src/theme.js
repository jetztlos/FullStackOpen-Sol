// part10/frontend/src/theme.js

import { Platform } from 'react-native';

const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    textLight: '#ffffff',
    primary: '#0366d6',
    appBar: '#24292e',
    background: '#e1e4e8',
    backgroundLight: '#ffffff',
    details: '#586069',
    error: '#d73a4a',
    urgent: '#d73a4a',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System',
    }),
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
  spacing: {
    tiny: 4,
    small: 8,
    medium: 16,
    large: 24,
  },
  radius: {
    small: 2,
    medium: 4,
    large: 8,
  },
  iconSize: {
    small: 20,
    medium: 40,
    large: 60,
  },
  borderWidth: {
    small: 1,
    medium: 2,
    large: 3,
  },
};

export default theme;
