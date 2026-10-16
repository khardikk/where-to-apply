# Where to Apply

Every place worth checking for a software, AI engineer or FDE role in India or remote: job boards, VC portfolio
boards, AI and FDE roles, companies, people and accounts on X, communities, tools, tips and message templates.

Live at https://apply.hardikk.dev. Astro + React islands + Tailwind, static, deployed on Vercel.

## Add or edit a source

Everything lives in `src/data/sources.ts`. Add one line to `SOURCES`:

```ts
{ category: 'boards', name: 'Example', url: 'https://example.com', tags: ['India'], note: 'One line: why it is worth your time.' },
```

For a person or account on X, add `x: 'handle'` and use `url: x('handle')`. Then:

```bash
npm run logos         # fetch its logo or X avatar into public/logos
npm run check-links   # confirm every link and X account is alive
git add -A && git commit -m "Add Example" && git push
```

Update `CHECKED_ON` in the same file when you re-check everything.

## Checks

- `npm run check-links` opens every URL (bot walls like Cloudflare count as alive) and checks each X account
  against X's public embed endpoint, which 404s for accounts that don't exist.
- `.github/workflows/check-links.yml` runs it every Monday. A failed run means a link died; GitHub emails you.

## Develop

```bash
npm install
npm run dev     # http://localhost:4321
npm run build
```
