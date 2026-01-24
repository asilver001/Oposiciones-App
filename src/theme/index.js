export * from './colors';
export * from './spacing';
export * from './shadows';
export * from './typography';

// Re-export as theme object
import { colors } from './colors';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  shadows,
  typography,
};
