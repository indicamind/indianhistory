import { recoverOriginalImage } from './webp-fallback.directive';

describe('recoverOriginalImage', () => {
  it('uses the original image when the WebP source fails', () => {
    let removed = false;
    const source = { remove: () => { removed = true; } };
    const image = {
      currentSrc: 'https://example.com/assets/cover.webp',
      src: '',
      parentElement: { querySelector: () => source },
      getAttribute: () => 'assets/cover.jpg',
    } as unknown as HTMLImageElement;

    expect(recoverOriginalImage(image)).toBe(true);
    expect(removed).toBe(true);
    expect(image.src).toBe('assets/cover.jpg');
  });

  it('does not retry after the WebP source has been removed', () => {
    let removed = false;
    const image = {
      currentSrc: 'https://example.com/assets/cover.jpg',
      parentElement: { querySelector: () => null },
      getAttribute: () => 'assets/cover.jpg',
    } as unknown as HTMLImageElement;

    expect(recoverOriginalImage(image)).toBe(false);
    expect(removed).toBe(false);
  });
});
