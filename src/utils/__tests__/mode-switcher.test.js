import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModeSwitcher } from '../mode-switcher.js';

describe('ModeSwitcher', () => {
  let switcher;
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Create a fresh instance for each test
    switcher = new ModeSwitcher();
  });

  describe('constructor', () => {
    it('should initialize with light mode by default', () => {
      expect(switcher.getCurrentMode()).toBe('light');
    });
  });
  
  describe('setMode', () => {
    it('should set and apply dark mode', () => {
      const result = switcher.setMode('dark');
      
      expect(result).toBe('dark');
      expect(switcher.getCurrentMode()).toBe('dark');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('mode', 'dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
    });
    
    it('should set and apply light mode', () => {
      // First set to dark to test the transition
      switcher.setMode('dark');
      vi.clearAllMocks();
      
      const result = switcher.setMode('light');
      
      expect(result).toBe('light');
      expect(switcher.getCurrentMode()).toBe('light');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('mode', 'light');
      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-mode');
    });
    
    it('should warn and return current mode for invalid mode', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = switcher.setMode('invalid-mode');
      
      expect(result).toBe('light'); // Should remain at default
      expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid mode: invalid-mode. Valid modes are 'light' and 'dark'.");
      
      consoleWarnSpy.mockRestore();
    });
  });
  
  describe('toggleMode', () => {
    it('should toggle from light to dark mode', () => {
      switcher.toggleMode();
      
      expect(switcher.getCurrentMode()).toBe('dark');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('mode', 'dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
    });
    
    it('should toggle from dark to light mode', () => {
      // First set to dark
      switcher.setMode('dark');
      vi.clearAllMocks();
      
      switcher.toggleMode();
      
      expect(switcher.getCurrentMode()).toBe('light');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('mode', 'light');
      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-mode');
    });
  });
  
  describe('getCurrentMode', () => {
    it('should return the current mode', () => {
      expect(switcher.getCurrentMode()).toBe('light');
      
      switcher.setMode('dark');
      expect(switcher.getCurrentMode()).toBe('dark');
    });
  });
});
