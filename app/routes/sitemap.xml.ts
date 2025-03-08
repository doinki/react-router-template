import { generateSitemap, type SeoHandle } from 'react-router-seo';

import { getDomainUrl } from '~/utils/get-domain-url';

import { type Route } from './+types/sitemap.xml';

export const handle: SeoHandle = {
  seo: {
    sitemap: false,
  },
};

export async function loader({ context, request }: Route.LoaderArgs) {
  return generateSitemap(request, context.serverBuild.routes, {
    url: getDomainUrl(request),
  });
}
