const route = require('express').Router();

/**
 * @typedef {object} ServerLinkInfo
 * @property {string} id - 개발자 Id or Server Id
 * @property {string} name - 개발자 명 or 서버 명
 * @property {number} portIndex - (default: 0) 기준 Port에 더할 값 (서버마다 고유해야함)
 * @property {number} hostId - 개발자 회사 PC ip Host ID
 * @property {string} url - 호스팅 주소
 */

/**
 * Base Server Info
 * @typedef {object} ServerInfo
 * @property {boolean} isRealDB.required - 실 디비 여부
 * @property {boolean} isRealServer - 실 서버 여부
 * @property {array<ServerLinkInfo>} serverLinkList - 서버 링크 정보
 */

/**
 * GET /api/server
 * @summary 서버 구동 정보 요청
 * @tags server
 * @returns {ServerInfo} 200 - success response - application/json
 */
route.get('/', (req, res) => {
	res.json({});
});

module.exports = route;
