/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-destructuring */
// @ts-nocheck

/**
 * Get data type
 * @param {*} o
 * @returns {string}
 */
export const type = function (o) {
	const types = {
		'[object Array]': 'array',
		'[object Date]': 'date',
		'[object RegExp]': 'regexp',
		'[object Object]': 'object',
		'[object Error]': 'error',
	};

	if (o == null) {
		return String(o);
	}
	return typeof o === 'object'
		? types[Object.prototype.toString.call(o)] || 'object'
		: typeof o;
};
/**
 * Dash to hump
 * @param { string } variable
 * @returns { string }
 */
export const toCamelCaseVar = variable => {
	return variable.replace(/\-(\w)/g, (_, letter) => letter.toUpperCase());
};

/**
 * Get device information
 */
export const getDeviceInfo = () => {
	const device = {};
	const ua = navigator.userAgent;

	// Android: 'Mozilla/5.0 (Linux; Android 10; SM-G960N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36 CLUBTONG|a|4596e586c2355918|2.14.327|10'

	const windows = ua.match(/(Windows Phone);?[\s\/]+([\d.]+)?/);
	const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	const ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);

	device.ios = false;
	device.android = false;
	device.windows = false;
	device.iphone = false;
	device.ipod = false;
	device.ipad = false;
	device.androidChrome = false;

	// Windows
	if (windows) {
		device.os = 'windows';
		device.osVersion = windows[2];
		device.windows = true;
	}
	// Android
	if (android && !windows) {
		device.os = 'android';
		device.osVersion = android[2];
		device.android = true;
		device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
	}
	if (ipad || iphone || ipod) {
		device.os = 'ios';
		device.ios = true;
	}
	// iOS
	if (iphone && !ipod) {
		device.osVersion = iphone[2].replace(/_/g, '.');
		device.iphone = true;
	}
	if (ipad) {
		device.osVersion = ipad[2].replace(/_/g, '.');
		device.ipad = true;
	}
	if (ipod) {
		device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
		device.iphone = true;
	}
	// iOS 8+ changed UA
	if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
		if (device.osVersion.split('.')[0] === '10') {
			device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
		}
	}
	device.iphonex = device.ios && screen.height === 812 && screen.width === 375;
	// Webview
	device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

	return device;
};
