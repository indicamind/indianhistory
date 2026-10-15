import { Component, computed, inject, signal } from '@angular/core';
import { worldHistoryEvents } from '../../data/world-history';
import { LocaleService } from '../../i18n/locale.service';

@Component({
  selector: 'app-world-history',
  templateUrl: './world-history.component.html',
  styleUrl: './world-history.component.css',
})
export class WorldHistoryComponent {
  readonly locale = inject(LocaleService);
  readonly expanded = signal(false);
  readonly events = worldHistoryEvents.map(event => ({
    date: this.locale.translate(event.date),
    title: this.locale.translate(event.title),
    summary: this.locale.translate(event.summary),
  }));
  readonly initialEventCount = 4;
  readonly visibleEvents = computed(() => this.expanded() ? this.events : this.events.slice(0, this.initialEventCount));
}
