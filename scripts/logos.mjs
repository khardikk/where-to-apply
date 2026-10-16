// Downloads a small logo for every source into public/logos/ (site favicons via Google's favicon
// service, X avatars via unavatar.io) and writes src/data/logos.json listing the ones that exist.
// Self-hosting them means visitors' browsers never call third-party image services.
// Run with: npm run logos. Existing files are kept if a download fails.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { SOURCES, sourceId } from '../src/data/sources.ts';

const DIR = 'public/logos';
mkdirSync(DIR, { recursive: true });

const favicon = (host) => `https://www.google.com/s2/favicons?domain=${host}&sz=64`;

// Try the best source first, then fall back: X avatar, then the org's site icon;
// a subdomain's icon, then the parent domain's (jobs.accel.com -> accel.com).
function candidates(s) {
  if (s.x) return [`https://unavatar.io/x/${s.x}?fallback=false`, ...(s.site ? [favicon(s.site)] : [])];
  const host = new URL(s.url).hostname;
  const parent = host.split('.').slice(-2).join('.');
  return [favicon(host), ...(parent !== host ? [favicon(parent)] : []), ...(s.site ? [favicon(s.site)] : [])];
}

let fetched = 0;
const queue = [...SOURCES];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let s = queue.shift(); s; s = queue.shift()) {
      const file = `${DIR}/${sourceId(s)}.png`;
      if (existsSync(file) && !process.argv.includes('--refresh')) continue;
      for (const url of candidates(s)) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
          const type = res.headers.get('content-type') ?? '';
          if (!res.ok || !type.startsWith('image/')) continue;
          writeFileSync(file, Buffer.from(await res.arrayBuffer()));
          fetched++;
          break;
        } catch {}
      }
    }
  }),
);

const have = readdirSync(DIR).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)).sort();
writeFileSync('src/data/logos.json', JSON.stringify(have, null, 0) + '\n');
console.log(`logos: ${fetched} downloaded, ${have.length}/${SOURCES.length} available`);
