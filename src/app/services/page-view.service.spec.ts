import { DOCUMENT } from '@angular/common';
import { Injector, runInInjectionContext } from '@angular/core';
import { DevModeService } from './dev-mode.service';
import { PageViewService, VIEW_COUNTER_LOADER } from './page-view.service';

describe('PageViewService session counting', () => {
  let storage: Map<string, string>;
  let mockDocument: any;
  let devMode: boolean;
  let calls: string[];
  let loadCalls: number;
  let failRequest: boolean;

  const settle = () => new Promise(resolve => setTimeout(resolve, 0));

  function createService(): PageViewService {
    const injector = Injector.create({ providers: [
      { provide: DOCUMENT, useValue: mockDocument },
      { provide: DevModeService, useValue: { isDevMode: () => devMode } },
      { provide: VIEW_COUNTER_LOADER, useValue: async () => {
        loadCalls++;
        return async (slug: string) => {
          calls.push(slug);
          if (failRequest) throw new Error('Counter unavailable');
        };
      } },
    ] });
    return runInInjectionContext(injector, () => new PageViewService());
  }

  beforeEach(() => {
    storage = new Map();
    devMode = false;
    calls = [];
    loadCalls = 0;
    failRequest = false;
    mockDocument = {
      location: { href: 'https://www.indiahistory.info/article/ashoka-edicts' },
      defaultView: { sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      } },
    };
  });

  it('counts once across duplicate calls and page refreshes', async () => {
    const service = createService();
    service.record('ashoka-edicts');
    service.record('ashoka-edicts');
    await settle();
    service.record('ashoka-edicts');
    // A full reload creates a fresh service but retains sessionStorage.
    createService().record('ashoka-edicts');
    await settle();
    expect(calls).toEqual(['ashoka-edicts']);
    expect(loadCalls).toBe(1);
  });

  it('counts different slugs but skips returning to an already viewed slug', async () => {
    const service = createService();
    service.record('ashoka-edicts');
    service.record('ashoka-major-pillar-edict-7');
    await settle();
    service.record('ashoka-edicts');
    await settle();
    expect(calls).toEqual(['ashoka-edicts', 'ashoka-major-pillar-edict-7']);
  });

  it('counts again in a fresh tab session', async () => {
    createService().record('ashoka-edicts');
    await settle();
    storage.clear();
    createService().record('ashoka-edicts');
    await settle();
    expect(calls).toEqual(['ashoka-edicts', 'ashoka-edicts']);
  });

  it('does not mark a failed call as counted and allows retry', async () => {
    const originalWarn = console.warn;
    console.warn = () => {};
    try {
      failRequest = true;
      const service = createService();
      service.record('ashoka-edicts');
      await settle();
      expect(storage.size).toBe(0);
      failRequest = false;
      service.record('ashoka-edicts');
      await settle();
      createService().record('ashoka-edicts');
      await settle();
      expect(calls).toEqual(['ashoka-edicts', 'ashoka-edicts']);
    } finally {
      console.warn = originalWarn;
    }
  });

  it('skips localhost and dev mode without loading Firebase', async () => {
    mockDocument.location.href = 'http://localhost:4200/article/ashoka-edicts';
    createService().record('ashoka-edicts');
    mockDocument.location.href = 'https://www.indiahistory.info/article/ashoka-edicts';
    devMode = true;
    createService().record('ashoka-edicts');
    await settle();
    expect(calls).toEqual([]);
    expect(loadCalls).toBe(0);
    expect(storage.size).toBe(0);
  });

  it('handles restricted storage without breaking reading or duplicate guards', async () => {
    Object.defineProperty(mockDocument.defaultView, 'sessionStorage', {
      get: () => { throw new Error('Storage blocked'); },
    });
    const service = createService();
    service.record('ashoka-edicts');
    await settle();
    service.record('ashoka-edicts');
    await settle();
    expect(calls).toEqual(['ashoka-edicts']);
  });
});
