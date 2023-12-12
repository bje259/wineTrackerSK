import { sveltekit } from '@sveltejs/kit/vite';
import TurboConsole from 'unplugin-turbo-console/vite';
import { analyzer } from 'vite-bundle-analyzer';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		tsconfigPaths(),
		analyzer(),
		TurboConsole({
			/* options here */
		})
	],
	test: {
		include: [
			'./src/**/*.{test,spec}.{js,ts,svelte}',
			'./tests/**.{test,spec}.{js,ts,html,svelte}'
		],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./setupTest.js'],
		css: true,
		browser: {
			enabled: false,
			name: 'chrome' // browser name is required
		},
		reporters: ['verbose']
	}
});
