// Re-checks every link in src/data/sources.ts. Websites must answer (a bot wall like Cloudflare's
// "Just a moment" counts as alive); X accounts are checked through X's public embed endpoint,
// which returns 404 for accounts that don't exist. Exits 1 if anything is dead.
import { SOURCES } from '../src/data/sources.ts';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const BOT_WALL = [403, 406, 419, 429, 503]; // 419: Hacker News rate limit

async function check(s) {
  try {
    if (s.x) {
      const r = await fetch(`https://publish.twitter.com/oembed?url=https://x.com/${s.x}`, { signal: AbortSignal.timeout(20000) });
      return r.ok ? null : `X @${s.x}: ${r.status}`;
    }
    const r = await fetch(s.url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
    if (r.ok || BOT_WALL.includes(r.status)) return null;
    return `${s.url}: ${r.status}`;
  } catch (err) {
    return `${s.url}: ${err.name === 'TimeoutError' ? 'timeout' : err.message}`;
  }
}

const failures = [];
const queue = [...SOURCES];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    for (let s = queue.shift(); s; s = queue.shift()) {
      const problem = await check(s);
      if (problem) failures.push(`${s.name}: ${problem}`);
    }
  }),
);

console.log(`${SOURCES.length - failures.length}/${SOURCES.length} links OK`);
for (const f of failures) console.log(`  ✗ ${f}`);
process.exit(failures.length ? 1 : 0);
