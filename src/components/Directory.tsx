import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { IconCheck, IconSearch, IconX } from '@tabler/icons-react';
import type { CategoryId, Source, Tag } from '../data/sources';
import { cn } from '@/lib/utils';

type Category = { id: CategoryId; title: string; blurb: string };
type Item = Source & { id: string; hasLogo: boolean };

const TAGS: Tag[] = ['India', 'Remote', 'AI', 'Startups', 'FDE', 'Referrals', 'Events', 'Prep', 'Salary'];
const DONE_KEY = 'wta:done';

const host = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/** Card spotlight: a soft radial glow that follows the pointer (Aceternity "Card Spotlight", CSS only). */
const track = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
};

export default function Directory({ items, categories }: { items: Item[]; categories: Category[] }) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const [tags, setTags] = useState<Tag[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [hideDone, setHideDone] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // Restore the checklist and any filters in the URL (?q=&cat=&tags=), so filtered views can be shared.
  useEffect(() => {
    try {
      setDone(new Set(JSON.parse(localStorage.getItem(DONE_KEY) ?? '[]')));
    } catch {}
    const p = new URLSearchParams(location.search);
    if (p.get('q')) setQuery(p.get('q')!);
    const c = p.get('cat') as CategoryId | null;
    if (c && categories.some((x) => x.id === c)) setCat(c);
    const t = (p.get('tags') ?? '').split(',').filter((x): x is Tag => TAGS.includes(x as Tag));
    if (t.length) setTags(t);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (cat !== 'all') p.set('cat', cat);
    if (tags.length) p.set('tags', tags.join(','));
    const qs = p.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  }, [query, cat, tags]);

  // "/" jumps to search, Escape clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = ['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        input.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === input.current) {
        setQuery('');
        input.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleDone = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });

  const toggleTag = (t: Tag) => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: items.length };
    for (const s of items) m[s.category] = (m[s.category] ?? 0) + 1;
    return m;
  }, [items]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter(
      (s) =>
        (cat === 'all' || s.category === cat) &&
        tags.every((t) => s.tags.includes(t)) &&
        (!hideDone || !done.has(s.id)) &&
        (!needle || `${s.name} ${s.note} ${s.x ?? ''} ${host(s.url)} ${s.tags.join(' ')}`.toLowerCase().includes(needle)),
    );
  }, [items, query, cat, tags, hideDone, done]);

  const groups = categories.map((c) => ({ ...c, items: filtered.filter((s) => s.category === c.id) })).filter((g) => g.items.length);
  const filtering = query || cat !== 'all' || tags.length > 0 || hideDone;
  const doneCount = items.filter((s) => done.has(s.id)).length;

  const clear = () => {
    setQuery('');
    setCat('all');
    setTags([]);
    setHideDone(false);
  };

  return (
    <div>
      <div className="sticky top-0 z-30 -mx-5 border-b border-line bg-bg/85 px-5 pt-4 pb-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <label className="relative flex h-11 flex-1 items-center rounded-xl border border-line bg-card px-3.5 transition-colors focus-within:border-line-2">
            <IconSearch className="size-4 shrink-0 text-fg-3" stroke={1.8} />
            <span className="sr-only">Search sources</span>
            <input
              ref={input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${items.length} sources: remote, FDE, referrals, Bengaluru…`}
              className="h-full w-full bg-transparent px-2.5 text-[15px] text-fg outline-none placeholder:text-fg-3"
            />
            {query ? (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-fg-3 hover:text-fg">
                <IconX className="size-4" />
              </button>
            ) : (
              <kbd className="num hidden rounded border border-line px-1.5 text-[11px] text-fg-3 sm:block">/</kbd>
            )}
          </label>
          <div className="num hidden text-right text-xs leading-tight text-fg-3 sm:block">
            <span className="text-fg">{doneCount}</span> / {items.length}
            <br />
            checked off
          </div>
        </div>

        <div className="mt-3 -mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {[{ id: 'all' as const, title: 'All' }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              aria-pressed={cat === c.id}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1 text-[13px] whitespace-nowrap transition-colors',
                cat === c.id ? 'border-fg bg-fg text-bg' : 'border-line text-fg-2 hover:border-line-2 hover:text-fg',
              )}
            >
              {c.title.replace(/ on X$/, '')} <span className="num opacity-60">{counts[c.id] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="mt-2 -mx-5 flex items-center gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              aria-pressed={tags.includes(t)}
              className={cn(
                'num shrink-0 rounded-md border px-2 py-0.5 text-[11.5px] transition-colors',
                tags.includes(t)
                  ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-fg'
                  : 'border-line text-fg-3 hover:text-fg',
              )}
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setHideDone((v) => !v)}
            aria-pressed={hideDone}
            className={cn(
              'num ml-auto shrink-0 rounded-md border px-2 py-0.5 text-[11.5px] whitespace-nowrap transition-colors',
              hideDone ? 'border-fg text-fg' : 'border-line text-fg-3 hover:text-fg',
            )}
          >
            Hide checked
          </button>
          {filtering && (
            <button type="button" onClick={clear} className="num shrink-0 text-[11.5px] text-fg-3 underline underline-offset-2 hover:text-fg">
              Reset
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-fg">Nothing matches that.</p>
          <button type="button" onClick={clear} className="mt-3 text-sm text-fg-3 underline underline-offset-4 hover:text-fg">
            Clear filters
          </button>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-40 pt-12" aria-labelledby={`${g.id}-h`}>
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id={`${g.id}-h`} className="text-lg font-semibold tracking-tight">
                {g.title}
              </h2>
              <span className="num text-xs text-fg-3">{g.items.length}</span>
              <p className="w-full text-sm text-fg-3 sm:w-auto">{g.blurb}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((s) => {
                const isDone = done.has(s.id);
                return (
                  <li
                    key={s.id}
                    onPointerMove={track}
                    className={cn(
                      'card group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-line bg-card p-4 transition-[border-color,opacity] duration-200 hover:border-line-2',
                      isDone && 'opacity-55',
                    )}
                  >
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10 rounded-xl"
                      aria-label={`${s.name}: ${s.note} (opens in a new tab)`}
                    />
                    <div className="flex items-center gap-3">
                      {s.hasLogo ? (
                        <img
                          src={`/logos/${s.id}.png`}
                          alt=""
                          width={32}
                          height={32}
                          loading="lazy"
                          decoding="async"
                          className={cn('size-8 shrink-0 border border-line bg-white object-cover', s.x ? 'rounded-full' : 'rounded-lg p-1')}
                        />
                      ) : (
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line text-xs font-semibold text-fg-2">
                          {s.name.slice(0, 2)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-medium text-fg">
                          {s.name}
                          <span className="ml-1 text-fg-3 transition-transform group-hover:text-fg" aria-hidden="true">
                            ↗
                          </span>
                        </h3>
                        <p className="num truncate text-[11.5px] text-fg-3">{s.x ? `@${s.x}` : host(s.url)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleDone(s.id)}
                        aria-pressed={isDone}
                        aria-label={isDone ? `Unmark ${s.name}` : `Mark ${s.name} as checked`}
                        title={isDone ? 'Checked' : 'Mark as checked'}
                        className={cn(
                          'relative z-20 ml-auto grid size-7 shrink-0 place-items-center rounded-full border transition-colors',
                          isDone
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-bg'
                            : 'border-line text-transparent hover:border-line-2 hover:text-fg-3',
                        )}
                      >
                        <IconCheck className="size-3.5" stroke={2.5} />
                      </button>
                    </div>
                    <p className="text-[13.5px] leading-snug text-fg-2">{s.note}</p>
                    {s.tags.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-1 pt-1">
                        {s.tags.map((t) => (
                          <span key={t} className="num rounded border border-line px-1.5 text-[10.5px] leading-5 text-fg-3">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
