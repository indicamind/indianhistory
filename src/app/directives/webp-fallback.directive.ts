import { Directive, ElementRef, HostListener, inject } from '@angular/core';

export function recoverOriginalImage(image: HTMLImageElement): boolean {
  const webpSource = image.parentElement?.querySelector('source[type="image/webp"]');
  if (!webpSource) return false;

  webpSource.remove();
  const original = image.getAttribute('src');
  if (original) image.src = original;
  return true;
}

/** Recover when a host serves the WebP URL as an error page or missing asset. */
@Directive({ selector: 'img[appWebpFallback]' })
export class WebpFallbackDirective {
  private readonly image = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;

  @HostListener('error')
  onError(): void {
    recoverOriginalImage(this.image);
  }
}
