/**
 * Mode Switcher Utility
 * Handles switching between light and dark modes using data attributes
 */

export class ModeSwitcher {
  constructor() {
    this.currentMode = this.getStoredMode() || 'light';
    this.applyMode(this.currentMode);
  }

  /**
   * Get the currently stored mode from localStorage
   */
  getStoredMode() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mode');
    }
    return null;
  }

  /**
   * Store the mode preference in localStorage
   */
  storeMode(mode) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mode', mode);
    }
  }

  /**
   * Apply the mode to the document
   */
  applyMode(mode) {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      
      if (mode === 'dark') {
        html.setAttribute('data-mode', 'dark');
      } else {
        html.removeAttribute('data-mode');
      }
      
      this.currentMode = mode;
      this.storeMode(mode);
    }
  }

  /**
   * Toggle between light and dark modes
   */
  toggleMode() {
    const newMode = this.currentMode === 'light' ? 'dark' : 'light';
    this.applyMode(newMode);
    return newMode;
  }

  /**
   * Set a specific mode
   */
  setMode(mode) {
    if (mode === 'light' || mode === 'dark') {
      this.applyMode(mode);
      return mode;
    }
    console.warn(`Invalid mode: ${mode}. Valid modes are 'light' and 'dark'.`);
    return this.currentMode;
  }

  /**
   * Get the current mode
   */
  getCurrentMode() {
    return this.currentMode;
  }
}

// Create a global instance
export const modeSwitcher = new ModeSwitcher();

// Auto-initialize on DOM content loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    modeSwitcher.applyMode(modeSwitcher.getCurrentMode());
  });
}
