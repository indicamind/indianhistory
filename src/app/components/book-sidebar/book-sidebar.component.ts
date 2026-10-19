import { Component, Input, inject } from '@angular/core';
import { WebpPipe } from '../../pipes/webp.pipe';
import { RecommendedBook } from '../../models/book.model';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';

@Component({
  selector: 'app-book-sidebar',
  imports: [WebpPipe],
  templateUrl: './book-sidebar.component.html',
  styleUrl: './book-sidebar.component.css',
})
export class BookSidebarComponent {
  readonly locale = inject(LocaleService);
  readonly devMode = inject(DevModeService);
  @Input() book: RecommendedBook | null = null;
}
