const _ = require('lodash');
const Cookies = require('cookie-universal');

const conversionUtil = require('./conversion');

/**
 * Per User
 */
class CmCookieUtil {
	/** @type {Cookies.ICookie} */
	#cookies;

	conversionUtil = conversionUtil;

	/**
	 * @param {object} opt
	 * @param {import('http').IncomingMessage} opt.req
	 * @param {import('http').ServerResponse} opt.res
	 */
	constructor(opt) {
		const { req, res } = opt;

		/** @type {Cookies.ICookie} */
		// @ts-ignore
		this.#cookies = Cookies(req, res);
	}

	/**
	 * 쿠키에 설정된 값 가져오기
	 * @param {string} name cookie name
	 * @param {import('cookie-universal').ICookieGetOpts} [option]
	 */
	get(name, option) {
		return this.#cookies.get(name, option);
	}

	/**
	 * 쿠키에 설정된 값 모두 가져오기
	 * @param {import('cookie-universal').ICookieGetOpts} [option]
	 */
	getAll(option) {
		return this.#cookies.getAll(option);
	}

	/**
	 * 해당 쿠키 삭제
	 * @param {string} name cookie name
	 * @param {import('cookie').CookieSerializeOptions} [option]
	 */
	remove(name, option) {}

	/**
	 * 모든 쿠키 삭제
	 */
	removeAll() {}

	/**
	 * 쿠키에 값 설정하기
	 * @param {string} name cookie name
	 * @param {any} value 어떤 타입이 오더라도 string으로 변환하여 사용
	 * @param {import('cookie').CookieSerializeOptions} [option]
	 */
	set(name, value, option) {}

	/**
	 * 쿠키 값을 클럽 인코딩 처리 후 쿠키에 인코딩 쿠키값 설정하기
	 * @param {string} name cookie name
	 * @param {any} value 어떤 타입이 오더라도 string으로 변환하여 사용
	 * @param {import('cookie').CookieSerializeOptions} [option]
	 */
	setEncode(name, value, option) {}
}

module.exports = CmCookieUtil;
