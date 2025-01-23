import devServer, { defaultOptions } from '@hono/vite-dev-server';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      sourcemap: isSsrBuild,
      target: isSsrBuild ? 'node22' : ['chrome120', 'safari16.4', 'firefox128'],
    },
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      reactRouter(),
      devServer({
        entry: 'server/server.development.ts',
        exclude: [...defaultOptions.exclude, /^\/app\/.*/, /.*\.png$/],
        injectClientScript: false,
      }),
    ],
  };
});
