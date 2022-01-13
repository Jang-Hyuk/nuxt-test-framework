const { Joi, Segments, celebrate } = require('celebrate');

const route = require('express').Router();

/**
 * GET /api/auth
 * @summary This is the summary or description of the endpoint
 * @tags auth
 * @param {string} name.query.required - name param description - enum:type1,type2
 * @param {string[]} license.query - name param description
 * @returns {object} 200 - success response - application/json
 */
route.get('/', (req, res) => {
	res.status(200).end();
});

/**
 * @typedef {object} SignupInfo 회원 가입 입력 정보
 * @property {string} memId.required 회원 아이디
 * @property {string} passWd.required 비밀번호
 * @property {string} gpsCoord gpsCoord gps body 위치 정보. '|' 구분자로 위도|경도 표현
 */

/**
 * POST /api/auth/signup
 * @summary 회원 가입
 * @tags auth
 * @param {SignupInfo} request.body.required - 회원 가입 입력 정보
 * @returns {ApiMessage} 200 - success response - application/json
 */
route.post('/signup', (req, res, next) => {});

/**
 * @typedef {object} SigninInfo 로그인 회원 입력 정보
 * @property {string} memId 회원 아이디
 * @property {string} passWd 비밀번호
 * @property {string} memSlct 타입[b:일반회원,k:카카오,n:네이버]
 * @property {string} gpsCoord gpsCoord gps body 위치 정보. '|' 구분자로 위도|경도 표현
 */

/**
 * POST /api/auth/signin
 * @summary 로그인
 * @tags auth
 * @param {SigninInfo} request.body - 로그인 회원 입력 정보
 * @returns {ApiMessage} 200 - success response
 * @example request - payload example
 * {
 *   "memId": "tester",
 *   "passWd": "qwer1234",
 *   "memSlct": "b",
 *   "gpsCoord": "12.345|567.78"
 * }
 */
route.post(
	'/signin',
	celebrate({
		[Segments.BODY]: Joi.object({
			memId: Joi.string().alphanum().min(4).max(16).required(),
			passWd: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
			memSlct: Joi.string().regex(/b|k|n/).required(),
			gpsCoord: Joi.string().allow(''),
		}),
	}),
	async (req, res, next) => {
		try {
			// 로그인 처리 서비스 호출
			const apiMessage = await req.SC.baseService.getAsyncMethod(req.body);

			res.json(apiMessage);
		} catch (error) {
			next(error);
		}
	},
);

/**
 * POST /api/auth/signout
 * @summary 로그아웃
 * @tags auth
 * @returns {ApiMessage} 200 - success response - application/json
 */
route.post('/signout', async (req, res, next) => {
	req.SC.logger.debug(req.cookies);

	await req.SC.baseService.getAsyncMethod();

	res.json({
		code: '00000',
		msg: '로그아웃을 성공하였습니다.',
	});
});

module.exports = route;

/**
 * @typedef {object} ApiMessage
 * @property {string} msg return message
 * @property {string} code return Code
 * @property {string} accessToken accessToken
 */
