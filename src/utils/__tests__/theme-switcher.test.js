import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeSwitcher } from '../theme-switcher.js';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock document
const documentMock = {
  documentElement: {
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
  },
};

describe('ThemeSwitcher', () => {
  let themeSwitcher;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup global mocks
    global.localStorage = localStorageMock;
    global.document = documentMock;
    global.window = {};
    
    // Create fresh instance for each test
    themeSwitcher = new ThemeSwitcher();
  });

  describe('constructor', () => {
    it('should initialize with default theme when no stored theme exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const switcher = new ThemeSwitcher();
      
      expect(switcher.getCurrentTheme()).toBe('default');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    it('should initialize with stored theme when it exists', () => {
      localStorageMock.getItem.mockReturnValue('water');
      
      const switcher = new ThemeSwitcher();
      
      expect(switcher.getCurrentTheme()).toBe('water');
      expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'water');
    });
  });

  describe('getStoredTheme', () => {
    it('should return stored theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('water');
      
      const result = themeSwitcher.getStoredTheme();
      
      expect(result).toBe('water');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    it('should return null when localStorage is not available', () => {
      global.window = undefined;
      
      const result = themeSwitcher.getStoredTheme();
      
      expect(result).toBeNull();
    });
  });

  describe('storeTheme', () => {
    it('should store theme in localStorage', () => {
      themeSwitcher.storeTheme('water');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'water');
    });

    it('should not store when window is not available', () => {
      const originalWindow = global.window;
      global.window = undefined;
      
      // Clear mocks from constructor calls
      vi.clearAllMocks();
      
      themeSwitcher.storeTheme('water');
      
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('applyTheme', () => {
    it('should apply water theme by setting data-theme attribute', () => {
      themeSwitcher.applyTheme('water');
      
      expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'water');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'water');
      expect(themeSwitcher.getCurrentTheme()).toBe('water');
    });

    it('should apply default theme by removing data-theme attribute', () => {
      themeSwitcher.applyTheme('default');
      
      expect(documentMock.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'default');
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
    });

    it('should not apply theme when document is not available', () => {
      const originalDocument = global.document;
      global.document = undefined;
      
      // Clear mocks from constructor calls
      vi.clearAllMocks();
      
      themeSwitcher.applyTheme('water');
      
      expect(documentMock.documentElement.setAttribute).not.toHaveBeenCalled();
      
      // Restore document
      global.document = originalDocument;
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from default to water theme', () => {
      themeSwitcher.currentTheme = 'default';
      
      const result = themeSwitcher.toggleTheme();
      
      expect(result).toBe('water');
      expect(themeSwitcher.getCurrentTheme()).toBe('water');
      expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'water');
    });

    it('should toggle from water to default theme', () => {
      themeSwitcher.currentTheme = 'water';
      
      const result = themeSwitcher.toggleTheme();
      
      expect(result).toBe('default');
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      expect(documentMock.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme');
    });
  });

  describe('setTheme', () => {
    it('should set valid theme', () => {
      const result = themeSwitcher.setTheme('water');
      
      expect(result).toBe('water');
      expect(themeSwitcher.getCurrentTheme()).toBe('water');
      expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'water');
    });

    it('should warn and return current theme for invalid theme', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      themeSwitcher.currentTheme = 'default';
      
      const result = themeSwitcher.setTheme('invalid');
      
      expect(result).toBe('default');
      expect(consoleSpy).toHaveBeenCalledWith("Invalid theme: invalid. Valid themes are 'default' and 'water'.");
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      
      consoleSpy.mockRestore();
    });
  });

  describe('getCurrentTheme', () => {
    it('should return current theme', () => {
      themeSwitcher.currentTheme = 'water';
      
      const result = themeSwitcher.getCurrentTheme();
      
      expect(result).toBe('water');
    });
  });
});
