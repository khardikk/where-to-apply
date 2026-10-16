// Rasterizes public/favicon.svg into favicon.ico (32px PNG inside an ICO) and apple-touch-icon.png.
import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const svg = readFileSync('public/favicon.svg', 'utf8');
const png = (size, src = svg) => new Resvg(src, { fitTo: { mode: 'width', value: size } }).render().asPng();

const p32 = png(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(p32.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([header, p32]));
writeFileSync('public/apple-touch-icon.png', png(180, svg.replace('rx="14"', 'rx="0"')));
console.log('icons written');
