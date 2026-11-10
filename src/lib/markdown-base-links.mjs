// Prefixes root-relative links written in Markdown content (e.g. `/people/pietro-novelli/`)
// with the configured site base, so editors never have to know the deployment path
// (production vs the /dev/ preview). Absolute URLs, protocol-relative URLs (`//host`),
// anchors and relative paths are left untouched.
export function prefixBase(href, base) {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return href;
  const trimmed = base.replace(/^\/+|\/+$/g, '');
  if (!trimmed) return href;
  const normalizedBase = `/${trimmed}/`;
  if (href === `/${trimmed}` || href.startsWith(normalizedBase)) return href;
  return normalizedBase + href.replace(/^\/+/, '');
}

// Hast plugin for Astro's default Sätteri Markdown processor.
export function baseLinksPlugin(base) {
  return {
    name: 'csml-base-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;
        const next = prefixBase(href, base);
        if (next !== href) ctx.setProperty(node, 'href', next);
      },
    },
  };
}
