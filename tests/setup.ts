import { vi } from 'vitest';
// Global stubs for browser APIs not available in jsdom

// IntersectionObserver stub — must be a class (constructable)
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
