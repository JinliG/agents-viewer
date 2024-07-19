import { UserConfig, defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.base.config';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest.pwa.json';

// https://vitejs.dev/config/
export default defineConfig(
	mergeConfig<UserConfig, UserConfig>(baseConfig, {
		build: {
			outDir: 'dist.pwa',
		},
		plugins: [
			VitePWA({
				mode: 'development',
				base: '/',
				registerType: 'autoUpdate', // 注册策略，可选 autoUpdate 或者 prompt
				workbox: {
					globPatterns: ['**/*.{js,css,html,png,jpg,svg}'],
					// 要缓存的文件模式
					runtimeCaching: [
						{
							urlPattern: /^https:\/\/fonts\.googleapis\.com/,
							handler: 'CacheFirst',
							options: {
								cacheName: 'google-fonts-stylesheets',
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 24 * 10, // 10 Days
								},
								cacheableResponse: {
									statuses: [0, 200],
								},
							},
						},
					],
				},
				manifest,
				devOptions: {
					// 如果想在`vite dev`命令下调试PWA, 必须启用它
					enabled: true,
				},
			}),
		],
		server: {
			host: true,
			port: 3005,
		},
	})
);
