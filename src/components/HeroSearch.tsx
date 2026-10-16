import { useState, type FormEvent } from 'react';
import { IconSearch } from '@tabler/icons-react';

/** Hero search: sends the query (or a preset filter) to the directory below and scrolls to it. */
export type Preset = { label: string; count: number; tag?: string; cat?: string };

export default function HeroSearch({ total, presets }: { total: number; presets: Preset[] }) {
  const [q, setQ] = useState('');

  const send = (detail: { q?: string; tag?: string; cat?: string }) => {
    window.dispatchEvent(new CustomEvent('wta:filter', { detail }));
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send({ q: q.trim() });
  };

  return (
    <div className="mt-8 max-w-2xl">
      <form onSubmit={submit} role="search" className="flex h-13 items-center gap-2 rounded-2xl border border-line-2 bg-card/80 p-1.5 pl-4 shadow-lg shadow-black/5 backdrop-blur focus-within:border-fg-3">
        <IconSearch className="size-[18px] shrink-0 text-fg-3" stroke={1.8} />
        <label htmlFor="hero-q" className="sr-only">
          Search sources
        </label>
        <input
          id="hero-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${total} places: VC boards, referrals, FDE…`}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-3"
        />
        <button type="submit" className="h-full shrink-0 rounded-xl bg-fg px-4 text-sm font-medium text-bg transition-opacity hover:opacity-85">
          Search
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => send({ tag: p.tag, cat: p.cat })}
            className="num rounded-full border border-line bg-card/50 px-2.5 py-1 text-[12px] text-fg-2 backdrop-blur transition-colors hover:border-line-2 hover:text-fg"
          >
            {p.label} <span className="text-fg-3">{p.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
