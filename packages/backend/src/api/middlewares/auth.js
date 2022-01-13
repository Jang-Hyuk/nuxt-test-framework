const createError = require('http-errors');

module.exports = {
	/** @type {import('express').RequestHandler} */
	isSignin(req, res, next) {
		throw new createError.Unauthorized('로그인이 필요합니다.');
	},

	/** @type {import('express').RequestHandler} */
	isSignout(req, res, next) {
		throw new createError.Forbidden('로그인한 사람은 할 수 없습니다.');
	},

	/** @type {import('express').RequestHandler} */
	isOfficeNetwork(req, res, next) {
		if (req.SC.clientUtil.isOfficeNetwork()) {
			return next();
		}

		throw new createError.Forbidden('권한이 부족합니다.');
	},
};
