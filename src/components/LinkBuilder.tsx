import { useState } from 'react';
import { cn } from '@/lib/utils';
import { IconBrandLinkedin, IconBrandX, IconBrandGoogle, IconBriefcase, IconBrandYcombinator, IconX } from '@tabler/icons-react';

const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Common places for tech roles. The input still takes anything; these fill the dropdown and chips.
const CITIES = [
  'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi NCR', 'Gurugram', 'Noida', 'Chennai', 'Kolkata', 'Ahmedabad',
  'Kochi', 'Jaipur', 'Chandigarh', 'Indore', 'Coimbatore', 'Thiruvananthapuram', 'Remote', 'Remote India',
  'San Francisco', 'New York', 'Seattle', 'London', 'Berlin', 'Amsterdam', 'Dubai', 'Singapore', 'Toronto', 'Sydney',
];
const QUICK = ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi NCR', 'Remote India', 'Remote'];

// Names that postings use interchangeably, so a search for one finds the others too.
const ALIASES: Record<string, string[]> = {
  bengaluru: ['Bengaluru', 'Bangalore'],
  bangalore: ['Bengaluru', 'Bangalore'],
  gurugram: ['Gurugram', 'Gurgaon'],
  gurgaon: ['Gurugram', 'Gurgaon'],
  mumbai: ['Mumbai', 'Bombay'],
  'delhi ncr': ['Delhi', 'Gurugram', 'Gurgaon', 'Noida'],
  delhi: ['Delhi', 'New Delhi'],
  thiruvananthapuram: ['Thiruvananthapuram', 'Trivandrum'],
  kochi: ['Kochi', 'Cochin'],
};

/** The place as search terms: aliases ORed together, "remote" kept as a keyword. */
function placeTerms(place: string) {
  const p = place.trim();
  if (!p) return '';
  const alt = ALIASES[p.toLowerCase()];
  return alt ? `(${alt.join(' OR ')})` : p;
}

const isRemote = (place: string) => /remote/i.test(place);

/** LinkedIn wants a real location plus a remote flag (f_WT=2) instead of "remote" as a place. */
function linkedInLocation(place: string) {
  const p = place.trim();
  if (!isRemote(p)) return { location: p === 'Delhi NCR' ? 'Delhi, India' : p, extra: '' };
  return { location: /india/i.test(p) ? 'India' : 'Worldwide', extra: '&f_WT=2' };
}

const google = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}&tbs=qdr:m`;

/** One-tap presets; the active one is highlighted, tapping it again clears the field. */
function Quick({ label, options, value, onPick }: { label: string; options: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${label} presets`}>
      {options.map((o) => {
        const on = o.toLowerCase() === value.trim().toLowerCase();
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(on ? '' : o)}
            className={cn(
              'num rounded-md border px-2 py-0.5 text-[11.5px] transition-colors',
              on ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-fg' : 'border-line text-fg-3 hover:text-fg',
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export default function LinkBuilder() {
  const [role, setRole] = useState('AI engineer');
  const [place, setPlace] = useState('Bengaluru');

  const r = role.trim() || 'software engineer';
  const where = placeTerms(place);
  const li = linkedInLocation(place);
  // Naukri has no reliable remote slug, so remote searches open the role and point to its Work from home filter.
  const naukriPlace = isRemote(place) ? '' : slug(place);
  const ats = (site: string) => google(`${site} "${r}" ${where}`.trim());

  const links = [
    { label: 'Ashby job pages', hint: 'site:jobs.ashbyhq.com', href: ats('site:jobs.ashbyhq.com'), icon: IconBrandGoogle },
    { label: 'Greenhouse job pages', hint: 'site:greenhouse.io', href: ats('(site:boards.greenhouse.io OR site:job-boards.greenhouse.io)'), icon: IconBrandGoogle },
    { label: 'Lever job pages', hint: 'site:jobs.lever.co', href: ats('site:jobs.lever.co'), icon: IconBrandGoogle },
    { label: 'Workable job pages', hint: 'site:apply.workable.com', href: ats('site:apply.workable.com'), icon: IconBrandGoogle },
    {
      label: 'LinkedIn, posted in the last 24h',
      hint: isRemote(place) ? 'remote filter · past 24 hours' : 'jobs search · past 24 hours',
      href: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(r)}&location=${encodeURIComponent(li.location)}&f_TPR=r86400${li.extra}`,
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
      hint: isRemote(place) ? 'then tick “Work from home”' : `${slug(r)}-jobs${naukriPlace ? `-in-${naukriPlace}` : ''}`,
      href: `https://www.naukri.com/${slug(r)}-jobs${naukriPlace ? `-in-${naukriPlace}` : ''}`,
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
          <span className="relative">
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              list="wta-cities"
              placeholder="Pick or type any city"
              autoComplete="off"
              className="h-11 w-full rounded-xl border border-line bg-bg px-3.5 pr-9 text-fg outline-none transition-colors focus:border-line-2"
            />
            {place && (
              <button
                type="button"
                onClick={() => setPlace('')}
                aria-label="Clear city"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-fg-3 hover:text-fg"
              >
                <IconX className="size-4" />
              </button>
            )}
          </span>
          <datalist id="wta-cities">
            {CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
      </div>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <Quick label="Role" options={['AI engineer', 'Forward deployed engineer', 'SDE 2', 'Applied AI engineer', 'Backend engineer']} value={role} onPick={setRole} />
        <Quick label="City" options={QUICK} value={place} onPick={setPlace} />
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
