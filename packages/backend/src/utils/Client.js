const _ = require('lodash');

const code = require('be/config/code');

const CmClientUtil = require('cm/utils/Client');

class BeClientUtil extends CmClientUtil {
	#NATION_CODE = {
		korea: 'KR',
	};

	/** @param {import('be/types').DependencyInjection} opt */
	constructor(opt) {
		super(opt);

		const { remoteAddress = '127.0.0.1' } = opt;

		this.remoteAddress = remoteAddress;
	}

	get isConnectedLocal() {
		return this.remoteAddress === '1';
	}

	/** 회사 네트워크 ID에 포함되는지 체크 */
	findOfficeIpInfo(ipAddress = this.remoteAddress) {
		// 127.0.0.1 => 127.0.0
		const targetNetworkId = ipAddress.split('.').slice(0, 3).join('.');

		return _.find(code.server.ip.officeIP, { networkId: targetNetworkId });
	}

	/** 회사 ip 대역 여부 확인 127.0.0.1 일경우 앞 3자리(127.0.0)로 확인 */
	isOfficeNetwork(ipAddress = this.remoteAddress) {
		// localhost(개발 서버)로 접속할 경우 ipAddress는 '1' 이므로
		if (this.isConnectedLocal) {
			return true;
		}

		const officeIpInfo = this.findOfficeIpInfo(ipAddress);

		// 일치하는 정보를 못 찾았을 경우
		if (!officeIpInfo) {
			return false;
		}

		const { range: { start = 1, end = 254 } = {} } = officeIpInfo;

		const targetHostId = Number(ipAddress.split('.').pop());

		return _.inRange(targetHostId, start, end + 1);
	}
}
module.exports = BeClientUtil;
