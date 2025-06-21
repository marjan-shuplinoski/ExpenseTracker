import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

// Setup for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
globalThis.localStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (i: number) => Object.keys(store)[i] || null,
    get length() { return Object.keys(store).length; },
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: globalThis.localStorage,
  writable: true,
});

// Mock window.confirm
globalThis.confirm = vi.fn(() => true);

// Mock TextEncoder/TextDecoder
globalThis.TextEncoder = TextEncoder;
// @ts-expect-error: Node's TextDecoder is compatible for test environment mocking
globalThis.TextDecoder = TextDecoder;

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
