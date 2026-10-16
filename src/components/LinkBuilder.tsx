import { useState } from 'react';
import { IconBrandLinkedin, IconBrandX, IconBrandGoogle, IconBriefcase, IconBrandYcombinator } from '@tabler/icons-react';

const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** "Bengaluru" also matches "Bangalore"; "remote" stays as is. */
function placeTerms(place: string) {
  const p = place.trim();
  if (!p) return '';
  const alt: Record<string, string> = { bengaluru: 'Bangalore', bangalore: 'Bengaluru', gurugram: 'Gurgaon', gurgaon: 'Gurugram' };
  const other = alt[p.toLowerCase()];
  return other ? `(${p} OR ${other})` : p;
}

const google = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}&tbs=qdr:m`;

export default function LinkBuilder() {
  const [role, setRole] = useState('AI engineer');
  const [place, setPlace] = useState('Bengaluru');

  const r = role.trim() || 'software engineer';
  const where = placeTerms(place);
  const ats = (site: string) => google(`${site} "${r}" ${where}`.trim());

  const links = [
    { label: 'Ashby job pages', hint: 'site:jobs.ashbyhq.com', href: ats('site:jobs.ashbyhq.com'), icon: IconBrandGoogle },
    { label: 'Greenhouse job pages', hint: 'site:greenhouse.io', href: ats('(site:boards.greenhouse.io OR site:job-boards.greenhouse.io)'), icon: IconBrandGoogle },
    { label: 'Lever job pages', hint: 'site:jobs.lever.co', href: ats('site:jobs.lever.co'), icon: IconBrandGoogle },
    { label: 'Workable job pages', hint: 'site:apply.workable.com', href: ats('site:apply.workable.com'), icon: IconBrandGoogle },
    {
      label: 'LinkedIn, posted in the last 24h',
      hint: 'jobs search · past 24 hours',
      href: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(r)}&location=${encodeURIComponent(place.trim())}&f_TPR=r86400`,
      icon: IconBrandLinkedin,
    },
    {
      label: 'LinkedIn "hiring" posts',
      hint: 'posts by people, newest first',
      href: `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(`hiring "${r}" ${place.trim()}`)}&sortBy=%22date_posted%22`,
      icon: IconBrandLinkedin,
    },
    {
      label: 'X "hiring" posts, live',
      hint: 'latest posts',
      href: `https://x.com/search?q=${encodeURIComponent(`(hiring OR "we're hiring") "${r}" ${where}`.trim())}&f=live`,
      icon: IconBrandX,
    },
    {
      label: 'Naukri',
      hint: `${slug(r)}-jobs${place.trim() ? `-in-${slug(place)}` : ''}`,
      href: `https://www.naukri.com/${slug(r)}-jobs${place.trim() ? `-in-${slug(place)}` : ''}`,
      icon: IconBriefcase,
    },
    { label: "HN Who is hiring", hint: 'this month’s thread', href: `https://hnhiring.com/search?q=${encodeURIComponent(r)}`, icon: IconBrandYcombinator },
  ];

  return (
    <div className="rounded-2xl border border-line bg-card p-5 md:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="label">Role</span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="AI engineer"
            className="h-11 rounded-xl border border-line bg-bg px-3.5 text-fg outline-none transition-colors focus:border-line-2"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="label">City, or "remote"</span>
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Bengaluru"
            className="h-11 rounded-xl border border-line bg-bg px-3.5 text-fg outline-none transition-colors focus:border-line-2"
          />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {['AI engineer', 'Forward deployed engineer', 'SDE 2', 'Applied AI engineer', 'Backend engineer'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRole(s)}
            className="num rounded-md border border-line px-2 py-0.5 text-[11.5px] text-fg-3 transition-colors hover:text-fg"
          >
            {s}
          </button>
        ))}
      </div>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(({ label, hint, href, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center gap-3 rounded-xl border border-line bg-bg px-3.5 py-3 transition-colors hover:border-line-2 hover:bg-hover"
            >
              <Icon className="size-[18px] shrink-0 text-fg-3 transition-colors group-hover:text-fg" stroke={1.6} />
              <span className="min-w-0">
                <span className="block text-sm text-fg">{label}</span>
                <span className="num block truncate text-[11px] text-fg-3">{hint}</span>
              </span>
              <span className="ml-auto text-fg-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-fg-3">
        Google links are limited to the past month. Many startups post on these job-page hosts before, or instead of, LinkedIn.
      </p>
    </div>
  );
}
