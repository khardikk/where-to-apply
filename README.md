# Where to Apply

**Every place worth checking for a software, AI engineer or forward deployed engineer (FDE) job in India or remote.**

[apply.hardikk.dev](https://apply.hardikk.dev)

![Where to Apply](https://apply.hardikk.dev/og/index.png)

Job hunting means checking dozens of boards, funds, communities and people, and most of them never show up in a search.
This is one hand-checked list of them, plus the search tricks that find roles before they reach LinkedIn.

- **141 sources in 11 categories:** Indian job boards, startup boards, VC portfolio job boards, AI and FDE roles,
  companies hiring in India, remote platforms, people and accounts on X, communities, and prep tools.
- **Link builder:** pick or type a role and a city (or remote), get ready-made searches on Ashby, Greenhouse, Lever,
  Workable, LinkedIn, X, Naukri and Hacker News.
- **Search, filters and a checklist:** filter by category and tag with live counts, tick off what you've covered, and
  see it all in a dated "My checked" list you can copy. Everything stays in your browser; filters live in the URL, so a
  view can be shared.
- **Tips and templates:** what gets replies, plus a cold DM and a referral ask you can copy.
- **A page per category and city:** `/c/vc`, `/in/bengaluru` and so on, with filters and searches preset.
- **Every link is checked:** a script opens every URL and verifies every X account, and runs weekly in CI.

No sign-up, no affiliate links. Anonymous page analytics (Vercel Web Analytics and PostHog) only.

## Contributing

The list gets better when people who are job hunting add what worked for them.

- **Know a source that should be here?** [Suggest it](https://github.com/khardikk/where-to-apply/issues/new?template=add-source.yml)
  in an issue. No code needed.
- **Found a dead or wrong link?** [Report it](https://github.com/khardikk/where-to-apply/issues/new?template=report-link.yml).
- **Want to add it yourself?** It's one line in `src/data/sources.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the
  rules and the checks to run.

## Run it locally

Requires Node 22.22 or newer.

```bash
git clone https://github.com/khardikk/where-to-apply.git
cd where-to-apply
npm install
npm run dev          # http://localhost:4321
```

| Command               | What it does                                                     |
| --------------------- | ---------------------------------------------------------------- |
| `npm run dev`         | Local dev server                                                 |
| `npm run build`       | Production build into `dist/`                                    |
| `npm run validate`    | Checks the data against the contribution rules (fast, offline)   |
| `npm run check-links` | Opens every URL and checks every X account (slow, needs network) |
| `npm run logos`       | Downloads missing logos and X avatars into `public/logos/`       |

## How it's built

[Astro](https://astro.build) for a static site, React islands for the interactive parts, Tailwind CSS. Deployed on
Vercel.

```
src/data/sources.ts             every source, category, tip and template: the file most PRs touch
src/components/Directory.tsx    search, filters and the checklist
src/components/LinkBuilder.tsx  the role + city search builder
src/components/Tour.tsx         the first-visit walkthrough
src/components/Page.astro       the page, shared by /, /c/<category> and /in/<city>
src/data/cities.ts              the city pages
scripts/validate.mjs            data rules, run on every pull request
scripts/check-links.mjs         network check, run every Monday
scripts/logos.mjs               self-hosts logos so visitors never call third-party image services
```

**How links are checked.** `check-links` opens every URL (a bot wall like Cloudflare's counts as alive) and checks each
X account against X's public embed endpoint, which returns 404 for accounts that don't exist. That proves an account
exists, not who owns it, so new people on X are also checked by hand in review. Update `CHECKED_ON` in
`src/data/sources.ts` after a full re-check.

## License

[MIT](LICENSE). Built by [Hardikk Kamboj](https://hardikk.dev) ([@HdKamboj](https://x.com/HdKamboj)).
