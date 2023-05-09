const Cookies = require('cookie-universal');

const CmCookieUtil = require('cm/utils/Cookie');

class BeCookieUtil extends CmCookieUtil {
	/** @type {import('cookie-universal').ICookie} */
	#cookies;

	/** @type {import('cookie').CookieSerializeOptions}  */
	#cookieSetOption = {
		path: '/',
		// domain: '.club5678.com',
		// a boolean indicating whether the cookie is only to be sent over HTTPS
		secure: false,
		// a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (false by default).
		httpOnly: false,
		// a boolean or string indicating whether the cookie is a "same site" cookie (false by default). This can be set to 'strict', false'lax', 'none', or true (which maps to 'strict').
		sameSite: false,
		// a number representing the milliseconds from Date.now() for expiry
		maxAge: 24 * 60 * 60 * 1_000, // 24 hours
	};

	/** @param {import('be/types').DependencyInjection} opt */
	constructor(opt) {
		super(opt);

		const { req, res, logger } = opt;

		this.logger = logger;

		/** @type {Cookies.ICookie} */
		// @ts-ignore
		this.#cookies = Cookies(req, res, false);
	}

	/**
	 * @override
	 * 해당 쿠키 삭제
	 * FIXME: 쿠키를 설정하자마자 삭제하면 #cookie.remove 사용시 삭제가 토글되는 것으로 보임
	 * @param {string} name  cookie name
	 * @param {import('cookie').CookieSerializeOptions} [option]
	 */
	remove(name, option) {
		// 안될 경우 이걸로 대체해야 할 듯?
		// this.res.clearCookie(name);

		this.#cookies.remove(name, option);
	}

	/**
	 * 모든 쿠키 삭제
	 * FIXME: 쿠키를 설정하자마자 삭제하면 #cookie.remove 사용시 삭제가 토글되는 것으로 보임
	 */
	removeAll() {
		this.#cookies.removeAll();
	}

	/**
	 * @override
	 * 쿠키에 값 설정하기
	 * @param {string} name cookie name
	 * @param {any} value 어떤 타입이 오더라도 string으로 변환하여 사용
	 * @param {import('cookie').CookieSerializeOptions} [option]
	 */
	set(name, value, option = this.#cookieSetOption) {
		this.#cookies.set(name, value, option);
	}
}
module.exports = BeCookieUtil;
