import { useState } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';

/** A message template with {placeholders} highlighted and a copy button. */
export default function CopyTemplate({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h3 className="text-sm font-medium text-fg">{title}</h3>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
        >
          {copied ? <IconCheck className="size-3.5 text-[var(--accent)]" /> : <IconCopy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="num px-5 py-4 text-[12.5px] leading-relaxed whitespace-pre-wrap text-fg-2">
        {text.split(/(\{[^}]+\})/g).map((part, i) =>
          part.startsWith('{') ? (
            <span key={i} className="rounded bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-0.5 text-fg">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </p>
    </div>
  );
}
