import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:net';

const port = await new Promise((resolve, reject) => {
  const probe = createServer();
  probe.once('error', reject);
  probe.listen(0, '127.0.0.1', () => {
    const { port: selected } = probe.address();
    probe.close((error) => error ? reject(error) : resolve(selected));
  });
});
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'dev', '--host', '127.0.0.1', '--port', String(port)], { stdio: 'ignore' });

async function ready() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Astro dev server did not start');
}

try {
  await ready();
  const md = await fetch(origin, { headers: { Accept: 'text/markdown' } });
  const mdBody = await md.text();
  assert.equal(md.status, 200);
  assert.match(md.headers.get('content-type') ?? '', /^text\/markdown\b/);
  assert.match(md.headers.get('vary') ?? '', /Accept/i);
  assert.match(mdBody, /^# Where to Apply/m);
  assert.ok(mdBody.length > 500);

  const html = await fetch(origin, { headers: { Accept: 'text/html' } });
  const htmlBody = await html.text();
  assert.equal(html.status, 200);
  assert.match(html.headers.get('content-type') ?? '', /^text\/html\b/);
  assert.match(html.headers.get('vary') ?? '', /Accept/i);
  assert.match(htmlBody, /<h1[^>]*>Where to apply\./);
  assert.match(htmlBody, /"description":"Software engineer and maker of Where to Apply/);
  const visibleText = htmlBody.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.ok(visibleText.length >= 500, 'homepage should include at least 500 characters of meaningful text');

  const notFound = await fetch(`${origin}/__agent-readiness-missing` , { headers: { Accept: 'text/markdown' } });
  const notFoundBody = await notFound.text();
  assert.equal(notFound.status, 404);
  assert.match(notFound.headers.get('content-type') ?? '', /^text\/markdown\b/);
  assert.match(notFound.headers.get('vary') ?? '', /Accept/i);
  assert.ok(notFoundBody.length > 20);
  assert.match(notFoundBody, /sitemap|homepage/i);

  for (const path of ['/about', '/contact', '/privacy', '/guide', '/llms.txt', '/robots.txt']) {
    const response = await fetch(`${origin}${path}`);
    const body = await response.text();
    assert.equal(response.status, 200, `${path} should return 200`);
    if (['/about', '/contact', '/privacy', '/guide'].includes(path)) assert.ok(body.replace(/<[^>]+>/g, ' ').length > 500, `${path} should have substantive content`);
    if (path === '/llms.txt') assert.ok(body.length > 500, 'llms.txt should have substantive content');
    if (path === '/robots.txt') assert.match(body, /Sitemap:/);
  }
  const sitemap = readFileSync('dist/client/sitemap-index.xml', 'utf8');
  assert.match(sitemap, /<sitemapindex/);
  console.log('Agent readiness endpoints verified.');
} finally {
  server.kill('SIGTERM');
}
