// Test setup file for Vitest
import { vi } from 'vitest';

// Mock localStorage globally
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Ensure clean state before each test
beforeEach(() => {
  vi.clearAllMocks();
});
