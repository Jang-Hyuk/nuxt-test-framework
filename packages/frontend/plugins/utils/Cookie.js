import CmCookieUtil from 'cm/utils/Cookie';

export default class FeCookieUtil extends CmCookieUtil {
	#API_PATH = '/api/utils/cookie';

	/** @type {import('axios').default}  */
	#axios;

	/**
	 * @param {object} opt
	 * @param {import('http').IncomingMessage} opt.req
	 * @param {import('http').ServerResponse} opt.res
	 * @param {import('axios').default} opt.axios
	 */
	constructor(opt) {
		super(opt);

		const { axios } = opt;

		this.#axios = axios;
	}

	/**
	 * @param {string} name cookie name
	 * @param {import('cookie').CookieSerializeOptions} [option]
	 */
	async remove(name, option) {
		// TODO: 반환값으로 무언가 더 해야하는가?
		await this.#axios.delete(`${this.#API_PATH}/${name}`);
	}

	async removeAll() {
		// TODO: 반환값으로 무언가 더 해야하는가?
		await this.#axios.delete(this.#API_PATH);
	}

	/**
	 * @param {string} name cookie name
	 * @param {any} value cookie value 어떤 타입이 오더라도 string으로 변환하여 사용
	 * @param {import('cookie-universal').ICookieSetOpts['opts']} [option]
	 */
	async set(name, value, option) {
		// TODO: 반환값으로 무언가 더 해야하는가?
		await this.#axios.post(this.#API_PATH, {
			name,
			value,
			option,
		});
	}

	/**
	 * @param {string} name cookie name
	 * @param {any} value 어떤 타입이 오더라도 string으로 변환하여 사용
	 * @param {import('cookie-universal').ICookieSetOpts['opts']} [option]
	 */
	async setEncode(name, value, option) {
		await this.#axios.post(this.#API_PATH, {
			name,
			value: this.toEncode(value),
			option,
		});
	}
}
