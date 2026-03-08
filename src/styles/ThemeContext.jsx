/**
 * ThemeContext - Recipe/Theme Management
 *
 * Provides the current recipe to all components.
 * Applies CSS custom properties to :root for Tailwind compatibility.
 *
 * Usage:
 *   // In App root
 *   <ThemeProvider>
 *     <App />
 *   </ThemeProvider>
 *
 *   // In any component
 *   const { recipe, setRecipe, tokens } = useTheme();
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { recipes, recipeToCSS, baseTokens, recipeCurrent } from './tokens';

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const ThemeContext = createContext(null);

// ═══════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════

export function ThemeProvider({ children, defaultRecipe = 'current' }) {
  const [recipeName, setRecipeName] = useState(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('oposita-recipe');
      if (saved && recipes[saved]) {
        return saved;
      }
    }
    return defaultRecipe;
  });

  const recipe = recipes[recipeName] || recipeCurrent;

  // Apply CSS custom properties when recipe changes
  useEffect(() => {
    const cssVars = recipeToCSS(recipe);
    const root = document.documentElement;

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Save preference
    localStorage.setItem('oposita-recipe', recipeName);

    // Apply dark mode class if needed
    if (recipeName === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [recipe, recipeName]);

  // Memoized setRecipe function
  const setRecipe = useCallback((name) => {
    if (recipes[name]) {
      setRecipeName(name);
    } else {
      console.warn(`Recipe "${name}" not found. Available: ${Object.keys(recipes).join(', ')}`);
    }
  }, []);

  // Combined tokens (base + recipe)
  const tokens = useMemo(() => ({
    ...baseTokens,
    colors: recipe.colors,
    components: recipe.components,
    layout: recipe.layout,
  }), [recipe]);

  const value = useMemo(() => ({
    // Current recipe name
    recipeName,
    // Current recipe object
    recipe,
    // Function to change recipe
    setRecipe,
    // All available recipes
    recipes,
    // Combined tokens for components
    tokens,
    // Base tokens (spacing, fontSizes, etc.)
    base: baseTokens,
  }), [recipeName, recipe, setRecipe, tokens]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    // Return defaults if used outside provider (dev convenience)
    return {
      recipeName: 'current',
      recipe: recipeCurrent,
      setRecipe: () => console.warn('useTheme must be used within ThemeProvider'),
      recipes,
      tokens: {
        ...baseTokens,
        colors: recipeCurrent.colors,
        components: recipeCurrent.components,
        layout: recipeCurrent.layout,
      },
      base: baseTokens,
    };
  }

  return context;
}

// ═══════════════════════════════════════════════════════════════
// UTILITY HOOK: Get specific token values
// ═══════════════════════════════════════════════════════════════

export function useTokens() {
  const { tokens } = useTheme();
  return tokens;
}

// ═══════════════════════════════════════════════════════════════
// UTILITY HOOK: Style object generator
// ═══════════════════════════════════════════════════════════════

/**
 * Helper to create inline styles from tokens
 *
 * Usage:
 *   const cardStyle = useTokenStyle({
 *     backgroundColor: 'card.bg',
 *     borderRadius: 'card.radius',
 *     padding: 'card.padding',
 *   });
 */
export function useTokenStyle(styleMap) {
  const { tokens } = useTheme();

  return useMemo(() => {
    const result = {};

    for (const [cssProp, tokenPath] of Object.entries(styleMap)) {
      const value = getNestedValue(tokens, tokenPath);
      if (value !== undefined) {
        result[cssProp] = value;
      }
    }

    return result;
  }, [tokens, styleMap]);
}

// Helper to get nested object value by path string
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default ThemeProvider;
