import { defineMiddleware } from 'astro:middleware';
import { SOURCES, CATEGORIES } from './data/sources';

function wantsMarkdown(accept: string | null) {
  if (!accept) return false;
  const choices = accept.split(',').map((part) => {
    const [type, ...params] = part.trim().split(';');
    const q = Number(params.find((p) => p.trim().startsWith('q='))?.split('=')[1] ?? 1);
    return { type: type.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
  });
  const markdown = Math.max(0, ...choices.filter((x) => x.type === 'text/markdown').map((x) => x.q));
  const html = Math.max(0, ...choices.filter((x) => x.type === 'text/html' || x.type === 'text/*' || x.type === '*/*').map((x) => x.q));
  return markdown > 0 && markdown >= html;
}

function homepageMarkdown() {
  const categories = CATEGORIES.map((category) => `- [${category.title}](https://apply.hardikk.dev/c/${category.id})`).join('\n');
  const sources = SOURCES.map((source) => `- [${source.name}](${source.url}) (${source.note})`).join('\n');
  return `# Where to Apply: a job board aggregator for India and remote tech roles\n\nWhere to Apply is a free, hand-checked directory of places to find software, AI engineer, and forward deployed engineer (FDE) jobs in India or remote. It brings job boards, startup and venture capital portfolio boards, communities, hiring managers, and practical search tools together in one place. No account is required and the directory has no affiliate links.\n\nUse the directory to find places to search, filter sources by role or location, and build searches on hiring platforms. You can also browse curated lists by category or city. Job seekers can use the included outreach templates and search tips to reach hiring teams directly.\n\n## Browse categories\n\n${categories}\n\n## All sources\n\n${sources}\n\n## More information\n\n- [About Where to Apply](https://apply.hardikk.dev/about)\n- [Contact](https://apply.hardikk.dev/contact)\n- [Privacy](https://apply.hardikk.dev/privacy)\n- [Agent instructions](https://apply.hardikk.dev/llms.txt)\n- [Sitemap](https://apply.hardikk.dev/sitemap-index.xml)\n`;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();
  const markdown = wantsMarkdown(context.request.headers.get('accept'));
  if (markdown && context.url.pathname === '/') {
    return new Response(homepageMarkdown(), {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept' },
    });
  }

  const response = await next();
  if (markdown && response.status === 404) {
    const body = `# Page not found\n\nThe requested page ${context.url.pathname} was not found on Where to Apply. Check the [homepage](https://apply.hardikk.dev/) or [sitemap](https://apply.hardikk.dev/sitemap-index.xml) to find available pages.\n`;
    return new Response(body, {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept' },
    });
  }
  if (context.url.pathname === '/') {
    const headers = new Headers(response.headers);
    headers.append('Vary', 'Accept');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
  return response;
});
