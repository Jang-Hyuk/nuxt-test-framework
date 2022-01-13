/* *********************************************************
 * 날짜 관련 메소드 모음. dayjs API 제공 함수에 유사하게 작성
 ********************************************************* */

const dayjs = require('dayjs');

class CmDateUtil {
	/**
	 * 날짜 사이의 간격을 구함.
	 * @param {number|string|Date|dayjs.Dayjs} frontDate 앞 날짜
	 * @param {number|string|Date|dayjs.Dayjs} [backDate = new Date()] 뒷 날짜
	 * @param {dayjs.UnitTypeLong} [unit = 'millisecond'] 두 날짜간의 차
	 * @returns {number} 날짜 사이의 간격
	 * @example
	 * fontDate - backDate
	 */
	diff(frontDate, backDate = new Date(), unit = 'millisecond') {
		return dayjs(this.toDayjs(frontDate)).diff(this.toDayjs(backDate), unit);
	}

	/**
	 * 비교할려는 날이 비교 당하는 날을 지났는지 여부 activeDate > passiveDate ?
	 * @param {number|string|Date|dayjs.Dayjs} activeDate 비교를 할려는 날짜
	 * @param {number|string|Date|dayjs.Dayjs} [passiveDate = new Date()] 비교 당하는 날짜
	 * @param {dayjs.UnitTypeLong} [unit = 'millisecond'] 해당 단위 이하의 날짜는 무시하고 검증
	 * @returns {boolean} activeDate의 날짜가 더 오래되었는지 여부
	 * @example
	 * activeDate(2021-05-06) > passiveDate(2021-05-05) ? => true
	 * activeDate가 time으로 보았을 경우 더 큰지 여부
	 */
	isAfter(activeDate, passiveDate = new Date(), unit = 'millisecond') {
		return dayjs(this.toDayjs(activeDate)).isAfter(this.toDayjs(passiveDate), unit);
	}

	/**
	 * @param {number|string|Date|dayjs.Dayjs} [dateValue] 날짜
	 * @returns {dayjs.Dayjs}
	 */
	toDayjs(dateValue) {
		if (typeof dateValue === 'number') {
			return dayjs.unix(dateValue);
		}

		if (dateValue instanceof dayjs) {
			// @ts-ignore
			return dateValue;
		}

		return dayjs(dateValue);
	}

	/**
	 * @param {number|string|Date|dayjs.Dayjs} [date = new Date()] 앞 날짜
	 * @param {dayjs.UnitTypeLong} [unit = 'millisecond'] 단위
	 * @returns {string} 문자열 날짜
	 */
	toString(date = new Date(), unit = 'second') {
		let textDate = '';
		switch (unit) {
			case 'millisecond':
				textDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss:SSS');
				break;
			case 'second':
				textDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
				break;
			case 'minute':
				textDate = dayjs(date).format('YYYY-MM-DD HH:mm');
				break;
			case 'hour':
				textDate = dayjs(date).format('YYYY-MM-DD HH');
				break;
			case 'day':
				textDate = dayjs(date).format('YYYY-MM-DD');
				break;
			case 'month':
				textDate = dayjs(date).format('YYYY-MM');
				break;
			case 'year':
				textDate = dayjs(date).format('YYYY');
				break;
			default:
				textDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
				break;
		}

		return textDate;
	}
}

module.exports = new CmDateUtil();
