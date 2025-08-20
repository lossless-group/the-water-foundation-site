/**
 * Mode Switcher Utility
 * Handles switching between light and dark modes using data attributes
 */

export class ModeSwitcher {
  constructor() {
    this.currentMode = this.getStoredMode() || this.getSystemPreference();
    this.applyMode(this.currentMode, true);
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
   * Get the system color scheme preference
   */
  getSystemPreference() {
    if (typeof window === 'undefined') return 'dark';
    return 'dark'; // Always default to dark mode
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
   * @param {string} mode - The mode to apply ('light' or 'dark')
   * @param {boolean} [initialLoad=false] - Whether this is the initial load
   */
  applyMode(mode, initialLoad = false) {
    if (typeof document === 'undefined') return;
    
    const html = document.documentElement;
    
    if (mode === 'dark') {
      html.setAttribute('data-mode', 'dark');
      // Ensure Tailwind dark mode class is kept in sync
      html.classList.add('dark');
    } else {
      html.removeAttribute('data-mode');
      html.classList.remove('dark');
    }
    
    // Only store the mode if it's not the initial load
    if (!initialLoad) {
      this.currentMode = mode;
      this.storeMode(mode);
    }
    
    // Dispatch a custom event when mode changes
    this.dispatchModeChange(mode);
  }
  
  /**
   * Dispatch a custom event when the mode changes
   */
  dispatchModeChange(mode) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mode-change', { 
        detail: { mode } 
      }));
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
    // Apply the stored mode or default to dark
    modeSwitcher.applyMode(modeSwitcher.getStoredMode() || 'dark');
  });
}

// Expose globally so components can access without ESM imports
if (typeof window !== 'undefined') {
  // Do not overwrite if already present
  window.modeSwitcher = window.modeSwitcher || modeSwitcher;
}
