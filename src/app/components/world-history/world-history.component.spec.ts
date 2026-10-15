import { Injector, runInInjectionContext } from '@angular/core';
import { WorldHistoryComponent } from './world-history.component';
import { LocaleService } from '../../i18n/locale.service';

describe('WorldHistoryComponent', () => {
  let component: WorldHistoryComponent;

  beforeEach(() => {
    const mockLocale = {
      translate: (s: string) => `[TR] ${s}`,
    };

    const injector = Injector.create({
      providers: [
        { provide: LocaleService, useValue: mockLocale },
      ],
    });

    component = runInInjectionContext(injector, () => new WorldHistoryComponent());
  });

  it('should initialize and translate milestones', () => {
    expect(component.events.length).toBeGreaterThan(0);
    expect(component.events[0].title.startsWith('[TR] ')).toBeTruthy();
  });

  it('shows four events initially and all events when expanded', () => {
    expect(component.visibleEvents().length).toBe(4);
    component.expanded.set(true);
    expect(component.visibleEvents().length).toBe(component.events.length);
    component.expanded.set(false);
    expect(component.visibleEvents().length).toBe(4);
  });
});
