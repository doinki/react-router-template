import devServer, { defaultOptions } from '@hono/vite-dev-server';
import { reactRouter } from '@react-router/dev/vite';
import postcssPresetEnv from 'postcss-preset-env';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    sourcemap: isSsrBuild,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, postcssPresetEnv],
    },
  },
  plugins: [
    devServer({
      entry: 'server/server.development.ts',
      exclude: [...defaultOptions.exclude, /^\/app\/.*/, /.*\.png$/],
      injectClientScript: false,
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
}));
