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
    
    // Remove existing theme classes
    html.classList.remove('theme-default', 'theme-water');
    
    // Remove theme attributes
    html.removeAttribute('data-theme');
    html.removeAttribute('data-theme-default');
    html.removeAttribute('data-theme-water');
    
    // Apply the selected theme
    if (theme === 'water') {
      html.setAttribute('data-theme', 'water');
      html.classList.add('theme-water');
    } else {
      html.setAttribute('data-theme', 'default');
      html.classList.add('theme-default');
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
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'water' ? 'default' : 'water';
    
    // Update internal state
    this.currentTheme = newTheme;
    this.applyTheme(newTheme);
    this.storeTheme(newTheme);
    
    // Dispatch a custom event for any components that need to know about theme changes
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: newTheme } }));
    }
    return newTheme;
  }

  /**
   * Get the current theme
   */
  getCurrentTheme() {
    if (typeof document === 'undefined') return 'default';
    const html = document.documentElement;
    if (html.classList.contains('theme-water')) return 'water';
    if (html.classList.contains('theme-default')) return 'default';
    return 'default';
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
    const savedTheme = themeSwitcher.getStoredTheme();
    themeSwitcher.applyTheme(savedTheme || 'default', true);
    
    // Add theme transition class after initial load to prevent flash of unstyled content
    setTimeout(() => {
      document.documentElement.classList.add('theme-transition');
    }, 0);
  });
}
