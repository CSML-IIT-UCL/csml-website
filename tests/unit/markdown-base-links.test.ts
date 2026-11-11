import { describe, expect, it } from 'vitest';
import { baseLinksPlugin, prefixBase } from '../../src/lib/markdown-base-links.mjs';

describe('prefixBase', () => {
  it('prefixes root-relative links with the site base', () => {
    expect(prefixBase('/people/pietro-novelli/', '/csml-website/')).toBe('/csml-website/people/pietro-novelli/');
    expect(prefixBase('/blog/', '/csml-website/dev/')).toBe('/csml-website/dev/blog/');
  });
  it('leaves already-prefixed, external, protocol-relative, anchor and relative links alone', () => {
    expect(prefixBase('/csml-website/blog/', '/csml-website/')).toBe('/csml-website/blog/');
    expect(prefixBase('https://example.org/', '/csml-website/')).toBe('https://example.org/');
    expect(prefixBase('//example.org/', '/csml-website/')).toBe('//example.org/');
    expect(prefixBase('#top', '/csml-website/')).toBe('#top');
    expect(prefixBase('people/', '/csml-website/')).toBe('people/');
  });
  it('is a no-op for a root base', () => {
    expect(prefixBase('/people/x/', '/')).toBe('/people/x/');
  });
});

describe('baseLinksPlugin', () => {
  it('rewrites anchor hrefs through the visitor context', () => {
    const node = { properties: { href: '/people/vladimir-kostic/' } };
    const calls: [unknown, string, string][] = [];
    baseLinksPlugin('/csml-website/').element.visit(node, { setProperty: (n: unknown, k: string, v: string) => calls.push([n, k, v]) });
    expect(calls).toEqual([[node, 'href', '/csml-website/people/vladimir-kostic/']]);
  });
});
