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

// Create a stateful DOM mock that tracks changes
const createStatefulDOMElement = () => {
  const classes = new Set();
  const attributes = new Map();
  
  return {
    setAttribute: vi.fn((name, value) => {
      attributes.set(name, value);
    }),
    removeAttribute: vi.fn((name) => {
      attributes.delete(name);
    }),
    hasAttribute: vi.fn((name) => {
      return attributes.has(name);
    }),
    getAttribute: vi.fn((name) => {
      return attributes.get(name) || null;
    }),
    classList: {
      add: vi.fn((...classNames) => {
        classNames.forEach(className => classes.add(className));
      }),
      remove: vi.fn((...classNames) => {
        classNames.forEach(className => classes.delete(className));
      }),
      contains: vi.fn((className) => {
        return classes.has(className);
      }),
      toggle: vi.fn((className) => {
        if (classes.has(className)) {
          classes.delete(className);
          return false;
        } else {
          classes.add(className);
          return true;
        }
      })
    }
  };
};

const documentMock = {
  documentElement: createStatefulDOMElement(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
};

global.document = documentMock;

// Export a function to reset the DOM state for tests
global.resetDOMState = () => {
  const documentElement = documentMock.documentElement;
  // Clear the internal state of our stateful mock
  documentElement.classList.add.mockClear();
  documentElement.classList.remove.mockClear();
  documentElement.classList.contains.mockClear();
  documentElement.classList.toggle.mockClear();
  documentElement.setAttribute.mockClear();
  documentElement.removeAttribute.mockClear();
  documentElement.hasAttribute.mockClear();
  documentElement.getAttribute.mockClear();
  
  // Reset the internal state by creating a new element
  const newElement = createStatefulDOMElement();
  Object.assign(documentElement, newElement);
};
