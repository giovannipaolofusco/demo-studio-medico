import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { minify } from 'html-minifier-terser';

const ESCLUSE = ['admin'];
const OPZIONI = { collapseWhitespace: true, removeRedundantAttributes: true, minifyCSS: true, minifyJS: true };

async function* html(dir, radice = dir) {
  for (const v of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, v.name);
    if (v.isDirectory()) {
      if (ESCLUSE.includes(relative(radice, p).split('/')[0])) continue;
      yield* html(p, radice);
    } else if (v.name.endsWith('.html')) {
      yield p;
    }
  }
}

let n = 0;
for await (const f of html('dist')) {
  await writeFile(f, await minify(await readFile(f, 'utf8'), OPZIONI));
  n++;
}
console.log(`html: ${n} pagine minificate (escluse: ${ESCLUSE.join(', ')})`);
