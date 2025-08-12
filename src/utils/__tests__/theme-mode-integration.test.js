import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeSwitcher } from '../theme-switcher.js';
import { ModeSwitcher } from '../mode-switcher.js';

describe('Theme and Mode Integration', () => {
  let themeSwitcher;
  let modeSwitcher;
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Reset DOM state using the global reset function
    global.resetDOMState();
    
    // Reset localStorage
    window.localStorage.clear();
    
    // Create fresh instances for each test
    themeSwitcher = new ThemeSwitcher();
    modeSwitcher = new ModeSwitcher();
  });

  describe('Theme and Mode Combination States', () => {
    it('should handle default theme with light mode', () => {
      themeSwitcher.setTheme('default');
      modeSwitcher.setMode('light');
      
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      expect(modeSwitcher.getCurrentMode()).toBe('light');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-default');
      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-mode');
    });

    it('should handle default theme with dark mode', () => {
      themeSwitcher.setTheme('default');
      modeSwitcher.setMode('dark');
      
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      expect(modeSwitcher.getCurrentMode()).toBe('dark');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-default');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
    });

    it('should handle water theme with light mode', () => {
      themeSwitcher.setTheme('water');
      modeSwitcher.setMode('light');
      
      expect(themeSwitcher.getCurrentTheme()).toBe('water');
      expect(modeSwitcher.getCurrentMode()).toBe('light');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-water');
      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-mode');
    });

    it('should handle water theme with dark mode', () => {
      themeSwitcher.setTheme('water');
      modeSwitcher.setMode('dark');
      
      expect(themeSwitcher.getCurrentTheme()).toBe('water');
      expect(modeSwitcher.getCurrentMode()).toBe('dark');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-water');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
    });
  });

  describe('State Persistence', () => {
    it('should persist both theme and mode in localStorage', () => {
      themeSwitcher.setTheme('water');
      modeSwitcher.setMode('dark');
      
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'water');
      expect(localStorage.setItem).toHaveBeenCalledWith('mode', 'dark');
    });

    it('should restore both theme and mode from localStorage', () => {
      // Mock stored values
      global.localStorage.getItem.mockImplementation((key) => {
        if (key === 'theme') return 'water';
        if (key === 'mode') return 'dark';
        return null;
      });
      
      const newThemeSwitcher = new ThemeSwitcher();
      const newModeSwitcher = new ModeSwitcher();
      
      expect(newThemeSwitcher.getCurrentTheme()).toBe('water');
      expect(newModeSwitcher.getCurrentMode()).toBe('dark');
    });
  });

  describe('Event Dispatching', () => {
    it('should dispatch separate events for theme and mode changes', () => {
      themeSwitcher.setTheme('water');
      modeSwitcher.setMode('dark');
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'theme-change',
          detail: { theme: 'water' }
        })
      );
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mode-change',
          detail: { mode: 'dark' }
        })
      );
    });
  });

  describe('Toggle Operations', () => {
    it('should handle simultaneous theme and mode toggles', () => {
      // Ensure we start with known state
      themeSwitcher.setTheme('default');
      modeSwitcher.setMode('light');
      
      // Start with default theme and light mode
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      expect(modeSwitcher.getCurrentMode()).toBe('light');
      
      // Toggle both
      const newTheme = themeSwitcher.toggleTheme();
      const newMode = modeSwitcher.toggleMode();
      
      expect(newTheme).toBe('water');
      expect(newMode).toBe('dark');
      expect(themeSwitcher.getCurrentTheme()).toBe('water');
      expect(modeSwitcher.getCurrentMode()).toBe('dark');
    });

    it('should maintain independent state when toggling', () => {
      // Set initial state
      themeSwitcher.setTheme('water');
      modeSwitcher.setMode('dark');
      
      // Toggle only theme
      themeSwitcher.toggleTheme();
      
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      expect(modeSwitcher.getCurrentMode()).toBe('dark'); // Should remain unchanged
      
      // Toggle only mode
      modeSwitcher.toggleMode();
      
      expect(themeSwitcher.getCurrentTheme()).toBe('default'); // Should remain unchanged
      expect(modeSwitcher.getCurrentMode()).toBe('light');
    });
  });

  describe('DOM State Validation', () => {
    it('should properly clean up DOM attributes when switching', () => {
      // Set initial state
      themeSwitcher.setTheme('water');
      modeSwitcher.setMode('dark');
      vi.clearAllMocks();
      
      // Switch to different state
      themeSwitcher.setTheme('default');
      modeSwitcher.setMode('light');
      
      // Verify cleanup
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('theme-default', 'theme-water');
      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-mode');
    });

    it('should handle invalid combinations gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Ensure we start with known state
      themeSwitcher.setTheme('default');
      modeSwitcher.setMode('light');
      
      // Try invalid theme
      themeSwitcher.setTheme('invalid-theme');
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      
      // Try invalid mode
      modeSwitcher.setMode('invalid-mode');
      expect(modeSwitcher.getCurrentMode()).toBe('light');
      
      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Server-Side Rendering Compatibility', () => {
    it('should handle server environment gracefully', () => {
      // Temporarily remove document to simulate server environment
      const originalDocument = global.document;
      delete global.document;
      
      // Should not throw errors
      expect(() => {
        const serverThemeSwitcher = new ThemeSwitcher();
        const serverModeSwitcher = new ModeSwitcher();
        
        serverThemeSwitcher.setTheme('water');
        serverModeSwitcher.setMode('dark');
      }).not.toThrow();
      
      // Restore document
      global.document = originalDocument;
    });
  });

  describe('CSS Variable Integration', () => {
    it('should ensure theme classes are applied for CSS variable inheritance', () => {
      // Test that theme classes are properly applied for CSS variables to work
      themeSwitcher.setTheme('water');
      
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-water');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'water');
      
      // Verify that previous theme classes are removed
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('theme-default', 'theme-water');
    });

    it('should ensure mode attributes are applied for dark mode CSS variables', () => {
      modeSwitcher.setMode('dark');
      
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
      
      // Switch back to light
      modeSwitcher.setMode('light');
      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-mode');
    });
  });
});
