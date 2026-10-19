import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'webp' })
export class WebpPipe implements PipeTransform {
  transform(url: string): string {
    return url.replace(/\.(jpe?g|png)$/i, '.webp');
  }
}
