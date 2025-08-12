import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeSwitcher } from '../theme-switcher.js';

describe('ThemeSwitcher', () => {
  let switcher;
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Reset DOM state using the global reset function
    global.resetDOMState();
    
    // Reset localStorage
    window.localStorage.clear();
    
    // Create a fresh instance for each test
    switcher = new ThemeSwitcher();
  });

  describe('constructor', () => {
    it('should initialize with default theme by default', () => {
      expect(switcher.getCurrentTheme()).toBe('default');
    });

    it('should initialize with stored theme if available', () => {
      // Mock localStorage to return 'water' theme
      global.localStorage.getItem.mockReturnValue('water');
      
      const newSwitcher = new ThemeSwitcher();
      expect(newSwitcher.getCurrentTheme()).toBe('water');
    });
  });
  
  describe('setTheme', () => {
    it('should set and apply default theme', () => {
      const result = switcher.setTheme('default');
      
      expect(result).toBe('default');
      expect(switcher.getCurrentTheme()).toBe('default');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'default');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'default');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-default');
    });
    
    it('should set and apply water theme', () => {
      const result = switcher.setTheme('water');
      
      expect(result).toBe('water');
      expect(switcher.getCurrentTheme()).toBe('water');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'water');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'water');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-water');
    });

    it('should remove previous theme classes when switching themes', () => {
      // First set to water
      switcher.setTheme('water');
      vi.clearAllMocks();
      
      // Then switch to default
      switcher.setTheme('default');
      
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('theme-default', 'theme-water');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-default');
    });
    
    it('should warn and return current theme for invalid theme', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Get the current theme before attempting invalid change
      const currentTheme = switcher.getCurrentTheme();
      const result = switcher.setTheme('invalid-theme');
      
      expect(result).toBe(currentTheme); // Should remain at current theme
      expect(switcher.getCurrentTheme()).toBe(currentTheme); // Should not change
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid theme: invalid-theme');
      
      consoleWarnSpy.mockRestore();
    });

    it('should dispatch theme-change event', () => {
      switcher.setTheme('water');
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'theme-change',
          detail: { theme: 'water' }
        })
      );
    });
  });
  
  describe('toggleTheme', () => {
    it('should toggle from default to water theme', () => {
      // Ensure we start with default theme
      switcher.setTheme('default');
      expect(switcher.getCurrentTheme()).toBe('default');
      
      const result = switcher.toggleTheme();
      
      expect(result).toBe('water');
      expect(switcher.getCurrentTheme()).toBe('water');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'water');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'water');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-water');
    });
    
    it('should toggle from water to default theme', () => {
      // First set to water
      switcher.setTheme('water');
      vi.clearAllMocks();
      
      const result = switcher.toggleTheme();
      
      expect(result).toBe('default');
      expect(switcher.getCurrentTheme()).toBe('default');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'default');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'default');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-default');
    });

    it('should dispatch theme-change event when toggling', () => {
      switcher.toggleTheme();
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'theme-change',
          detail: { theme: 'water' }
        })
      );
    });
  });
  
  describe('getCurrentTheme', () => {
    it('should return the current theme from internal state', () => {
      // Ensure we start with a clean state
      switcher.setTheme('default');
      expect(switcher.getCurrentTheme()).toBe('default');
      
      switcher.setTheme('water');
      expect(switcher.getCurrentTheme()).toBe('water');
    });

    it('should detect theme from DOM classes', () => {
      // Mock DOM to have water theme class
      document.documentElement.classList.contains.mockImplementation((className) => {
        return className === 'theme-water';
      });
      
      expect(switcher.getCurrentTheme()).toBe('water');
    });

    it('should default to "default" theme if no theme classes found', () => {
      // Mock DOM to have no theme classes
      document.documentElement.classList.contains.mockReturnValue(false);
      
      expect(switcher.getCurrentTheme()).toBe('default');
    });
  });

  describe('getStoredTheme', () => {
    it('should return stored theme from localStorage', () => {
      global.localStorage.getItem.mockReturnValue('water');
      
      expect(switcher.getStoredTheme()).toBe('water');
      expect(localStorage.getItem).toHaveBeenCalledWith('theme');
    });

    it('should return "default" if no stored theme', () => {
      global.localStorage.getItem.mockReturnValue(null);
      
      expect(switcher.getStoredTheme()).toBe('default');
    });

    it('should return "default" in server environment', () => {
      // Temporarily remove window to simulate server environment
      const originalWindow = global.window;
      delete global.window;
      
      expect(switcher.getStoredTheme()).toBe('default');
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('storeTheme', () => {
    it('should store theme in localStorage', () => {
      switcher.storeTheme('water');
      
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'water');
    });

    it('should not store theme in server environment', () => {
      // Temporarily remove window to simulate server environment
      const originalWindow = global.window;
      delete global.window;
      
      switcher.storeTheme('water');
      
      expect(localStorage.setItem).not.toHaveBeenCalled();
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('applyTheme', () => {
    it('should apply theme classes and attributes correctly', () => {
      switcher.applyTheme('water');
      
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('theme-default', 'theme-water');
      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme');
      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme-default');
      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme-water');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'water');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-water');
    });

    it('should not store theme on initial load', () => {
      switcher.applyTheme('water', true);
      
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should store theme when not initial load', () => {
      switcher.applyTheme('water', false);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'water');
    });

    it('should dispatch theme change event', () => {
      switcher.applyTheme('water');
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'theme-change',
          detail: { theme: 'water' }
        })
      );
    });
  });

  describe('dispatchThemeChange', () => {
    it('should dispatch custom theme-change event', () => {
      switcher.dispatchThemeChange('water');
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'theme-change',
          detail: { theme: 'water' }
        })
      );
    });

    it('should not dispatch event in server environment', () => {
      // Temporarily remove window to simulate server environment
      const originalWindow = global.window;
      delete global.window;
      
      // Should not throw errors
      expect(() => {
        switcher.dispatchThemeChange('water');
      }).not.toThrow();
      
      // Restore window
      global.window = originalWindow;
    });
  });
});
