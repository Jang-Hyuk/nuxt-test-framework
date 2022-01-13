const createError = require('http-errors');

const { isOfficeNetwork } = require('be/api/middlewares/auth');

const route = require('express').Router();

/**
 * GET /api/dev
 * @summary This is the summary or description of the endpoint
 * @tags dev
 * @param {string} name.query.required - name param description - enum:type1,type2
 * @param {string[]} license.query - name param description
 * @returns {object} 200 - success response - application/json
 */
route.get('/', async (req, res) => {
	// const cookies = require('cookie-universal')(req, res, false);
	// cookies.set('direct-1', 'cookie-value');
	// cookies.set('direct-2', 1);

	// global.logger.debug('안녕 ?');

	// req.SC.logger.init('http:dev').debug('called api/dev');

	req.SC.cookieUtil.set('dev', 'value');

	// console.time('one');
	await new Promise(resolve => setTimeout(resolve, 0));
	// console.timeEnd('one');

	res.json(req.SC.cookieUtil.getAll());
});

route.get('/query', (req, res) => {
	req.SC.logger.debug(req.query);

	res.json(req.query);
});

route.get('/logging', (req, res, next) => {
	req.SC.logger.init('http:dev').debug(req.query);
});

route.get('/error', (req, res, next) => {
	req.SC.logger.init('http:dev').debug('called api/dev/error');

	throw new createError[403]();
});

/**
 * @typedef {object} sessionPacketCommandInfo
 * @property {string} toNo - 보낼 대상
 * @property {object} data - 내용
 */

/**
 * POST /api/dev/session-packet/{command}
 * @summary 세션 패킷 발송
 * @tags dev
 * @param {string} command.parameters.required - name param description
 * @param {sessionPacketCommandInfo} request.body.required - name param description
 * @returns {object} 200 - forbidden request response
 */
route.post('/session-packet/:command', isOfficeNetwork, async (req, res) => {
	const { command } = req.params;
	const { toNo = '', data } = req.body;

	try {
		if (toNo.length > 0) {
			// @ts-ignore
			await req.SC.sessionPacketUtil.sendMessageToMember(command, toNo, data);
		} else {
			// @ts-ignore
			await req.SC.sessionPacketUtil.sendMessage(command, data);
		}
		res.end();
	} catch (error) {
		res.status(400).end();
	}
});

/**
 * GET /api/dev/procedure
 * @summary 프로 시저 요청
 * @tags dev
 * @param {string} dbName.query - db 명
 * @param {string} proName.query - 프로시저명
 * @param {string} p1.query - name param description
 * @returns {object} 200 - success response - application/json
 */
route.get('/procedure', isOfficeNetwork, async (req, res, next) => {
	const {
		dbName,
		proName,
		p1,
		p2,
		p3,
		p4,
		p5,
		p6,
		p7,
		p8,
		p9,
		p10,
		p11,
		p12,
		p13,
		p14,
		p15,
		p16,
		p17,
		p18,
		p19,
		p20,
	} = req.query;

	const params = [
		p1,
		p2,
		p3,
		p4,
		p5,
		p6,
		p7,
		p8,
		p9,
		p10,
		p11,
		p12,
		p13,
		p14,
		p15,
		p16,
		p17,
		p18,
		p19,
		p20,
	];

	const undefinedIndex = params.findIndex(v => v === undefined);

	const paramInfo = params.splice(0, undefinedIndex).reduce((hash, v, index) => {
		hash[`p${index}`] = v;
		return hash;
	}, {});

	const sql = `CALL ${dbName}.${proName}`;

	const results = await req.SC.dbStorage.test_db.executeProSqlByFilter(
		sql,
		paramInfo,
		undefined,
		true,
	);

	res.json(results);
});

module.exports = route;
