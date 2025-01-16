import { readFileSync } from 'node:fs';

import { Hono } from 'hono';
import { createRequestHandler } from 'react-router-hono';
import sourceMapSupport from 'source-map-support';

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
  createRequestHandler({
    // @ts-expect-error
    build: () => import('virtual:react-router/server-build'),
  }),
);

export default app;
