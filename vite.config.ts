import { UserConfig, defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.base.config';

// https://vitejs.dev/config/
export default defineConfig(
	mergeConfig<UserConfig, UserConfig>(baseConfig, {})
);
