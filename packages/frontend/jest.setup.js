import { Nuxt, Builder } from 'nuxt';
import nuxtConfig from './nuxt.config.js';

// these boolean switches turn off the build for all but the store
const resetConfig = {
	loading: false,
	loadingIndicator: false,
	fetch: {
		client: true,
		server: true,
	},
	features: {
		store: true,
		layouts: false,
		meta: false,
		middleware: true,
		transitions: false,
		deprecations: false,
		validate: false,
		asyncData: true,
		fetch: true,
		clientOnline: false,
		clientPrefetch: false,
		clientUseUrl: false,
		componentAliases: false,
		componentClientOnly: false,
	},
	build: {
		indicator: false,
		terser: false,
	},
};

// we take our nuxt config, lay the resets on top of it,
// and lastly we apply the non-boolean overrides
const config = {
	...nuxtConfig,
	...resetConfig,
	mode: 'spa',
	srcDir: nuxtConfig.srcDir,
	ignore: ['**/components/**/*', '**/layouts/**/*', '**/pages/**/*'],
};

const buildNuxt = async () => {
	const nuxt = new Nuxt(config);
	await new Builder(nuxt).build();
	return nuxt;
};

module.exports = async () => {
	const nuxt = await buildNuxt();

	// we surface this path as an env var now
	// so we can import the store dynamically later on
	process.env.buildDir = nuxt.options.buildDir;
};
