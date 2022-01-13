import VueJsBridgePlugin from './plugin';
import defaultOptions from './default';

/**
 * @type {import('@nuxt/types').plugin}
 */
export default (context, inject, options) => {
	const initConfig = { ...defaultOptions, ...options };
	const vueJsBridgePlugin = new VueJsBridgePlugin(initConfig);

	inject('bridge', vueJsBridgePlugin);
};

// export default {
// 	install(Vue, options) {
// 		const initConfig = { ...defaultOptions, ...options };
// 		Object.defineProperty(Vue.prototype, '$bridge', {
// 			value: new VueJsBridgePlugin(initConfig),
// 		});
// 	},
// 	version: '__VERSION__',
// };
