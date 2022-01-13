class CmClientUtil {
	/** @type {string} 사용자 ip  */
	remoteAddress = '';

	/**
	 * @param {object} opt
	 * @param {import('./Cookie')} opt.cookieUtil
	 */
	constructor(opt) {
		const { cookieUtil } = opt;

		this.cookieUtil = cookieUtil;
	}

	/** 초기화 */
	init() {}

	/** 개발자 여부 */
	isDeveloper() {}

	/**
	 * 로그인 아이디가 테스트아이디인지 검사한다.
	 * @param {string} gccvId
	 */
	isMarketTestId(gccvId) {}

	/** 회사 ip 대역 여부 확인 127.0.0.1 일경우 앞 3자리(127.0.0)로 확인 */
	isOfficeNetwork() {}
}

module.exports = CmClientUtil;
