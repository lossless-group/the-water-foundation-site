import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ModeSwitcher } from '../mode-switcher.js';

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

describe('ModeSwitcher', () => {
  let modeSwitcher;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup global mocks
    global.localStorage = localStorageMock;
    global.document = documentMock;
    global.window = {};
    
    // Create fresh instance for each test
    modeSwitcher = new ModeSwitcher();
  });

  describe('constructor', () => {
    it('should initialize with light mode when no stored mode exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const switcher = new ModeSwitcher();
      
      expect(switcher.getCurrentMode()).toBe('light');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('mode');
    });

    it('should initialize with stored mode when it exists', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      const switcher = new ModeSwitcher();
      
      expect(switcher.getCurrentMode()).toBe('dark');
      expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
    });
  });

  describe('getStoredMode', () => {
    it('should return stored mode from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      const result = modeSwitcher.getStoredMode();
      
      expect(result).toBe('dark');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('mode');
    });

    it('should return null when localStorage is not available', () => {
      global.window = undefined;
      
      const result = modeSwitcher.getStoredMode();
      
      expect(result).toBeNull();
    });
  });

  describe('storeMode', () => {
    it('should store mode in localStorage', () => {
      modeSwitcher.storeMode('dark');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('mode', 'dark');
    });

    it('should not store when window is not available', () => {
      const originalWindow = global.window;
      global.window = undefined;
      
      // Clear mocks from constructor calls
      vi.clearAllMocks();
      
      modeSwitcher.storeMode('dark');
      
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('applyMode', () => {
    it('should apply dark mode by setting data-mode attribute', () => {
      modeSwitcher.applyMode('dark');
      
      expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('mode', 'dark');
      expect(modeSwitcher.getCurrentMode()).toBe('dark');
    });

    it('should apply light mode by removing data-mode attribute', () => {
      modeSwitcher.applyMode('light');
      
      expect(documentMock.documentElement.removeAttribute).toHaveBeenCalledWith('data-mode');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('mode', 'light');
      expect(modeSwitcher.getCurrentMode()).toBe('light');
    });

    it('should not apply mode when document is not available', () => {
      const originalDocument = global.document;
      global.document = undefined;
      
      // Clear mocks from constructor calls
      vi.clearAllMocks();
      
      modeSwitcher.applyMode('dark');
      
      expect(documentMock.documentElement.setAttribute).not.toHaveBeenCalled();
      
      // Restore document
      global.document = originalDocument;
    });
  });

  describe('toggleMode', () => {
    it('should toggle from light to dark mode', () => {
      modeSwitcher.currentMode = 'light';
      
      const result = modeSwitcher.toggleMode();
      
      expect(result).toBe('dark');
      expect(modeSwitcher.getCurrentMode()).toBe('dark');
      expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
    });

    it('should toggle from dark to light mode', () => {
      modeSwitcher.currentMode = 'dark';
      
      const result = modeSwitcher.toggleMode();
      
      expect(result).toBe('light');
      expect(modeSwitcher.getCurrentMode()).toBe('light');
      expect(documentMock.documentElement.removeAttribute).toHaveBeenCalledWith('data-mode');
    });
  });

  describe('setMode', () => {
    it('should set valid mode', () => {
      const result = modeSwitcher.setMode('dark');
      
      expect(result).toBe('dark');
      expect(modeSwitcher.getCurrentMode()).toBe('dark');
      expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
    });

    it('should warn and return current mode for invalid mode', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      modeSwitcher.currentMode = 'light';
      
      const result = modeSwitcher.setMode('invalid');
      
      expect(result).toBe('light');
      expect(consoleSpy).toHaveBeenCalledWith("Invalid mode: invalid. Valid modes are 'light' and 'dark'.");
      expect(modeSwitcher.getCurrentMode()).toBe('light');
      
      consoleSpy.mockRestore();
    });
  });

  describe('getCurrentMode', () => {
    it('should return current mode', () => {
      modeSwitcher.currentMode = 'dark';
      
      const result = modeSwitcher.getCurrentMode();
      
      expect(result).toBe('dark');
    });
  });
});
