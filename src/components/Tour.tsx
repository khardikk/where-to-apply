import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { IconArrowRight, IconCheck, IconCopy, IconHelp, IconSearch, IconX } from '@tabler/icons-react';

const SEEN_KEY = 'wta:tour-seen';

type Step = { title: string; body: string; target: string; cta: string; art: () => ReactNode };

/* Tiny mock-ups of each part of the page, so the tour shows instead of tells. */
const Chip = ({ children, on }: { children: ReactNode; on?: boolean }) => (
  <span
    className={`num rounded-md border px-1.5 py-0.5 text-[10.5px] ${on ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-fg' : 'border-line text-fg-3'}`}
  >
    {children}
  </span>
);

const STEPS: Step[] = [
  {
    title: 'Find roles before LinkedIn',
    body: 'Type a role and a city. Each button opens a ready-made search on the job sites many startups post to first, plus LinkedIn, X and Naukri.',
    target: 'search',
    cta: 'Try the link builder',
    art: () => (
      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-line bg-bg px-2.5 py-2 text-xs text-fg">AI engineer</div>
          <div className="rounded-lg border border-line bg-bg px-2.5 py-2 text-xs text-fg">Bengaluru</div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {['Ashby', 'Greenhouse', 'LinkedIn 24h'].map((l) => (
            <div key={l} className="flex items-center justify-between rounded-lg border border-line bg-bg px-2 py-1.5 text-[11px] text-fg-2">
              {l} <span className="text-fg-3">↗</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Search and filter the list',
    body: 'Press / to search all sources. Pick a category, or stack tags like India + AI + FDE to narrow it down.',
    target: 'directory',
    cta: 'Open the list',
    art: () => (
      <div className="grid gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-bg px-2.5 py-2 text-xs text-fg-3">
          <IconSearch className="size-3.5" /> remote AI roles
          <kbd className="num ml-auto rounded border border-line px-1 text-[10px]">/</kbd>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip on>India</Chip>
          <Chip on>AI</Chip>
          <Chip>Remote</Chip>
          <Chip on>FDE</Chip>
          <Chip>Startups</Chip>
        </div>
      </div>
    ),
  },
  {
    title: 'Tick off what you’ve covered',
    body: 'Hit the circle on a card once you’ve checked it. "My checked" lists everything you’ve covered, with dates, and "Hide checked" shows only what’s left.',
    target: 'directory',
    cta: 'Start ticking',
    art: () => (
      <div className="grid gap-2">
        {[
          ['Wellfound', true],
          ['Peak XV jobs', true],
          ['YC Work at a Startup', false],
        ].map(([name, done]) => (
          <div key={String(name)} className={`flex items-center gap-2.5 rounded-lg border border-line bg-bg px-2.5 py-2 text-xs ${done ? 'opacity-55' : ''}`}>
            <span className="text-fg">{name}</span>
            <span
              className={`ml-auto grid size-5 place-items-center rounded-full border ${done ? 'border-[var(--accent)] bg-[var(--accent)] text-bg' : 'border-line-2'}`}
            >
              {done && <IconCheck className="size-3" stroke={3} />}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Send messages that get replies',
    body: 'Read the tips, then copy a cold DM or a referral ask with one click. Fill in the highlighted parts and send.',
    target: 'tips',
    cta: 'See tips and templates',
    art: () => (
      <div className="rounded-lg border border-line bg-bg p-3 text-[11.5px] leading-relaxed text-fg-2">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-fg">Cold DM</span>
          <span className="inline-flex items-center gap-1 rounded border border-line px-1.5 py-0.5 text-[10px]">
            <IconCopy className="size-3" /> Copy
          </span>
        </div>
        Hi <mark className="rounded bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] px-0.5 text-fg">{'{name}'}</mark>, saw you're hiring a{' '}
        <mark className="rounded bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] px-0.5 text-fg">{'{role}'}</mark>…
      </div>
    ),
  },
];

export default function Tour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);

  // First visit: open once, a moment after the page settles.
  useEffect(() => {
    setMounted(true);
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1';
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {}
  };

  const goTo = (id: string) => {
    close();
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };

  useEffect(() => {
    if (!open) return;
    nextRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setStep((s) => Math.min(s + 1, STEPS.length - 1));
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        aria-label="How to use this site"
        title="How to use this site"
        className="grid size-9 place-items-center rounded-full border border-line-2 bg-card/50 text-fg-2 backdrop-blur transition-colors hover:bg-hover hover:text-fg"
      >
        <IconHelp className="size-[18px]" stroke={1.8} />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[60] grid place-items-end bg-black/60 p-3 backdrop-blur-sm sm:place-items-center sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && close()}
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="tour-title"
                  className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line-2 bg-card shadow-2xl shadow-black/40"
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                >
                  <div className="flex items-center justify-between px-5 pt-4">
                    <span className="num text-[11px] text-fg-3">
                      How it works · {step + 1} of {STEPS.length}
                    </span>
                    <button type="button" onClick={close} aria-label="Close" className="rounded-md p-1 text-fg-3 hover:text-fg">
                      <IconX className="size-4" />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.18 }}
                      className="px-5 pt-4 pb-2"
                    >
                      <div className="rounded-xl border border-line bg-hover/40 p-4">{s.art()}</div>
                      <h2 id="tour-title" className="mt-5 text-lg font-semibold tracking-tight">
                        {s.title}
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{s.body}</p>
                      <button
                        type="button"
                        onClick={() => goTo(s.target)}
                        className="mt-3 inline-flex items-center gap-1 text-sm text-fg underline decoration-line-2 underline-offset-4 hover:decoration-fg"
                      >
                        {s.cta} <IconArrowRight className="size-3.5" />
                      </button>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center gap-3 border-t border-line px-5 py-4">
                    <div className="flex gap-1.5" aria-hidden="true">
                      {STEPS.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          tabIndex={-1}
                          onClick={() => setStep(i)}
                          className={`h-1.5 rounded-full transition-all ${i === step ? 'w-5 bg-fg' : 'w-1.5 bg-line-2 hover:bg-fg-3'}`}
                        />
                      ))}
                    </div>
                    <button type="button" onClick={close} className="ml-auto text-sm text-fg-3 hover:text-fg">
                      Skip
                    </button>
                    <button
                      ref={nextRef}
                      type="button"
                      onClick={() => (last ? close() : setStep(step + 1))}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-opacity hover:opacity-85"
                    >
                      {last ? 'Got it' : 'Next'} {!last && <IconArrowRight className="size-3.5" />}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
