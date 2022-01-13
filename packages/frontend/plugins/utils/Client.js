import CmClientUtil from 'cm/utils/Client';

export default class FeClientUtil extends CmClientUtil {
	#API_PATH = '/api/utils/client';

	#axios;

	#storage = {
		isDeveloper: false,
		isOfficeNetwork: false,
	};

	/**
	 * @param {object} opt
	 * @param {import('http').IncomingMessage} opt.req
	 * @param {import('http').ServerResponse} opt.res
	 * @param {import('axios').default} opt.axios
	 * @param {import('./Cookie').default} opt.cookieUtil
	 */
	constructor(opt) {
		super(opt);

		const { axios, cookieUtil } = opt;

		this.#axios = axios;
		this.cookieUtil = cookieUtil;
	}

	/** API 요청하여 remoteAddress를 기반하여 데이터 세팅 */
	async init() {
		// bac
		const response = await this.#axios.get(this.#API_PATH);

		const { isDeveloper, remoteAddress, isOfficeNetwork } = response.data;

		this.#storage = {
			isDeveloper,
			isOfficeNetwork,
		};

		this.remoteAddress = remoteAddress;

		// this.marketTestIdList = marketTestIdList;
	}

	/** 개발자 여부 */
	isDeveloper() {
		return this.#storage.isDeveloper;
	}

	/** 회사 ip 대역 여부 확인 127.0.0.1 일경우 앞 3자리(127.0.0)로 확인 */
	isOfficeNetwork() {
		return this.#storage.isOfficeNetwork;
	}
}
