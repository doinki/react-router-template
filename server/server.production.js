import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { endTime, startTime, timing } from 'hono/timing';
import { createRequestHandler } from 'react-router-hono';
import { gracefulShutdown } from 'server.close';
import sourceMapSupport from 'source-map-support';

const __dirname = dirname(fileURLToPath(import.meta.url));
process.chdir(join(__dirname, '..'));

sourceMapSupport.install({
  retrieveSourceMap(source) {
    const match = source.match(/^file:\/\/(.*)\?t=[.\d]+$/);

    if (match) {
      return {
        map: readFileSync(`${match[1]}.map`, 'utf8'),
        url: source,
      };
    }

    return null;
  },
});

const app = new Hono();

app.use(timing());
app.use(
  serveStatic({
    onFound: (path, c) => {
      if (path.substring(0, 22) === './build/client/assets/') {
        c.header('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.endsWith('.html')) {
        c.header('Cache-Control', 'public, max-age=300, must-revalidate');
      } else if (path.includes('.')) {
        c.header('Cache-Control', 'public, max-age=3600');
      }
    },
    root: 'build/client',
  }),
);
app.get('*', (c, next) => {
  if (c.req.path.at(-1) === '/' && c.req.path !== '/') {
    const url = new URL(c.req.url);
    url.pathname = url.pathname.substring(0, url.pathname.length - 1);

    return c.redirect(url);
  }

  return next();
});
app.use(logger());

const serverBuild = await import('../build/server/index.js');
app.use(
  createRequestHandler({
    build: serverBuild,
    getLoadContext: (c) => ({
      c,
      serverBuild,
      timing: {
        endTime,
        startTime,
      },
    }),
  }),
);

const hostname = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 3000;

const server = serve(
  {
    fetch: app.fetch,
    hostname,
    port,
  },
  () => {
    process.send?.('ready');
  },
);

server.keepAliveTimeout = 65_000;

gracefulShutdown(server);
