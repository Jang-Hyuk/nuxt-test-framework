// @ts-nocheck

/**
 * VueJsBridgePlugin
 */
import MockBridge from './mock';
import { getDeviceInfo } from './utils';

globalThis.$ = {};

const deviceInfo = getDeviceInfo();
export default class VueJsBridgePlugin {
	constructor(options = {}) {
		this.options = options;
	}

	/**
	 * Initialize the core bridge plugin
	 * @param {Function} callback
	 * callback returns an instance of the bridge plugin
	 */
	init(callback) {
		const { debug, mock, mockHandler } = this.options;
		// If mock & mockHandler exist at the same time, register MockBridge to facilitate development
		if (mock && mockHandler) {
			debug && console.log(`[VueJsBridge] work in mock mode...`);
			const bridge = new MockBridge(mockHandler);
			return callback(bridge);
		}
		if (deviceInfo.android) {
			// The following is[JsBridge](https://github.com/lzyzsd/JsBridge)Source code -- android
			if (window.WebViewJavascriptBridge) {
				callback(window.WebViewJavascriptBridge);
			} else {
				document.addEventListener(
					'WebViewJavascriptBridgeReady',
					function () {
						callback(window.WebViewJavascriptBridge);
					},
					false,
				);
			}
		} else {
			// The following is[WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge)Source code -- ios
			if (window.WebViewJavascriptBridge) {
				return callback(window.WebViewJavascriptBridge);
			}
			if (window.WVJBCallbacks) {
				return window.WVJBCallbacks.push(callback);
			}
			window.WVJBCallbacks = [callback];
			const WVJBIframe = document.createElement('iframe');
			WVJBIframe.style.display = 'none';
			WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
			document.documentElement.appendChild(WVJBIframe);
			setTimeout(function () {
				document.documentElement.removeChild(WVJBIframe);
			}, 0);
		}
	}

	/**
	 * The front end calls the native method
	 * @param {any} payload
	 * The payload parameter is defined through negotiation with native
	 * @example
	 * {
	 *    type: 'nativeMethodType',
	 *    data: 'data from front'
	 * }
	 */
	callHandler(payload, callback) {
		const { debug, nativeHandlerName } = this.options;
		let _resolve;
		let _reject;
		// Generate promise object, keep resolve and reject
		const readyPromise = new Promise((resolve, reject) => {
			_resolve = resolve;
			_reject = reject;
		});

		debug &&
			console.info(`[VueJsBridge] Start calling NativeHandler with payload:`, payload);
		this.init(function (bridge) {
			try {
				bridge.callHandler(nativeHandlerName, payload, response => {
					debug && console.info(`[VueJsBridge] Success response:`, response);

					const rtnData = typeof response === 'string' ? JSON.parse(response) : response;
					if (typeof callback === 'function') {
						callback(rtnData);
					}

					// The call is successful, use the reserved resolve to change the returned promise state
					_resolve(response);
				});
			} catch (e) {
				debug && console.info(`[VueJsBridge] Failed error:`, e);
				// The call is successful, use the reserved reject to change the returned promise state
				_reject(e);
			}
		});
		return readyPromise;
	}

	/**
	 * Register to provide native call methods
	 * @param {string} name Method name
	 * @param {Function} fn Callback method, two parameters data, callback
	 * The first parameter is the data passed by native data
	 * The second parameter is the callback function provided by native. After the front-end processing is completed, native can be notified through callback.
	 */
	registerHandler(name, fn) {
		const { delay } = this.options;
		// Bridge initialization takes time, delay processing registration method
		setTimeout(() => {
			this.init(bridge => {
				// bridge.registerHandler(name, fn);
				// FIXME: 이전 프로젝트에서 jQuery에 바인딩하여사용하였으므로 호환성을 위해 아래와 같이 정의
				globalThis.$[name] = fn;
			});
		}, delay);
	}
}
