import { Hono } from 'hono';
import { createRequestHandler } from 'react-router-hono';

const app = new Hono();

app.use(
  createRequestHandler({
    // @ts-expect-error
    build: () => import('virtual:react-router/server-build'),
  })
);

export default app;
