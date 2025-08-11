// Global setup for tests
import { vi } from 'vitest';

// Mock global objects
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};

global.localStorage = localStorageMock;
global.window = {
  matchMedia: () => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }),
  localStorage: localStorageMock,
  dispatchEvent: vi.fn(),
  CustomEvent: class {}
};

const documentMock = {
  documentElement: {
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    hasAttribute: vi.fn().mockReturnValue(false),
    getAttribute: vi.fn().mockReturnValue(null)
  },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
};

global.document = documentMock;
