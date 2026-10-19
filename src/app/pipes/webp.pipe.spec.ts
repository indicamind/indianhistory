import { WebpPipe } from './webp.pipe';

describe('WebpPipe', () => {
  const pipe = new WebpPipe();

  it('should transform .jpg to .webp', () => {
    expect(pipe.transform('assets/media/books/catalogue/0670086622.jpg')).toBe(
      'assets/media/books/catalogue/0670086622.webp'
    );
  });

  it('should transform .jpeg to .webp', () => {
    expect(pipe.transform('assets/media/images/photo.jpeg')).toBe(
      'assets/media/images/photo.webp'
    );
  });

  it('should transform .png to .webp', () => {
    expect(pipe.transform('assets/media/books/rivers-of-rgveda.png')).toBe(
      'assets/media/books/rivers-of-rgveda.webp'
    );
  });

  it('should handle case-insensitive extensions', () => {
    expect(pipe.transform('assets/media/books/sample.JPG')).toBe(
      'assets/media/books/sample.webp'
    );
  });

  it('should preserve URL without matching extension', () => {
    expect(pipe.transform('assets/media/vector.svg')).toBe(
      'assets/media/vector.svg'
    );
  });
});
