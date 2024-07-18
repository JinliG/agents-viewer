import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.base.config';
import manifest from './manifest.json';
import { crx } from '@crxjs/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(
	mergeConfig(baseConfig, {
		build: {
			outDir: 'dist-crx',
		},
		plugins: [crx({ manifest })],
		server: {
			host: true,
			port: 5173,
		},
	})
);
