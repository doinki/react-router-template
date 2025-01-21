import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('signin', 'routes/signin.tsx'),
  route('signup', 'routes/signup.tsx'),
  route('signout', 'routes/signout.ts'),
  route('robots.txt', 'routes/robots.txt.ts'),
  route('sitemap.xml', 'routes/sitemap.xml.ts'),
] satisfies RouteConfig;
