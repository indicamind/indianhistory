const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const CONTENT_IMAGES_DIR = path.resolve(__dirname, '..', 'content', 'media', 'images');
const PUBLIC_IMAGES_DIR = path.resolve(__dirname, '..', 'public', 'assets', 'media', 'images');
const BOOK_COVERS_DIR = path.resolve(__dirname, '..', 'public', 'assets', 'media', 'books');

/**
 * Process article images from content/media/images/ → public/assets/media/images/.
 * - .jpg files: resize to max 1200px wide, output optimized .jpg + .webp
 * - .png files: resize to max 1200px wide, output optimized .png + .webp
 */
async function processArticleImages() {
  if (!fs.existsSync(CONTENT_IMAGES_DIR)) {
    return 0;
  }

  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

  const entries = fs.readdirSync(CONTENT_IMAGES_DIR);
  let count = 0;

  for (const name of entries) {
    const src = path.join(CONTENT_IMAGES_DIR, name);
    if (!fs.statSync(src).isFile()) {
      continue;
    }

    const ext = path.extname(name).toLowerCase();
    const base = path.basename(name, path.extname(name));

    if (ext === '.jpg' || ext === '.jpeg') {
      const resized = sharp(src).resize({ width: 1200, withoutEnlargement: true });

      await resized
        .clone()
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toFile(path.join(PUBLIC_IMAGES_DIR, `${base}.jpg`));

      await resized
        .clone()
        .webp({ quality: 80 })
        .toFile(path.join(PUBLIC_IMAGES_DIR, `${base}.webp`));

      count++;
    } else if (ext === '.png') {
      const resized = sharp(src).resize({ width: 1200, withoutEnlargement: true });

      await resized
        .clone()
        .png()
        .toFile(path.join(PUBLIC_IMAGES_DIR, `${base}.png`));

      await resized
        .clone()
        .webp({ quality: 80 })
        .toFile(path.join(PUBLIC_IMAGES_DIR, `${base}.webp`));

      count++;
    }
  }

  return count;
}

/**
 * Process book cover images in public/assets/media/books/ (recursively).
 * For each .jpg/.png, produce a .webp sibling in the same directory.
 * Does NOT resize or modify the original files.
 */
async function processBookCovers() {
  if (!fs.existsSync(BOOK_COVERS_DIR)) {
    return 0;
  }

  let count = 0;

  async function walkDir(dir) {
    const entries = fs.readdirSync(dir);

    for (const name of entries) {
      const fullPath = path.join(dir, name);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await walkDir(fullPath);
        continue;
      }

      if (!stat.isFile()) {
        continue;
      }

      const ext = path.extname(name).toLowerCase();
      const base = path.basename(name, path.extname(name));

      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        await sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(path.join(dir, `${base}.webp`));

        count++;
      }
    }
  }

  await walkDir(BOOK_COVERS_DIR);
  return count;
}

(async () => {
  const articleCount = await processArticleImages();
  const bookCount = await processBookCovers();
  console.log(`Optimized ${articleCount} article images + ${bookCount} book covers`);
})();
