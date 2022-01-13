class BaseService {
	/** @param {import('be/types').DependencyInjection} opt */
	constructor(opt) {
		const { baseUtil } = opt;

		this.baseUtil = baseUtil;
	}

	/**
	 * Temp
	 * @param {any} any
	 */
	getAsyncMethod(any) {
		return Promise.resolve(true);
	}
}
module.exports = BaseService;
