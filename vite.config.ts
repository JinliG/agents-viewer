import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.base.config';

// https://vitejs.dev/config/
export default defineConfig(mergeConfig(baseConfig, {}));
