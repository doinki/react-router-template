import { type SeoHandle } from 'react-router-seo';

import { getDomainUrl } from '~/utils/get-domain-url';

import { type Route } from './+types/robots.txt';

export const handle: SeoHandle = {
  seo: {
    sitemap: false,
  },
};

export async function loader({ request }: Route.LoaderArgs) {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${getDomainUrl(request)}/sitemap.xml`;
  const bytes = new TextEncoder().encode(robots).byteLength;

  return new Response(robots, {
    headers: {
      'Content-Length': String(bytes),
      'Content-Type': 'text/plain',
    },
  });
}
