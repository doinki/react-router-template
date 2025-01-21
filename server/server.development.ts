import { readFileSync } from 'node:fs';

import { type Context, Hono } from 'hono';
import { endTime, startTime, timing, type TimingVariables } from 'hono/timing';
import { type ServerBuild } from 'react-router';
import { createRequestHandler } from 'react-router-hono';
import sourceMapSupport from 'source-map-support';

declare module 'react-router' {
  interface AppLoadContext {
    c: Context;
    serverBuild: ServerBuild;
    timing: {
      endTime: typeof endTime;
      startTime: typeof startTime;
    };
  }
}

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

const app = new Hono<{ Variables: TimingVariables }>();

app.use(timing());
app.use(
  createRequestHandler({
    // @ts-expect-error
    build: () => import('virtual:react-router/server-build'),
    // @ts-expect-error
    getLoadContext: (c) => ({
      c,
      serverBuild: {
        routes: {
          root: { module: {} },
        },
      },
      timing: {
        endTime,
        startTime,
      },
    }),
  }),
);

export default app;
