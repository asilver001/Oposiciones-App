/**
 * Design Tokens - Single Source of Truth
 *
 * All design values are defined here. Components consume via useTheme().
 * Recipes can be swapped without touching any component code.
 *
 * Architecture:
 * - tokens.js: Base values + recipe definitions
 * - ThemeContext: Provides current recipe to components
 * - useTheme(): Hook to consume tokens in components
 * - index.css: CSS custom properties for Tailwind
 */

// ═══════════════════════════════════════════════════════════════
// BASE TOKENS (shared across all recipes)
// ═══════════════════════════════════════════════════════════════

export const baseTokens = {
  // Font families
  fontFamily: {
    display: "'Inter Variable', system-ui, sans-serif",
    body: "'Inter Variable', system-ui, sans-serif",
    mono: "'JetBrains Mono', Menlo, monospace",
  },

  // Font sizes (rem)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Spacing scale (4px base)
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Transitions
  transition: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
  },
};

// ═══════════════════════════════════════════════════════════════
// RECIPE: CURRENT (Purple, Rounded, Dense)
// ═══════════════════════════════════════════════════════════════

export const recipeCurrent = {
  name: 'current',
  label: 'Actual',

  colors: {
    // Brand
    brand: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
    },
    // Surfaces
    surface: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      inverse: '#111827',
    },
    // Text
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      muted: '#9ca3af',
      inverse: '#ffffff',
    },
    // Borders
    border: {
      light: '#f3f4f6',
      default: '#e5e7eb',
      dark: '#d1d5db',
    },
    // Semantic
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },

  // Component-specific tokens
  components: {
    card: {
      bg: '#ffffff',
      border: '#e5e7eb',
      radius: '1rem',
      padding: '1rem',
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
    button: {
      radius: '0.75rem',
      paddingX: '1rem',
      paddingY: '0.75rem',
    },
    stat: {
      valueSize: '2rem',
      labelSize: '0.75rem',
    },
  },

  // Layout
  layout: {
    pageGutter: '1rem',
    sectionGap: '1.5rem',
    cardGap: '0.75rem',
  },
};

// ═══════════════════════════════════════════════════════════════
// RECIPE: MINIMAL (Monochrome, Clean, Spacious)
// ═══════════════════════════════════════════════════════════════

export const recipeMinimal = {
  name: 'minimal',
  label: 'Minimal',

  colors: {
    brand: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#18181b',
      700: '#09090b',
    },
    surface: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f4f4f5',
      inverse: '#18181b',
    },
    text: {
      primary: '#18181b',
      secondary: '#71717a',
      muted: '#a1a1aa',
      inverse: '#ffffff',
    },
    border: {
      light: '#f4f4f5',
      default: '#e4e4e7',
      dark: '#d4d4d8',
    },
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
  },

  components: {
    card: {
      bg: '#ffffff',
      border: '#e4e4e7',
      radius: '1.5rem',
      padding: '1.5rem',
      shadow: 'none',
    },
    button: {
      radius: '1rem',
      paddingX: '1.5rem',
      paddingY: '1rem',
    },
    stat: {
      valueSize: '2.5rem',
      labelSize: '0.75rem',
    },
  },

  layout: {
    pageGutter: '1.5rem',
    sectionGap: '3rem',
    cardGap: '1rem',
  },
};

// ═══════════════════════════════════════════════════════════════
// RECIPE: WARM (Earthy, Soft, Friendly)
// ═══════════════════════════════════════════════════════════════

export const recipeWarm = {
  name: 'warm',
  label: 'Cálido',

  colors: {
    brand: {
      50: '#fef7ee',
      100: '#fdecd3',
      200: '#fad5a5',
      300: '#f6b76d',
      400: '#f19032',
      500: '#ed7410',
      600: '#de5909',
      700: '#b8420b',
    },
    surface: {
      primary: '#fffbf7',
      secondary: '#fef7ee',
      tertiary: '#fdecd3',
      inverse: '#422006',
    },
    text: {
      primary: '#422006',
      secondary: '#92400e',
      muted: '#b45309',
      inverse: '#fffbf7',
    },
    border: {
      light: '#fef3c7',
      default: '#fde68a',
      dark: '#fcd34d',
    },
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
  },

  components: {
    card: {
      bg: '#ffffff',
      border: '#fde68a',
      radius: '1.25rem',
      padding: '1.25rem',
      shadow: '0 2px 8px 0 rgb(251 191 36 / 0.1)',
    },
    button: {
      radius: '0.875rem',
      paddingX: '1.25rem',
      paddingY: '0.875rem',
    },
    stat: {
      valueSize: '2rem',
      labelSize: '0.8125rem',
    },
  },

  layout: {
    pageGutter: '1.25rem',
    sectionGap: '2rem',
    cardGap: '0.875rem',
  },
};

