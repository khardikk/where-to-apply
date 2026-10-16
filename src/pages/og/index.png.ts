// Share image for X and LinkedIn (1200×630), rendered at build time.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SOURCES } from '../../data/sources';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFileSync(require.resolve(`${pkg}/files/${file}`));

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string | null)[]): Node => {
  const kids = children.filter(Boolean);
  return { type, props: { style, children: kids.length === 1 ? kids[0] : kids } };
};

export const GET: APIRoute = async ({ site }) => {
  const C = { bg: '#0a0a0a', fg: '#ededed', fg2: '#a3a3a3', fg3: '#878787', line: '#2a2a2a', grid: '#161616', accent: '#3ccf7a' };
  const avatar = `data:image/jpeg;base64,${readFileSync('src/assets/avatar.jpg').toString('base64')}`;
  const chips = ['Job boards', 'VC portfolio boards', 'AI + FDE roles', 'People on X', 'Communities', 'Search tricks'];

  const tree = h(
    'div',
    {
      width: 1200, height: 630, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '64px 80px', backgroundColor: C.bg, fontFamily: 'Geist', color: C.fg,
      backgroundImage: `linear-gradient(to right, ${C.grid} 1px, transparent 1px), linear-gradient(to bottom, ${C.grid} 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
    },
    h(
      'div',
      { display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.fg3 },
      { type: 'img', props: { src: avatar, width: 44, height: 44, style: { borderRadius: 22 } } },
      'by Hardikk Kamboj · @HdKamboj',
    ),
    h(
      'div',
      { display: 'flex', flexDirection: 'column', gap: 18 },
      h('div', { fontSize: 104, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }, 'Where to apply.'),
      h('div', { fontSize: 31, color: C.fg2, lineHeight: 1.3, maxWidth: 1040 }, `${SOURCES.length} hand-checked places to find tech and AI jobs in India and remote.`),
    ),
    h(
      'div',
      { display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 28, borderTop: `1px solid ${C.line}` },
      ...chips.map((c) =>
        h('div', { display: 'flex', padding: '8px 16px', borderRadius: 999, border: `1px solid ${C.line}`, fontFamily: 'Geist Mono', fontSize: 21, color: C.fg2 }, c),
      ),
      h('div', { display: 'flex', marginLeft: 'auto', alignItems: 'center', fontFamily: 'Geist Mono', fontSize: 21, color: C.accent }, site!.host),
    ),
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Geist', weight: 400, style: 'normal', data: font('@fontsource/geist', 'geist-latin-400-normal.woff') },
      { name: 'Geist', weight: 600, style: 'normal', data: font('@fontsource/geist', 'geist-latin-600-normal.woff') },
      { name: 'Geist Mono', weight: 400, style: 'normal', data: font('@fontsource/geist-mono', 'geist-mono-latin-400-normal.woff') },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
