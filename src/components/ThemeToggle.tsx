import { useEffect, useState, type MouseEvent } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';

type Theme = 'light' | 'dark';

/** Same circular-reveal theme switch as hardikk.dev. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  useEffect(() => setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light'), []);

  const flip = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    const apply = () => {
      root.classList.toggle('dark', next === 'dark');
      try {
        localStorage.setItem('theme', next);
      } catch {}
    };
    setTheme(next);
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
    const { clientX: x, clientY: y } = e;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.dataset.vt = 'theme';
    const t = document.startViewTransition(apply);
    t.ready.then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 500, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
      ),
    );
    t.finished.finally(() => delete root.dataset.vt);
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid size-9 place-items-center rounded-full border border-line bg-card/70 text-fg-2 backdrop-blur transition-colors hover:text-fg"
    >
      {theme === 'dark' ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
    </button>
  );
}
