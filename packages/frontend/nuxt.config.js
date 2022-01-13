import 'module-alias/register';

import { resolve } from 'path';
import colors from 'vuetify/es5/util/colors';

import baseConnConfig from 'be/config/baseConnConfig';

baseConnConfig.initProcessEnv({ beApiPrefix: '/' });

const {
	mainOption: {
		proxyOption,
		dirPathInfo: { workspacePath },
		serverInfo,
	},
	frontendOption: {
		serverInfo: { port },
		logOption,
	},
} = baseConnConfig.getOperationInfo();

/** @type {import('@nuxt/types').NuxtConfig} */
const nuxtConfig = {
	// Deployment Targets => Default: server, Possible values: 'server': For server side rendering, 'static': For static sites
	// @ts-ignore
	target: 'server',

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'TongTong',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content:
					'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
			},
			{ hid: 'description', name: 'description', content: '' },
		],
		link: [{ rel: 'icon', type: 'image/png', href: '/PICTURE-favicon.png' }],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['~/assets/scss/index.scss'],

	styleResources: {
		scss: '~/assets/scss/common/_global.scss',
	},

	rootDir: '../../',
	srcDir: 'packages/frontend',

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: false,

	env: {
		apiPrefix: '/api',
	},

	// Watch custom files for restarting the server.
	watch: [
		resolve(workspacePath, '.env'),
		resolve(workspacePath, '.env.staging'),
		resolve(workspacePath, '.env.development'),
		resolve(workspacePath, '.env.production'),
	],

	// Use aliases to access custom directories within your JavaScript and CSS.
	alias: {
		cm: resolve(workspacePath, 'packages', 'common', 'src'),
		be: resolve(workspacePath, 'packages', 'backend', 'src'),
	},

	publicRuntimeConfig: {
		FE_PORT: port,
		PROXY: proxyOption.proxyApiPrefix,
		serverInfo: {
			isRealDB: serverInfo.isRealDB,
			isRealServer: serverInfo.isRealServer,
			serverLinkList: serverInfo.serverLinkList,
			protocol: serverInfo.schema,
		},
	},

	privateRuntimeConfig: {},

	proxy: proxyOption.proxy,

	server: {
		port,
		https: serverInfo.serverOption,
		host: serverInfo.host,
	},

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{ src: '~/plugins/custom.js' },
		{ src: '~/plugins/web-script.js' },
		// { src: '~/plugins/web-view-js-bridge/index.js', mode: 'client' },
		{ src: '~/plugins/bridge.js', mode: 'client' },
		{ src: '~/plugins/persisted-state.js', mode: 'client' },
		{ src: '~/plugins/module-loader.client.js' },
		{ src: '~/plugins/validation-rules.js' },
		{ src: '~/plugins/notification.js' },
		{ src: '~/plugins/dayjs.js' },
		{ src: '~/plugins/utils/index.js' },
		{ src: '~/plugins/node-session/index.js', mode: 'client' },
	],

	router: {
		// middleware: ['class'],
	},

	/*
	 ** Server Middleware
	 */
	serverMiddleware: [{ path: '/api', handler: '../backend/index.js' }],

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://www.npmjs.com/package/@nuxtjs/svg
		'@nuxtjs/svg',
		// https://go.nuxtjs.dev/vuetify
		'@nuxtjs/vuetify',
		// https://www.npmjs.com/package/@nuxtjs/style-resources
		'@nuxtjs/style-resources',
		// https://composition-api.nuxtjs.org/
		'@nuxtjs/composition-api/module',
	],
	// Modules: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-modulesdir
	modulesDir: [resolve(__dirname, '../../node_modules/')],
	modules: [
		// https://axios.nuxtjs.org
		'@nuxtjs/axios',
		// https://i18n.nuxtjs.org/
		'nuxt-i18n',
		// https://www.npmjs.com/package/@nuxtjs/toast
		'@nuxtjs/toast',
		// https://www.npmjs.com/package/nuxt-history-state
		'nuxt-history-state',
		// 전역 세팅
		'~/modules/global',
		// SSR 환경에서 File Logging
		'~/modules/logger',
		['vuetify-dialog/nuxt', { property: '$dialog' }],
	],
	historyState: {
		maxHistoryLength: 50, // or any positive integer
		reloadable: false, // or true
		overrideDefaultScrollBehavior: true, // or false
		scrollingElements: '#scroll', // or any selector
	},
	// https://github.com/shakee93/vue-toasted
	toast: {
		register: [
			// Register custom toasts
			{
				name: 'my_info',
				message: (/** @type {any} */ message) => message,
				options: {
					type: 'info',
					theme: 'bubble',
					containerClass: 'default-toast',
					singleton: false,
					duration: 2000,
					position: 'bottom-center',
				},
			},
			{
				name: 'my_error',
				message: (/** @type {any} */ message) => message,
				options: {
					type: 'error',
					duration: 5000,
					position: 'top-center',
				},
			},
			{
				name: 'my_success',
				containerClass: 'toast_success',
				message: message => message,
				options: {
					type: 'success',
					duration: 5000,
					position: 'top-right',
					action: {
						text: 'Cancel',
						onClick: (
							/** @type {any} */ e,
							/** @type {{ goAway: (arg0: number) => void; }} */ toastObject,
						) => {
							toastObject.goAway(0);
						},
					},
				},
			},
		],
	},

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		proxy: true,
	},

	// loading: '~/components/LoadingTest.vue',

	// nuxt-i18n module configuration: https://i18n.nuxtjs.org/
	i18n: {
		locales: [
			{
				code: 'ko',
				iso: 'ko-KO',
				file: 'ko.js',
				name: '한국어',
				// domain: 'https://ko.nuxtjs.org'
			},
		],
		strategy: 'no_prefix',
		langDir: 'i18n/',
		defaultLocale: 'ko',
		lazy: true,
		// loadLanguagesAsync: true,
		// skipSettingLocaleOnNavigate: true,
		vueI18n: {
			fallbackLocale: 'ko',
		},
	},

	// Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		customVariables: ['~/assets/scss/vuetify.scss'],
		treeShake: true,
		theme: {
			dark: false,
			themes: {
				light: {
					primary: colors.lightGreen.base,
					accent: colors.shades.black,
					secondary: colors.grey.darken1,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.red.accent3,
					success: colors.red.accent1,
				},
				dark: {
					primary: colors.blue.darken2,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3,
				},
			},
		},
	},

	logger: {
		// Settings to determine if default handlers should be
		// registered for requests and errors respectively.
		// Set to `true` to skip request logging (level: info).
		skipRequestMiddlewareHandler: logOption.isSkipRequest,
		// Set to `true` to skip error logging (level: error).
		skipErrorMiddlewareHandler: logOption.isSkipError,
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		analyze: false,
		// extractCSS: true,
		transpile: ['vuetify/lib'],
		// 필수 모듈들을 번들링 과정에 포함
		standalone: true,
		babel: {
			presets({ isServer }) {
				const targets = isServer ? { node: 'current' } : { ie: 11 };

				return [
					[
						require.resolve('@nuxt/babel-preset-app'),
						{
							buildTarget: isServer ? 'server' : 'client',
							targets,
							corejs: { version: 3 },
						},
					],
				];
			},
			plugins: ['@babel/plugin-proposal-numeric-separator'],
		},
		extend(config, ctx) {
			if (ctx.isDev) {
				config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
			}
		},
		postcss: {
			plugins: {
				cssnano: { preset: 'default' }, // disabled in dev mode
			},
		},
		html: {
			minify: {
				collapseWhitespace: true, // as @dario30186 mentioned
				removeComments: true, // 👈 Fix: Failed to execute 'appendChild' on 'Node': This node type does not support this method.
			},
		},
	},
};

export default nuxtConfig;
