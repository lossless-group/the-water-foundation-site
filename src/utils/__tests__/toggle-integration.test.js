import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { themeSwitcher, ThemeSwitcher } from '../theme-switcher.js';
import { modeSwitcher, ModeSwitcher } from '../mode-switcher.js';

describe('Toggle Integration Tests', () => {
  let dom;
  let document;
  let window;

  // Mock for matchMedia
  const createMatchMedia = (matches = false) => ({
    matches,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  // Mock localStorage
  const localStorageMock = {
    _store: {},
    getItem: vi.fn(function(key) {
      return this._store[key] || null;
    }),
    setItem: vi.fn(function(key, value) {
      this._store[key] = value.toString();
    }),
    removeItem: vi.fn(function(key) {
      delete this._store[key];
    }),
    clear: vi.fn(function() {
      this._store = {};
    })
  };

  // Mock window.matchMedia
  const mockMatchMedia = vi.fn().mockImplementation(createMatchMedia);

  beforeEach(() => {
    // Create a fresh DOM for each test
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head><title>Test</title></head>
        <body>
          <button id="theme-toggle">Toggle to Water Theme</button>
          <button id="mode-toggle">Toggle to Dark Mode</button>
        </body>
      </html>
    `);
    
    document = dom.window.document;
    window = dom.window;
    
    // Setup globals
    global.document = document;
    global.window = {
      ...window,
      matchMedia: mockMatchMedia,
      localStorage: localStorageMock,
      dispatchEvent: vi.fn(),
      CustomEvent: class CustomEvent {
        constructor(type, options) {
          this.type = type;
          this.detail = options?.detail;
        }
      },
    };
    
    // Reset localStorage mock
    localStorageMock.clear();
    
    // Reset switchers to initial state
    themeSwitcher.currentTheme = 'default';
    modeSwitcher.currentMode = 'light';
    
    // Reset mocks
    vi.clearAllMocks();
  });

  describe('Theme Toggle Button Integration', () => {
    it('should update button text when theme is toggled', () => {
      const themeButton = document.getElementById('theme-toggle');
      
      // Initial state
      expect(themeButton.textContent).toBe('Toggle to Water Theme');
      
      // Simulate the button click functionality
      function updateThemeButtonText() {
        const currentTheme = themeSwitcher.getCurrentTheme();
        themeButton.textContent = currentTheme === 'default' 
          ? 'Toggle to Water Theme' 
          : 'Toggle to Default Theme';
      }
      
      // Toggle to water theme
      themeSwitcher.toggleTheme();
      updateThemeButtonText();
      
      expect(themeButton.textContent).toBe('Toggle to Default Theme');
      expect(document.documentElement.getAttribute('data-theme')).toBe('water');
      
      // Toggle back to default
      themeSwitcher.toggleTheme();
      updateThemeButtonText();
      
      expect(themeButton.textContent).toBe('Toggle to Water Theme');
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    });

    it('should handle click events properly', () => {
      const themeButton = document.getElementById('theme-toggle');
      let clickCount = 0;
      
      function handleThemeClick() {
        clickCount++;
        themeSwitcher.toggleTheme();
        const currentTheme = themeSwitcher.getCurrentTheme();
        themeButton.textContent = currentTheme === 'default' 
          ? 'Toggle to Water Theme' 
          : 'Toggle to Default Theme';
      }
      
      themeButton.addEventListener('click', handleThemeClick);
      
      // Simulate clicks
      themeButton.click();
      expect(clickCount).toBe(1);
      expect(themeSwitcher.getCurrentTheme()).toBe('water');
      expect(themeButton.textContent).toBe('Toggle to Default Theme');
      
      themeButton.click();
      expect(clickCount).toBe(2);
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      expect(themeButton.textContent).toBe('Toggle to Water Theme');
    });
  });

  describe('Mode Toggle Button Integration', () => {
    it('should update button text when mode is toggled', () => {
      const modeButton = document.getElementById('mode-toggle');
      
      // Initial state
      expect(modeButton.textContent).toBe('Toggle to Dark Mode');
      
      // Simulate the button click functionality
      function updateModeButtonText() {
        const currentMode = modeSwitcher.getCurrentMode();
        modeButton.textContent = currentMode === 'light' 
          ? 'Toggle to Dark Mode' 
          : 'Toggle to Light Mode';
      }
      
      // Toggle to dark mode
      modeSwitcher.toggleMode();
      updateModeButtonText();
      
      expect(modeButton.textContent).toBe('Toggle to Light Mode');
      expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
      
      // Toggle back to light
      modeSwitcher.toggleMode();
      updateModeButtonText();
      
      expect(modeButton.textContent).toBe('Toggle to Dark Mode');
      expect(document.documentElement.hasAttribute('data-mode')).toBe(false);
    });

    it('should handle click events properly', () => {
      const modeButton = document.getElementById('mode-toggle');
      let clickCount = 0;
      
      function handleModeClick() {
        clickCount++;
        modeSwitcher.toggleMode();
        const currentMode = modeSwitcher.getCurrentMode();
        modeButton.textContent = currentMode === 'light' 
          ? 'Toggle to Dark Mode' 
          : 'Toggle to Light Mode';
      }
      
      modeButton.addEventListener('click', handleModeClick);
      
      // Simulate clicks
      modeButton.click();
      expect(clickCount).toBe(1);
      expect(modeSwitcher.getCurrentMode()).toBe('dark');
      expect(modeButton.textContent).toBe('Toggle to Light Mode');
      
      modeButton.click();
      expect(clickCount).toBe(2);
      expect(modeSwitcher.getCurrentMode()).toBe('light');
      expect(modeButton.textContent).toBe('Toggle to Dark Mode');
    });
  });

  describe('Combined Theme and Mode Functionality', () => {
    it('should allow independent toggling of theme and mode', () => {
      const themeButton = document.getElementById('theme-toggle');
      const modeButton = document.getElementById('mode-toggle');
      
      // Set up event handlers
      function updateThemeButtonText() {
        const currentTheme = themeSwitcher.getCurrentTheme();
        themeButton.textContent = currentTheme === 'default' 
          ? 'Toggle to Water Theme' 
          : 'Toggle to Default Theme';
      }
      
      function updateModeButtonText() {
        const currentMode = modeSwitcher.getCurrentMode();
        modeButton.textContent = currentMode === 'light' 
          ? 'Toggle to Dark Mode' 
          : 'Toggle to Light Mode';
      }
      
      themeButton.addEventListener('click', () => {
        themeSwitcher.toggleTheme();
        updateThemeButtonText();
      });
      
      modeButton.addEventListener('click', () => {
        modeSwitcher.toggleMode();
        updateModeButtonText();
      });
      
      // Initial state: default theme, light mode
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      expect(modeSwitcher.getCurrentMode()).toBe('light');
      
      // Toggle theme to water, keep light mode
      themeButton.click();
      expect(themeSwitcher.getCurrentTheme()).toBe('water');
      expect(modeSwitcher.getCurrentMode()).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('water');
      expect(document.documentElement.hasAttribute('data-mode')).toBe(false);
      
      // Toggle mode to dark, keep water theme
      modeButton.click();
      expect(themeSwitcher.getCurrentTheme()).toBe('water');
      expect(modeSwitcher.getCurrentMode()).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('water');
      expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
      
      // Toggle theme back to default, keep dark mode
      themeButton.click();
      expect(themeSwitcher.getCurrentTheme()).toBe('default');
      expect(modeSwitcher.getCurrentMode()).toBe('dark');
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
      expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    });
  });
});