// ═══════════════════════════════════════════════════════════════
// RECIPE: DARK (Dark mode, Vibrant accents)
// ═══════════════════════════════════════════════════════════════

export const recipeDark = {
  name: 'dark',
  label: 'Oscuro',

  colors: {
    brand: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
    },
    surface: {
      primary: '#09090b',
      secondary: '#18181b',
      tertiary: '#27272a',
      inverse: '#fafafa',
    },
    text: {
      primary: '#fafafa',
      secondary: '#a1a1aa',
      muted: '#71717a',
      inverse: '#09090b',
    },
    border: {
      light: '#27272a',
      default: '#3f3f46',
      dark: '#52525b',
    },
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
  },

  components: {
    card: {
      bg: '#18181b',
      border: '#27272a',
      radius: '1rem',
      padding: '1.25rem',
      shadow: '0 4px 12px 0 rgb(0 0 0 / 0.4)',
    },
    button: {
      radius: '0.75rem',
      paddingX: '1rem',
      paddingY: '0.75rem',
    },
    stat: {
      valueSize: '2.25rem',
      labelSize: '0.75rem',
    },
  },

  layout: {
    pageGutter: '1rem',
    sectionGap: '2rem',
    cardGap: '0.75rem',
  },
};

// ═══════════════════════════════════════════════════════════════
// RECIPE: TOOL (Notion/Linear style - Serious, Precise)
// ═══════════════════════════════════════════════════════════════

export const recipeTool = {
  name: 'tool',
  label: 'Herramienta',

  // Custom fonts
  fontFamily: {
    display: "'Space Mono', monospace",
    body: "'DM Sans', sans-serif",
  },

  colors: {
    brand: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#2D6A4F',  // Green accent
      600: '#2D6A4F',
      700: '#1b4332',
    },
    surface: {
      primary: '#ffffff',
      secondary: '#F5F5F5',  // Card bg
      tertiary: '#EEEEEE',
      inverse: '#111111',
    },
    text: {
      primary: '#111111',
      secondary: '#888888',
      muted: '#AAAAAA',
      inverse: '#ffffff',
    },
    border: {
      light: '#F0F0F0',
      default: '#E5E5E5',
      dark: '#D5D5D5',
    },
    success: '#2D6A4F',
    warning: '#B45309',
    danger: '#DC2626',
  },

  components: {
    card: {
      bg: '#F5F5F5',
      border: '#E5E5E5',
      radius: '0.75rem',  // 12px
      padding: '1.25rem', // 20px
      shadow: 'none',
    },
    button: {
      radius: '0.5rem',   // 8px
      paddingX: '1rem',
      paddingY: '0.75rem',
    },
    stat: {
      valueSize: '2rem',
      labelSize: '0.75rem',
    },
  },

  layout: {
    pageGutter: '1.25rem', // 20px
    sectionGap: '1.75rem', // 28px
    cardGap: '0.75rem',
  },
};

// ═══════════════════════════════════════════════════════════════
// RECIPE: WELLNESS (Warm, Calm, Journaling feel)
// ═══════════════════════════════════════════════════════════════

export const recipeWellness = {
  name: 'wellness',
  label: 'Bienestar',

  // Custom fonts
  fontFamily: {
    display: "'Fraunces', serif",
    body: "'Plus Jakarta Sans', sans-serif",
  },

  colors: {
    brand: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#2D6A4F',  // Green accent
      600: '#2D6A4F',
      700: '#1b4332',
    },
    surface: {
      primary: '#FFF8F0',  // Warm cream
      secondary: '#FFF1E6', // Peach
      tertiary: '#FFE8D6',
      inverse: '#5C4033',  // Warm brown
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#8B7355',
      muted: '#A89585',
      inverse: '#FFF8F0',
    },
    border: {
      light: '#FFE8D6',
      default: '#E8D5C4',
      dark: '#D4C0AD',
    },
    success: '#2D6A4F',
    warning: '#B45309',
    danger: '#C53030',
  },

  components: {
    card: {
      bg: '#FFF1E6',
      border: '#E8D5C4',
      radius: '1.5rem',   // 24px
      padding: '1.5rem',  // 24px
      shadow: '0 4px 16px rgba(92,64,51,0.06)',
    },
    button: {
      radius: '9999px',   // Pill
      paddingX: '1.5rem',
      paddingY: '0.875rem',
    },
    stat: {
      valueSize: '2.25rem',
      labelSize: '0.8125rem',
    },
  },

  layout: {
    pageGutter: '1.5rem',  // 24px
    sectionGap: '1.75rem', // 28px
    cardGap: '1rem',
  },
};

