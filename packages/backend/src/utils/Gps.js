const _ = require('lodash');

class BeGpsUtil {
	/** @param {import('be/types').DependencyInjection} opt */
	constructor(opt) {
		this.cookieUtil = opt.cookieUtil;
	}

	/**
	 * 두 지점(위도, 경도) 사이의 거리(km) 반환
	 * @param {number} lat1 위도 1
	 * @param {number} lon1 경도 1
	 * @param {number} lat2 위도 2
	 * @param {number} lon2 경도 2
	 * @param {number} precision 소수점 자리 수
	 * @returns {number} 두 지점 사이의 거리 (km)
	 */
	getDistance(lat1, lon1, lat2, lon2, precision = 1) {
		if (lat1 === lat2 && lon1 === lon2) {
			return 0;
		}

		const radLat1 = (Math.PI * lat1) / 180;
		const radLat2 = (Math.PI * lat2) / 180;
		const theta = lon1 - lon2;
		const radTheta = (Math.PI * theta) / 180;
		let dist =
			Math.sin(radLat1) * Math.sin(radLat2) +
			Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
		if (dist > 1) {
			dist = 1;
		}

		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515 * 1.609344 * 1000;

		return _.round(dist, precision);
	}

	/**
	 * 한국 내부 GPS 위치인지 여부 확인
	 * @param {number} latitude
	 * @param {number} longitude
	 */
	#isInsideKoreaGPS(latitude, longitude) {
		// 대한민국 위도 범위
		const minLatitude = 33.06;
		const maxLatitude = 38.27;
		const isValidLatitude = latitude >= minLatitude && latitude <= maxLatitude;
		// 대한민국 경도 범위
		const minLongitude = 125.04;
		const maxLongitude = 131.52;
		const isValidLongitude = longitude >= minLongitude && longitude <= maxLongitude;

		return isValidLatitude && isValidLongitude;
	}

	/**
	 * 클럽에서 사용할 주소 체계로 변환
	 * @param {string} siDo
	 * @param {string} siGunGu
	 * @param {string} eupMyeonDong
	 */
	#toAddress(siDo = '', siGunGu = '', eupMyeonDong = '') {
		if (siDo.length === 0) {
			return '';
		}

		return siGunGu.length ? `${siDo} ${siGunGu}` : `${siDo} ${eupMyeonDong}`;
	}
}

module.exports = BeGpsUtil;
