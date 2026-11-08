import sharp from 'sharp';
import { writeFileSync, readFileSync } from 'node:fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#5f2852"/>
<g transform="translate(14 14) scale(1.5)" fill="none" stroke="#fdfdfe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>
</g>
</svg>
`;
writeFileSync('assets/favicon/icon.svg', svg);
const misure = { 'favicon-16x16.png': 16, 'favicon-32x32.png': 32, 'apple-touch-icon.png': 180, 'android-chrome-192x192.png': 192, 'android-chrome-512x512.png': 512 };
for (const [nome, lato] of Object.entries(misure)) {
  await sharp(Buffer.from(svg), { density: 72 * lato / 64 * 4 }).resize(lato, lato).png().toFile(`assets/favicon/${nome}`);
}

const png = readFileSync('assets/favicon/favicon-32x32.png');
const testa = Buffer.alloc(22);
testa.writeUInt16LE(0, 0); testa.writeUInt16LE(1, 2); testa.writeUInt16LE(1, 4);
testa.writeUInt8(32, 6); testa.writeUInt8(32, 7); testa.writeUInt8(0, 8); testa.writeUInt8(0, 9);
testa.writeUInt16LE(1, 10); testa.writeUInt16LE(32, 12);
testa.writeUInt32LE(png.length, 14); testa.writeUInt32LE(22, 18);
writeFileSync('favicon.ico', Buffer.concat([testa, png]));
console.log('favicon: icon.svg, 5 png, favicon.ico');
