// /**
//  * @typedef {object} ipInfo
//  * @property {boolean} isRange 범위
//  * @property {{start: number, end: number}} [range] 1 ~ 255
//  * @property {string} networkId 네트워크 ID
//  * @property {Record<string, string>} hostID 개발자 정보
//  */

module.exports = {
	officeIP: {
		gwangJu: {
			isRange: true,
			range: {
				start: 1,
				end: 255,
			},
			networkId: '123.123.123',
			hostIdList: [],
		},
	},
};
