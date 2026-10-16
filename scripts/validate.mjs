// Checks src/data/sources.ts against the contribution rules in CONTRIBUTING.md.
// Fast and offline, so it runs on every pull request. `npm run check-links` does the slow network check.
import { readFileSync } from 'node:fs';
import { CATEGORIES, SOURCES, sourceId } from '../src/data/sources.ts';

const TAGS = ['India', 'Remote', 'AI', 'Startups', 'FDE', 'Referrals', 'Events', 'Prep', 'Salary'];
const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));
const X_CATEGORIES = new Set(['hiring', 'people', 'orgs']);
const TRACKING = /[?&](utm_[a-z]+|ref|referral|aff|affiliate|fbclid|gclid)=/i;
const logos = new Set(JSON.parse(readFileSync('src/data/logos.json', 'utf8')));

const errors = [];
const warnings = [];
const seenIds = new Map();
const seenUrls = new Map();

for (const [i, s] of SOURCES.entries()) {
  const where = `#${i + 1} "${s.name ?? '?'}"`;
  const err = (m) => errors.push(`${where}: ${m}`);

  if (!s.name?.trim()) err('name is required');
  if (!CATEGORY_IDS.has(s.category)) err(`unknown category "${s.category}"`);
  if (!s.note?.trim()) err('note is required');
  else {
    if (s.note.length > 90) err(`note is ${s.note.length} characters; keep it to one line (90 max)`);
    if (/[—–]/.test(s.note)) err('note uses a dash (— or –); rephrase with a colon, comma or full stop');
  }

  for (const t of s.tags ?? []) if (!TAGS.includes(t)) err(`unknown tag "${t}" (allowed: ${TAGS.join(', ')})`);
  if (new Set(s.tags).size !== (s.tags ?? []).length) err('duplicate tag');

  let url;
  try {
    url = new URL(s.url);
  } catch {
    err(`url "${s.url}" is not a valid URL`);
  }
  if (url) {
    if (url.protocol !== 'https:') err('url must use https');
    if (TRACKING.test(url.search)) err('url has a tracking or referral parameter; link to the clean page');
  }

  if (X_CATEGORIES.has(s.category)) {
    if (!s.x) err('people and accounts on X need an `x` handle');
    else if (!/^[A-Za-z0-9_]{1,15}$/.test(s.x)) err(`x handle "${s.x}" is not a valid X username`);
    else if (s.url !== `https://x.com/${s.x}`) err('url should be x(handle)');
  }

  if (s.added !== undefined && (!/^\d{4}-\d{2}-\d{2}$/.test(s.added) || Number.isNaN(Date.parse(s.added))))
    err(`added "${s.added}" must be a date like 2026-11-02`);

  if (s.category === 'hiring' && !s.company?.trim()) err('people in "Hiring on X" need a `company`');

  const id = sourceId(s);
  if (seenIds.has(id)) err(`same category and name as #${seenIds.get(id)}`);
  seenIds.set(id, i + 1);

  const key = `${s.category}|${s.url.replace(/\/$/, '').toLowerCase()}`;
  if (seenUrls.has(key)) err(`same url as #${seenUrls.get(key)} in this category`);
  seenUrls.set(key, i + 1);

  if (!logos.has(id)) warnings.push(`${where}: no logo yet (run \`npm run logos\`)`);
}

for (const w of warnings) console.warn(`  ! ${w}`);
for (const e of errors) console.error(`  ✗ ${e}`);
console.log(errors.length ? `\n${errors.length} problem(s) in ${SOURCES.length} sources.` : `${SOURCES.length} sources look good.`);
process.exit(errors.length ? 1 : 0);
