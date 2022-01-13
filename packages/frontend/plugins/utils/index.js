import Vue from 'vue';

import conversionUtil from 'cm/utils/conversion';
import validationUtil from 'cm/utils/validation';

import NuxtClient from './Client';
import NuxtCookie from './Cookie';
import NuxtDevice from './Device';

/** @type {import('@nuxt/types').Plugin} */
export default (ctx, inject) => {
	const { req, res, $axios } = ctx;

	/** server & client 에 따라 userAgent 반환 */
	function getUserAgent() {
		let userAgent = '';
		if (typeof ctx.req !== 'undefined') {
			userAgent = ctx.req.headers['user-agent'];
		} else if (typeof navigator !== 'undefined') {
			userAgent = navigator.userAgent;
		}
		return userAgent;
	}

	const makeFlags = () => {
		const userAgent = getUserAgent();

		const nuxtDeviceUtil = new NuxtDevice({
			userAgent,
		});

		const nuxtCookieUtil = new NuxtCookie({
			req,
			res,
			// @ts-ignore
			axios: $axios,
		});

		const nuxtClientUtil = new NuxtClient({
			// @ts-ignore
			axios: $axios,
			req,
			res,
			cookieUtil: nuxtCookieUtil,
		});

		nuxtClientUtil.init();

		return {
			nuxtClientUtil,
			nuxtCookieUtil,
			nuxtDeviceUtil,
		};
	};

	const createResizeFlags = () => {
		const userAgent = getUserAgent();

		const nuxtDeviceUtil = new NuxtDevice({
			userAgent,
		});
		return {
			nuxtDeviceUtil,
		};
	};

	const flags = makeFlags();
	const { nuxtClientUtil, nuxtCookieUtil, nuxtDeviceUtil } = flags;

	inject('conversion', conversionUtil);
	inject('valid', validationUtil);

	if (typeof window !== 'undefined') {
		inject('client', Vue.observable(nuxtClientUtil));
		inject('cookie', Vue.observable(nuxtCookieUtil));
		inject('device', Vue.observable(nuxtDeviceUtil));

		inject('utils', {
			// 생성자 있는 유틸
			client: Vue.observable(nuxtClientUtil),
			cookie: Vue.observable(nuxtCookieUtil),
			device: Vue.observable(nuxtDeviceUtil),
			// 생성자 없는 유틸
			conversion: conversionUtil,
			valid: validationUtil,
		});

		window.addEventListener('resize', () => {
			setTimeout(() => {
				const resizeFlags = createResizeFlags();

				ctx.$device = resizeFlags.nuxtDeviceUtil;
			}, 50);
		});
	} else {
		inject('client', nuxtClientUtil);
		inject('cookie', nuxtCookieUtil);
		inject('device', nuxtDeviceUtil);

		inject('utils', {
			// 생성자 있는 유틸
			client: nuxtClientUtil,
			cookie: nuxtCookieUtil,
			device: nuxtDeviceUtil,
			// 생성자 없는 유틸
			conversion: conversionUtil,
			valid: validationUtil,
		});
	}
};
