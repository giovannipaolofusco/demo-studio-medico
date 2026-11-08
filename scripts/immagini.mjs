import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const DIR = 'dist/assets/img';
let file = [];
try { file = (await readdir(DIR)).filter((x) => /\.(jpe?g|png)$/i.test(x)); } catch {}
for (const f of file) {
  await sharp(join(DIR, f)).rotate().webp({ quality: 74 }).toFile(join(DIR, basename(f, extname(f)) + '.webp'));
}
console.log(`immagini: ${file.length} varianti webp generate`);
