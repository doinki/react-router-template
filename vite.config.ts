import devServer, { defaultOptions } from '@hono/vite-dev-server';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { envOnlyMacros } from 'vite-env-only';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      sourcemap: isSsrBuild,
      // https://tailwindcss.com/docs/compatibility#browser-support
      target: isSsrBuild ? 'node22' : ['chrome111', 'safari16.4', 'firefox128'],
    },
    optimizeDeps: {
      exclude: ['bcrypt'],
    },
    plugins: [
      envOnlyMacros(),
      tsconfigPaths(),
      tailwindcss(),
      reactRouter(),
      devServer({
        entry: 'server/server.development.ts',
        exclude: [...defaultOptions.exclude, /^\/app\/.*/, /.*\.png$/],
        injectClientScript: false,
      }),
    ],
    test: {
      globals: true,
    },
  };
});
