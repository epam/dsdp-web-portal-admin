import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import {resolve} from 'path';

export default defineConfig({
  base: '/admin/',
  plugins: [react(), tsconfigPaths(), svgr()],
  build: {
    outDir: 'build', // CRA's default build output
  },
  define: {
    global: 'self',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/admin'
      }
    },
    setupFiles: './src/setupTests.jsx',
    server: {
      deps: {
        inline: [
          'reapop',
          'react-transition-group',
          '@material-ui/core/styles',
          '@material-ui/core',
          'monaco-editor',
        ],
      },
    },
    coverage: {
      exclude: ['**/build/**', '**/storybook/**', '*.stories.tsx', '**/*.styles.ts', ...coverageConfigDefaults.exclude],
      reporter: ['lcovonly', 'text-summary']
    }
  },
  resolve: {
    // This is still important for monorepos
    dedupe: ['react', 'react-dom'],
    alias: {
      '#shared': resolve(__dirname, '../shared/src'),
      '#web-components': resolve(__dirname, '../web-components/src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true
      }
    }
  }
});