// ═══════════════════════════════════════════════════════════════
// RECIPE: DARK STUDY (Night mode, Green glow)
// ═══════════════════════════════════════════════════════════════

export const recipeDarkStudy = {
  name: 'darkStudy',
  label: 'Nocturno',

  // Custom fonts
  fontFamily: {
    display: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },

  colors: {
    brand: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#74C69D',  // Luminous green
      500: '#74C69D',
      600: '#52B788',
      700: '#40916C',
    },
    surface: {
      primary: '#0F0F0F',
      secondary: '#1A1A1A',  // Card bg
      tertiary: '#242424',
      inverse: '#F0F0F0',
    },
    text: {
      primary: '#F0F0F0',
      secondary: '#888888',
      muted: '#666666',
      inverse: '#0F0F0F',
    },
    border: {
      light: 'rgba(255,255,255,0.04)',
      default: 'rgba(255,255,255,0.06)',
      dark: 'rgba(255,255,255,0.1)',
    },
    success: '#74C69D',
    warning: '#F59E0B',
    danger: '#EF4444',
  },

  components: {
    card: {
      bg: '#1A1A1A',
      border: 'rgba(255,255,255,0.06)',
      radius: '1rem',     // 16px
      padding: '1.25rem', // 20px
      shadow: 'none',
    },
    button: {
      radius: '0.625rem', // 10px
      paddingX: '1rem',
      paddingY: '0.75rem',
    },
    stat: {
      valueSize: '2rem',
      labelSize: '0.75rem',
    },
  },

  layout: {
    pageGutter: '1rem',
    sectionGap: '1.5rem', // 24px
    cardGap: '0.75rem',
  },
};

// ═══════════════════════════════════════════════════════════════
// ALL RECIPES
// ═══════════════════════════════════════════════════════════════

export const recipes = {
  current: recipeCurrent,
  minimal: recipeMinimal,
  warm: recipeWarm,
  dark: recipeDark,
  tool: recipeTool,
  wellness: recipeWellness,
  darkStudy: recipeDarkStudy,
};

export const recipeList = Object.values(recipes);

// ═══════════════════════════════════════════════════════════════
// CSS CUSTOM PROPERTY GENERATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Converts a recipe to CSS custom properties object
 * These are applied to :root by ThemeProvider
 */
export function recipeToCSS(recipe) {
  const defaultFonts = baseTokens.fontFamily;

  return {
    // Fonts (use recipe fonts if defined, otherwise base)
    '--font-display': recipe.fontFamily?.display || defaultFonts.display,
    '--font-body': recipe.fontFamily?.body || defaultFonts.body,

    // Brand colors
    '--color-brand-50': recipe.colors.brand[50],
    '--color-brand-100': recipe.colors.brand[100],
    '--color-brand-200': recipe.colors.brand[200],
    '--color-brand-300': recipe.colors.brand[300],
    '--color-brand-400': recipe.colors.brand[400],
    '--color-brand-500': recipe.colors.brand[500],
    '--color-brand-600': recipe.colors.brand[600],
    '--color-brand-700': recipe.colors.brand[700],

    // Surface
    '--surface-primary': recipe.colors.surface.primary,
    '--surface-secondary': recipe.colors.surface.secondary,
    '--surface-tertiary': recipe.colors.surface.tertiary,
    '--surface-inverse': recipe.colors.surface.inverse,

    // Text
    '--text-primary': recipe.colors.text.primary,
    '--text-secondary': recipe.colors.text.secondary,
    '--text-muted': recipe.colors.text.muted,
    '--text-inverse': recipe.colors.text.inverse,

    // Border
    '--border-light': recipe.colors.border.light,
    '--border-default': recipe.colors.border.default,
    '--border-dark': recipe.colors.border.dark,

    // Semantic
    '--color-success': recipe.colors.success,
    '--color-warning': recipe.colors.warning,
    '--color-danger': recipe.colors.danger,

    // Components: Card
    '--card-bg': recipe.components.card.bg,
    '--card-border': recipe.components.card.border,
    '--card-radius': recipe.components.card.radius,
    '--card-padding': recipe.components.card.padding,
    '--card-shadow': recipe.components.card.shadow,

    // Components: Button
    '--button-radius': recipe.components.button.radius,
    '--button-padding-x': recipe.components.button.paddingX,
    '--button-padding-y': recipe.components.button.paddingY,

    // Components: Stat
    '--stat-value-size': recipe.components.stat.valueSize,
    '--stat-label-size': recipe.components.stat.labelSize,

    // Layout
    '--page-gutter': recipe.layout.pageGutter,
    '--section-gap': recipe.layout.sectionGap,
    '--card-gap': recipe.layout.cardGap,
  };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  base: baseTokens,
  recipes,
  recipeList,
  recipeToCSS,
};
