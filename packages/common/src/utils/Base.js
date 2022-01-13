const { v4: uuid } = require('uuid');

class CmBaseUtil {
	/**
	 * 문자열에서 HTML tags를 제거하고 반환
	 * @param {string} str
	 */
	addSlashes(str) {
		return (
			str
				.replace(/\\/g, '\\\\')
				// eslint-disable-next-line no-control-regex
				.replace(/\u0008/g, '\\b')
				.replace(/\t/g, '\\t')
				.replace(/\n/g, '\\n')
				.replace(/\f/g, '\\f')
				.replace(/\r/g, '\\r')
				.replace(/'/g, "\\'")
				.replace(/"/g, '\\"')
		);
	}

	/**
	 * UUID는 Universally Unique IDentifier의 약어
	 * legacy: uniqueId: 26f14937-8dfc-4aa0-8d12-1b762adf0515
	 */
	createUuid() {
		return uuid();
	}

	/**
	 * 지연 시간 대기 후 resolve 반환
	 * @param {number} timeMs millisecond
	 * @returns {Promise}
	 */
	delay(timeMs) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, timeMs);
		});
	}

	/**
	 * JSON.parse 할 수 있는 값인지 체크
	 * @param {any} item
	 */
	isJsonParse(item) {
		/** @type {string}  */
		const strItem = typeof item !== 'string' ? item.toString() : item;

		let jsonItem;

		try {
			jsonItem = JSON.parse(strItem);
		} catch (e) {
			return false;
		}

		if (typeof jsonItem === 'object' && jsonItem !== null) {
			return true;
		}

		return false;
	}

	/**
	 * 문자열에서 HTML tags를 제거하고 반환
	 * @param {string} str
	 */
	stripTags(str) {
		return str.replace(/(<([^>]+)>)/gi, '');
	}
}

module.exports = CmBaseUtil;
