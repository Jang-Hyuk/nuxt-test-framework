// import Vue from 'vue';
// // https://www.npmjs.com/package/vue-webview-js-bridge
// import VueJsBridge from 'vue-webview-js-bridge';

// Vue.use(VueJsBridge, {
// 	/** @type {boolean} 통화 정보 출력 */
// 	debug: true,
// 	/** @type {number} default 200 초기화에 필요한 시간, 지연 호출 시간, 단위 ms로 인한 registerHandler 실패 처리 */
// 	delay: 200,
// 	/** @type {string} 네이티브 개발자와 협상한 NativeHandlerName */
// 	nativeHandlerName: 'callFromWeb',
// 	/** @type {boolean} 개발 단계에서 mock 서비스를 활성화할지 여부는 mockHandler와 함께 사용해야 하며 둘 다 설정하면 mock이 적용됩니다 */
// 	mock: false,
// 	/**
// 	 * @description 개발 단계의 mockHandler 서비스는 Mock과 함께 사용해야 합니다. mock은 둘 다 설정되어야 적용됩니다. 함수입니다. 첫 번째 매개변수는 페이로드를 수신하고, 두 번째 매개변수는 브리지 콜백 함수를 수신합니다.
// 	 */
// 	mockHandler(payload, next) {
// 		console.log(payload);
// 		next(payload);
// 		// mock by payload
// 		// call next(data) to mock data
// 	},
// 	// ...
// });

import { getDeviceInfo } from './web-view-js-bridge/utils';

const deviceInfo = getDeviceInfo();

export default (ctx, inject) => {
	const bridges = () => {
		if (deviceInfo.windows) {
			globalThis.WebViewJavascriptBridge = () => {
				/**
				 *
				 */
				function callHandler(_cmd, _data, _callback) {
					if (typeof globalThis.$[_data.cmd] === 'function') {
						globalThis.$[_data.cmd](_data, _callback);
					} else if (typeof globalThis.failCmd === 'function') {
						globalThis.failCmd(_data);
					}
				}

				/**
				 *
				 */
				function registerHandler(_cmd, _callback) {
					this.WebViewJavascriptBridge.registerHandlerName = _cmd;
					window[this.WebViewJavascriptBridge.registerHandlerName] = _callback;
				}

				return {
					callHandler,
					registerHandler,
				};
			};
		}

		// bridge send action (callFromWeb)
		/**
		 *
		 */
		function emit(_data, _callback) {
			// eslint-disable-next-line no-use-before-define
			connectNative(() => {
				globalThis.WebViewJavascriptBridge.callHandler(
					'callFromWeb',
					_data,
					function (__data) {
						const rtnData = typeof __data === 'string' ? JSON.parse(__data) : __data;
						if (typeof _callback === 'function') {
							_callback(rtnData);
						}
					},
				);
			});
		}

		/**
		 * bridge event register
		 */
		function on(_cmd, _callback) {
			globalThis.$[_cmd] = _callback;
		}

		/**
		 *
		 */
		function connectNative(_callback) {
			if (globalThis.WebViewJavascriptBridge) {
				return _callback(globalThis.WebViewJavascriptBridge);
			}
			if (!deviceInfo.windows) {
				document.addEventListener(
					'WebViewJavascriptBridgeReady',
					function () {
						_callback(globalThis.WebViewJavascriptBridge);
					},
					false,
				);
			} else {
				if (globalThis.WVJBCallbacks) {
					return globalThis.WVJBCallbacks.push(_callback);
				}
				globalThis.WVJBCallbacks = [_callback];
			}

			// WebViewJavascriptBridge load indicator
			const WVJBIframe = document.createElement('iframe');
			WVJBIframe.style.display = 'none';
			WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
			document.documentElement.appendChild(WVJBIframe);
			setTimeout(function () {
				document.documentElement.removeChild(WVJBIframe);
			}, 0);
		}

		connectNative(_bridge => {
			if (!deviceInfo.windows) {
				_bridge.init((_message, _responseCallback) => {
					_responseCallback({ 'Javascript Responds': 'Wee!' });
				});
			}

			_bridge.registerHandler('NativeCallJS', (_data, _responseCallback) => {
				const rtnData = typeof _data === 'string' ? JSON.parse(_data) : _data;
				if (typeof globalThis.$[rtnData.cmd] === 'function') {
					globalThis.$[rtnData.cmd](rtnData, _responseCallback);
				}
			});
		});

		return {
			emit,
			on,
		};
	};
	const bridge = bridges();
	inject('bridge', bridge);
};
