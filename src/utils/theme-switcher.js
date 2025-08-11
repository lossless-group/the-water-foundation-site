// Theme Switcher Utility
export class ThemeSwitcher {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'default';
    this.applyTheme(this.currentTheme, true);
  }

  getStoredTheme() {
    if (typeof window === 'undefined') return 'default';
    return localStorage.getItem('theme') || 'default';
  }

  storeTheme(theme) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  /**
   * Apply the theme to the document
   * @param {string} theme - The theme to apply ('default' or 'water')
   * @param {boolean} [initialLoad=false] - Whether this is the initial load
   */
  applyTheme(theme, initialLoad = false) {
    if (typeof document === 'undefined') return;
    
    const html = document.documentElement;
    
    // Remove all theme classes first
    ['data-theme', 'data-theme-default', 'data-theme-water'].forEach(attr => {
      html.removeAttribute(attr);
    });
    
    // Apply the selected theme
    if (theme === 'water') {
      html.setAttribute('data-theme', 'water');
      html.setAttribute('data-theme-water', '');
    } else {
      html.setAttribute('data-theme', 'default');
      html.setAttribute('data-theme-default', '');
    }
    
    // Only store the theme if it's not the initial load
    if (!initialLoad) {
      this.currentTheme = theme;
      this.storeTheme(theme);
    }
    
    // Dispatch a custom event when theme changes
    this.dispatchThemeChange(theme);
  }
  
  /**
   * Dispatch a custom event when the theme changes
   */
  dispatchThemeChange(theme) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('theme-change', { 
        detail: { theme } 
      }));
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
   * Get the current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  /**
   * Set a specific theme
   * @param {string} theme - The theme to set ('default' or 'water')
   * @returns {string} The theme that was set, or current theme if invalid
   */
  setTheme(theme) {
    if (!['default', 'water'].includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return this.currentTheme;
    }
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.storeTheme(theme);
    return theme;
  }
}

// Create a global instance
export const themeSwitcher = new ThemeSwitcher();

// Initialize on DOM load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Apply the stored theme or default
    themeSwitcher.applyTheme(themeSwitcher.getStoredTheme());
    
    // Listen for mode changes to ensure theme updates are applied correctly
    window.addEventListener('mode-change', (e) => {
      // Re-apply the current theme when mode changes
      themeSwitcher.applyTheme(themeSwitcher.getCurrentTheme());
    });
  });
}
