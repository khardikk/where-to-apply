import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { IconArrowLeft, IconCheck, IconCopy, IconListCheck, IconSearch, IconX } from '@tabler/icons-react';
import type { CategoryId, Source, Tag } from '../data/sources';
import { cn } from '@/lib/utils';

type Category = { id: CategoryId; title: string; short: string; blurb: string };
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

export default function Directory({
  items,
  categories,
  initialCat = 'all',
  initialTags = [],
  newIds = [],
}: {
  items: Item[];
  categories: Category[];
  /** Category and city pages open with these filters applied. */
  initialCat?: CategoryId | 'all';
  initialTags?: Tag[];
  /** Sources added recently, shown with a "New" badge. */
  newIds?: string[];
}) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<CategoryId | 'all'>(initialCat);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const isNew = useMemo(() => new Set(newIds), [newIds]);
  // id -> when it was checked (ms). 0 = checked before dates were recorded.
  const [done, setDone] = useState<Map<string, number>>(new Map());
  const [hideDone, setHideDone] = useState(false);
  const [view, setView] = useState<'all' | 'checked'>('all');
  const [askClear, setAskClear] = useState(false);
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // Restore the checklist and any filters in the URL (?q=&cat=&tags=), so filtered views can be shared.
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(DONE_KEY) ?? '{}');
      setDone(new Map(Array.isArray(raw) ? raw.map((id: string) => [id, 0]) : Object.entries(raw)));
    } catch {}
    const p = new URLSearchParams(location.search);
    if (p.get('q')) setQuery(p.get('q')!);
    const c = p.get('cat') as CategoryId | null;
    if (c && categories.some((x) => x.id === c)) setCat(c);
    const t = (p.get('tags') ?? '').split(',').filter((x): x is Tag => TAGS.includes(x as Tag));
    if (t.length) setTags(t);
    if (p.get('view') === 'checked') setView('checked');

    // The hero search and its preset chips send filters here.
    const onFilter = (e: Event) => {
      const d = (e as CustomEvent<{ q?: string; tag?: Tag; cat?: CategoryId }>).detail;
      setView('all');
      setQuery(d.q ?? '');
      setCat(d.cat ?? 'all');
      setTags(d.tag ? [d.tag] : []);
    };
    window.addEventListener('wta:filter', onFilter);
    return () => window.removeEventListener('wta:filter', onFilter);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    // Category and city pages already carry their defaults in the path, so only differences go in the URL.
    if (cat !== initialCat) p.set('cat', cat);
    if (tags.join(',') !== initialTags.join(',')) p.set('tags', tags.join(','));
    if (view === 'checked') p.set('view', 'checked');
    const qs = p.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  }, [query, cat, tags, view]);

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

  const persist = (next: Map<string, number>) => {
    try {
      localStorage.setItem(DONE_KEY, JSON.stringify(Object.fromEntries(next)));
    } catch {}
    return next;
  };

  const toggleDone = (id: string) =>
    setDone((prev) => {
      const next = new Map(prev);
      next.has(id) ? next.delete(id) : next.set(id, Date.now());
      return persist(next);
    });

  const clearChecks = () => {
    setDone(persist(new Map()));
    setAskClear(false);
    setView('all');
  };

  // The prompt to also clear checks goes away on its own if ignored.
  useEffect(() => {
    if (!askClear) return;
    const t = setTimeout(() => setAskClear(false), 8000);
    return () => clearTimeout(t);
  }, [askClear]);

  const toggleTag = (t: Tag) => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  // Everything except the category and tag choices: search text and "Hide checked".
  const base = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter(
      (s) =>
        (!hideDone || !done.has(s.id)) &&
        (!needle || `${s.name} ${s.note} ${s.x ?? ''} ${s.company ?? ''} ${host(s.url)} ${s.tags.join(' ')}`.toLowerCase().includes(needle)),
    );
  }, [items, query, hideDone, done]);

  const hasTags = (s: Item, ts: Tag[]) => ts.every((t) => s.tags.includes(t));

  // Chip counts answer "how many would I see if I picked this?", given every other active filter.
  const catCounts = useMemo(() => {
    const m: Record<string, number> = { all: 0 };
    for (const s of base) {
      if (!hasTags(s, tags)) continue;
      m.all++;
      m[s.category] = (m[s.category] ?? 0) + 1;
    }
    return m;
  }, [base, tags]);

  const tagCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of TAGS) {
      const want = tags.includes(t) ? tags : [...tags, t];
      m[t] = base.filter((s) => (cat === 'all' || s.category === cat) && hasTags(s, want)).length;
    }
    return m;
  }, [base, cat, tags]);

  const filtered = useMemo(
    () => base.filter((s) => (cat === 'all' || s.category === cat) && hasTags(s, tags)),
    [base, cat, tags],
  );

  // When a filter changes while the list is scrolled past, jump back to the top of the results.
  const wrap = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const el = wrap.current;
    if (el && el.getBoundingClientRect().top < 0) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8 });
  }, [cat, tags, hideDone]);

  const groups = categories.map((c) => ({ ...c, items: filtered.filter((s) => s.category === c.id) })).filter((g) => g.items.length);
  const filtering = query || cat !== 'all' || tags.length > 0 || hideDone;
  const doneCount = items.filter((s) => done.has(s.id)).length;

  const clear = () => {
    setQuery('');
    setCat('all');
    setTags([]);
    setHideDone(false);
    if (doneCount > 0) setAskClear(true);
  };

  const checkedList = useMemo(
    () => {
      const needle = query.trim().toLowerCase();
      return items
        .filter((s) => done.has(s.id) && (!needle || `${s.name} ${s.note} ${s.x ?? ''} ${host(s.url)}`.toLowerCase().includes(needle)))
        .sort((a, b) => (done.get(b.id) ?? 0) - (done.get(a.id) ?? 0));
    },
    [items, done, query],
  );
  const catShort = (id: CategoryId) => categories.find((c) => c.id === id)?.short ?? id;
  const fmtDay = (ts: number) =>
    ts ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'earlier';

  const copyList = async () => {
    const text = checkedList.map((s) => `- ${s.name} (${catShort(s.category)}): ${s.url}`).join('\n');
    try {
      await navigator.clipboard.writeText(`Where I've looked (${checkedList.length}):\n${text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div ref={wrap}>
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
          <button
            type="button"
            onClick={() => setView(view === 'checked' ? 'all' : 'checked')}
            disabled={doneCount === 0 && view === 'all'}
            title={doneCount ? 'See everything you have checked off' : 'Tick a card to start your list'}
            className="num hidden rounded-lg px-2 py-1 text-right text-xs leading-tight text-fg-3 transition-colors enabled:hover:bg-hover enabled:hover:text-fg disabled:cursor-default sm:block"
          >
            <span className="text-fg">{doneCount}</span> / {items.length}
            <br />
            {view === 'checked' ? 'back to all' : doneCount ? 'checked · view' : 'checked off'}
          </button>
        </div>

        {view === 'all' && (<>
        <div className="mt-3 -mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:[mask-image:none]">
          {[{ id: 'all' as const, short: 'All', title: 'All sources' }, ...categories].map((c) => {
            const on = cat === c.id;
            const n = catCounts[c.id] ?? 0;
            return (
              <button
                key={c.id}
                type="button"
                title={c.title}
                onClick={() => setCat(on && c.id !== 'all' ? 'all' : c.id)}
                aria-pressed={on}
                disabled={!on && n === 0}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1 text-[13px] whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-35',
                  on ? 'border-fg bg-fg text-bg' : 'border-line text-fg-2 enabled:hover:border-line-2 enabled:hover:text-fg',
                )}
              >
                {c.short} <span className={cn('num', on ? 'opacity-70' : 'text-fg-3')}>{n}</span>
                {on && c.id !== 'all' && <IconX className="-mr-1 ml-1 inline size-3 align-[-1px] opacity-70" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div className="mt-2 -mx-5 flex items-center gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {TAGS.map((t) => {
            const on = tags.includes(t);
            const n = tagCounts[t] ?? 0;
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                aria-pressed={on}
                disabled={!on && n === 0}
                className={cn(
                  'num shrink-0 rounded-md border px-2 py-0.5 text-[11.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-35',
                  on
                    ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-fg'
                    : 'border-line text-fg-3 enabled:hover:text-fg',
                )}
              >
                {t} <span className="opacity-60">{n}</span>
              </button>
            );
          })}
          {doneCount > 0 && (
            <button
              type="button"
              onClick={() => setView('checked')}
              className="num ml-auto inline-flex shrink-0 items-center gap-1 rounded-md border border-line px-2 py-0.5 text-[11.5px] whitespace-nowrap text-fg-2 transition-colors hover:text-fg"
            >
              <IconListCheck className="size-3.5" /> My checked {doneCount}
            </button>
          )}
          <button
            type="button"
            onClick={() => setHideDone((v) => !v)}
            aria-pressed={hideDone}
            className={cn(
              cn('num shrink-0 rounded-md border px-2 py-0.5 text-[11.5px] whitespace-nowrap transition-colors', doneCount === 0 && 'ml-auto'),
              hideDone ? 'border-fg text-fg' : 'border-line text-fg-3 hover:text-fg',
            )}
          >
            Hide checked
          </button>
          {(filtering || doneCount > 0) && (
            <button type="button" onClick={clear} className="num shrink-0 text-[11.5px] text-fg-3 underline underline-offset-2 hover:text-fg">
              Reset
            </button>
          )}
        </div>
        </>)}

        {askClear && (
          <div role="status" className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-[13px] text-fg-2">
            Filters cleared. Also clear your {doneCount} checked {doneCount === 1 ? 'source' : 'sources'}?
            <span className="ml-auto flex gap-2">
              <button type="button" onClick={clearChecks} className="rounded-md bg-fg px-2.5 py-1 text-xs font-medium text-bg hover:opacity-85">
                Clear checks
              </button>
              <button type="button" onClick={() => setAskClear(false)} className="rounded-md border border-line px-2.5 py-1 text-xs text-fg-2 hover:text-fg">
                Keep them
              </button>
            </span>
          </div>
        )}
      </div>

      {view === 'checked' ? (
        <section className="pt-8" aria-labelledby="checked-h">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setView('all')} className="inline-flex items-center gap-1 text-sm text-fg-3 hover:text-fg">
              <IconArrowLeft className="size-4" /> All sources
            </button>
            <h2 id="checked-h" className="text-lg font-semibold tracking-tight">
              Your checked list <span className="num text-xs font-normal text-fg-3">{checkedList.length}</span>
            </h2>
            {checkedList.length > 0 && (
              <span className="ml-auto flex gap-2">
                <button type="button" onClick={copyList} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs text-fg-2 hover:border-line-2 hover:text-fg">
                  {copied ? <IconCheck className="size-3.5 text-[var(--accent)]" /> : <IconCopy className="size-3.5" />} {copied ? 'Copied' : 'Copy list'}
                </button>
                <button
                  type="button"
                  onClick={() => confirm(`Clear all ${checkedList.length} checked sources?`) && clearChecks()}
                  className="rounded-lg border border-line px-2.5 py-1 text-xs text-fg-2 hover:border-line-2 hover:text-fg"
                >
                  Clear all
                </button>
              </span>
            )}
          </div>
          {checkedList.length === 0 ? (
            <p className="py-20 text-center text-fg-2">Nothing checked yet. Tick the circle on a card once you’ve covered it.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
              {checkedList.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                  {s.hasLogo ? (
                    <img src={`/logos/${s.id}.png`} alt="" width={24} height={24} loading="lazy" className={cn('size-6 shrink-0 border border-line bg-white object-cover', s.x ? 'rounded-full' : 'rounded-md p-0.5')} />
                  ) : (
                    <span className="grid size-6 shrink-0 place-items-center rounded-md border border-line text-[10px] text-fg-2">{s.name.slice(0, 2)}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="truncate text-sm text-fg hover:underline">
                      {s.name} <span className="text-fg-3">↗</span>
                    </a>
                    <p className="num truncate text-[11px] text-fg-3">
                      {catShort(s.category)} · {s.x ? `@${s.x}` : host(s.url)}
                    </p>
                  </div>
                  <span className="num hidden text-[11px] text-fg-3 sm:block">{fmtDay(done.get(s.id) ?? 0)}</span>
                  <button
                    type="button"
                    onClick={() => toggleDone(s.id)}
                    aria-label={`Uncheck ${s.name}`}
                    title="Uncheck"
                    className="grid size-7 shrink-0 place-items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] text-bg transition-opacity hover:opacity-70"
                  >
                    <IconCheck className="size-3.5" stroke={2.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (<>
      {filtering && groups.length > 0 && (
        <p className="num pt-4 text-xs text-fg-3" aria-live="polite">
          Showing <span className="text-fg">{filtered.length}</span> of {items.length}
        </p>
      )}

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
                          {isNew.has(s.id) && (
                            <span className="num ml-1.5 rounded bg-[var(--accent)] px-1 py-px align-[2px] text-[9.5px] font-semibold tracking-wide text-bg">
                              NEW
                            </span>
                          )}
                        </h3>
                        <p className="num truncate text-[11.5px] text-fg-3">
                          {s.x ? `@${s.x}` : host(s.url)}
                          {s.company && <span className="ml-1.5 rounded border border-line px-1 text-fg-2">{s.company}</span>}
                        </p>
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
      </>)}
    </div>
  );
}
