import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
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

app.use(
  serveStatic({
    onFound: (path, c) => {
      if (path.substring(0, 22) === './build/client/assets/') {
        c.header('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.substring(path.length - 5) === '.html') {
        c.header('Cache-Control', 'public, max-age=300, must-revalidate');
      } else if (path.includes('.')) {
        c.header('Cache-Control', 'public, max-age=3600');
      }
    },
    root: 'build/client',
  }),
);
app.use(logger());
app.use(
  createRequestHandler({ build: () => import('../build/server/index.js') }),
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

server.keepAliveTimeout = 65000;

gracefulShutdown(server);
