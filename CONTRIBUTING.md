# Contributing to Where to Apply

Thanks for helping. The goal is a short list of places that are actually worth someone's time, not a long one.
Every addition should save a job seeker effort.

## Ways to help

| You want to                     | Do this                                                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Suggest a source                | [Open an "Add a source" issue](https://github.com/khardikk/where-to-apply/issues/new?template=add-source.yml). No code needed. |
| Report a dead or wrong link     | [Open a "Report a link" issue](https://github.com/khardikk/where-to-apply/issues/new?template=report-link.yml). |
| Add or fix a source yourself    | Edit `src/data/sources.ts` and open a pull request (steps below).                                          |
| Fix a bug or improve the site   | Open an issue first for anything bigger than a small fix, so we agree on the approach.                     |

## What gets in

A source belongs here if all of these are true:

1. **It helps people find or land a tech job** (software, AI engineer, FDE, or close to it) in India or remote.
2. **It's free to use.** Paid tiers are fine if the useful part is free.
3. **It's active.** Posts, roles or events in the last few months.
4. **It's the real, clean link.** No affiliate, referral or tracking links (`?ref=`, `utm_`, and so on).
5. **For people on X:** they're a public figure, founder, builder or educator who posts publicly about their work or
   hiring. For **Hiring on X**, they hire for their own company (founders, team leads, in-house recruiters), not an agency. No private individuals, and no personal contact details beyond the public profile link.

We'll usually say no to: generic content farms, scraped job aggregators with no added value, paid courses dressed up as
job boards, and duplicates of something already listed.

## Adding a source

Each source is one line in `SOURCES` in [`src/data/sources.ts`](src/data/sources.ts). Put it with the others in its
category:

```ts
{ category: 'boards', name: 'Example Jobs', url: 'https://example.com/jobs', tags: ['India', 'Startups'], note: 'One line: why it is worth your time.' },
```

A person or account on X uses the `x()` helper:

```ts
{ category: 'people', name: 'Jane Doe', x: 'janedoe', url: x('janedoe'), tags: ['AI'], note: 'Founder at Example; posts openings for her team.' },
```

| Field      | Rules                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| `category` | One of the ids in `CATEGORIES` at the top of the file                                                     |
| `name`     | The name people know it by                                                                                 |
| `url`      | `https`, the page most useful to a job seeker (the jobs page, not the homepage), no tracking parameters    |
| `tags`     | Any of `India`, `Remote`, `AI`, `Startups`, `FDE`, `Referrals`, `Events`, `Prep`, `Salary`. Only tags that are clearly true |
| `note`     | One line, 90 characters max. Say why it's useful, plainly. No hype words, no emoji, no dashes             |
| `x`        | People and accounts on X only: the handle without `@`                                                     |
| `company`  | "Hiring on X" only: the company they hire for. Link one of their hiring posts in the PR so it can be checked |
| `site`     | Optional. A website whose icon stands in if the logo or avatar can't be fetched                           |
| `added`    | Today's date (`2026-11-02`). New sources get a "New" badge for 21 days                                     |

Writing a good `note`: say what's different about it. "Founders post directly, monthly thread" beats "Great place to
find jobs!". Don't make claims you can't back up (rankings, response rates, "the best").

## Before you open a pull request

```bash
npm install
npm run logos         # fetches the logo or avatar for your new entry
npm run validate      # must pass: checks fields, tags, notes and URLs
npm run check-links   # confirms every link and X account is alive
npm run dev           # look at it: search for your entry, check the card
```

Then commit the change to `sources.ts`, the new file in `public/logos/`, and `src/data/logos.json`.

**Pull request checklist**

- [ ] One topic per pull request (several sources in one PR is fine)
- [ ] `npm run validate` passes
- [ ] I opened each new link myself and it's what the note says
- [ ] No affiliate or tracking links, and nothing I'm paid to promote

If you work at or own something you're adding, say so in the pull request. It can still get in; we just want to know.

## Code changes

- Keep the site fast and static. New client-side JavaScript needs a reason.
- Match the existing style: Tailwind classes, the color tokens in `src/styles/global.css`, small components.
- Check light and dark mode and a phone-width screen before opening the pull request.
- `npm run build` must pass.

## Reviews

Pull requests get a review within about a week. If a source doesn't fit the rules above, we'll say why. Be kind in
issues and reviews; see the [Code of Conduct](CODE_OF_CONDUCT.md).
