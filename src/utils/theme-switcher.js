// Theme Switcher Utility
export class ThemeSwitcher {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'default';
    this.applyTheme(this.currentTheme);
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

  applyTheme(theme) {
    if (typeof document === 'undefined') return;
    
    const html = document.documentElement;
    
    // Remove all theme classes first
    html.removeAttribute('data-theme');
    
    // Apply the selected theme
    if (theme === 'water') {
      html.setAttribute('data-theme', 'water');
    }
    
    this.currentTheme = theme;
    this.storeTheme(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'default' ? 'water' : 'default';
    this.applyTheme(newTheme);
    return newTheme;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

export const themeSwitcher = new ThemeSwitcher();

// Initialize on DOM load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = themeSwitcher.getStoredTheme();
    themeSwitcher.applyTheme(savedTheme);
  });
}
