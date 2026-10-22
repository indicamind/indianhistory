import { Component, Input, inject } from '@angular/core';
import { WebpPipe } from '../../pipes/webp.pipe';
import { WebpFallbackDirective } from '../../directives/webp-fallback.directive';
import { RecommendedBook } from '../../models/book.model';
import { LocaleService } from '../../i18n/locale.service';
import { DevModeService } from '../../services/dev-mode.service';

@Component({
  selector: 'app-associated-books',
  imports: [WebpPipe, WebpFallbackDirective],
  templateUrl: './associated-books.component.html',
  styleUrl: './associated-books.component.css',
})
export class AssociatedBooksComponent {
  readonly locale = inject(LocaleService);
  readonly devMode = inject(DevModeService);
  @Input() books: RecommendedBook[] = [];
}
