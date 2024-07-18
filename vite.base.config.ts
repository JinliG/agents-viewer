import { UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
const baseConfig: UserConfig = {
	plugins: [react(), tsconfigPaths()],
	css: {
		preprocessorOptions: {
			less: {
				modifyVars: {
					'primary-color': '#2f54eb',
				},
				javascriptEnabled: true,
			},
		},
	},
	optimizeDeps: {
		include: ['lodash'],
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, './src'),
		},
	},
};

export default baseConfig;
