/**
 * Theme Switcher Utility
 * Handles switching between default and water themes using data attributes
 */

export class ThemeSwitcher {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'default';
    this.applyTheme(this.currentTheme);
  }

  /**
   * Get the currently stored theme from localStorage
   */
  getStoredTheme() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme');
    }
    return null;
  }

  /**
   * Store the theme preference in localStorage
   */
  storeTheme(theme) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  /**
   * Apply the theme to the document
   */
  applyTheme(theme) {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      
      if (theme === 'water') {
        html.setAttribute('data-theme', 'water');
      } else {
        html.removeAttribute('data-theme');
      }
      
      this.currentTheme = theme;
      this.storeTheme(theme);
    }
  }

  /**
   * Toggle between default and water themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'default' ? 'water' : 'default';
    this.applyTheme(newTheme);
    return newTheme;
  }

  /**
   * Set a specific theme
   */
  setTheme(theme) {
    if (theme === 'default' || theme === 'water') {
      this.applyTheme(theme);
      return theme;
    }
    console.warn(`Invalid theme: ${theme}. Valid themes are 'default' and 'water'.`);
    return this.currentTheme;
  }

  /**
   * Get the current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Create a global instance
export const themeSwitcher = new ThemeSwitcher();

// Auto-initialize on DOM content loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    themeSwitcher.applyTheme(themeSwitcher.getCurrentTheme());
  });
}
