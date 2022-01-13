const _ = require('lodash');

class CmConversionUtil {
	/**
	 * utf8 -> base64로 인코딩
	 * @param {string} source
	 */
	toBase64(source) {
		return Buffer.from(source).toString('base64');
	}

	/**
	 * pairs 형식으로 된 문자열을 Dictionary 자료형으로 변환
	 * @param {string} pairs 클럽에서 사용되는 클럽 쿠키 값
	 * @param {string} [outerSep="|"] 프로퍼티 구분자
	 * @param {string} [innerSeq="="] key value 구분자
	 * @returns {object} Dictionary 자료형 ex) {NO:21540000, ID: wkd123}
	 * @example
	 * cookieValue => {string} NO=21540000|ID=wkd123
	 * returns => {NO:'21540000', ID: 'wkd123'}
	 */
	toDictionary(pairs = '', outerSep = '|', innerSeq = '=') {
		return _(pairs)
			.split(outerSep)
			.map(cookieChunk => cookieChunk.split(innerSeq))
			.fromPairs()
			.value();
	}

	/**
	 * encoding 포맷(base64, utf8, ...etc)을 다른 포맷으로 변환
	 * @param {string} source
	 * @param {BufferEncoding} from 원본 포맷
	 * @param {BufferEncoding} to 바꾸려는 포맷
	 */
	toEncode(source, from, to) {
		return Buffer.from(source, from).toString(to);
	}

	/**
	 * Dictionary 형식을 name=value|name2=value2 형식의 쌍으로 변환하여 반환
	 * @param {object} dict Dictionary
	 * @param {string} [outerSep="|"] 프로퍼티 구분자
	 * @param {string} [innerSeq="="] key value 구분자
	 * @returns {string} ex) NO=21540000|ID=wkd123
	 * @example
	 * obj => {NO:21540000, ID: wkd123}
	 * returns => {string} NO=21540000|ID=wkd123
	 */
	toPairs(dict = {}, outerSep = '|', innerSeq = '=') {
		return _.toPairs(dict)
			.map(([key, value]) => `${key}${innerSeq}${value}`)
			.join(outerSep);
	}

	/**
	 * replace All 처리
	 * @param {string} targetValue 변경할 대상 string
	 * @param {string|string[]} searchValue 검색할 string or object
	 * @param {string|string[]} [replaceValue = ''] 바꿀 string or object
	 * @returns {string} searchValue를 replacevalue로 모두 바꾸어 반환
	 * @example
	 * targetValue: ab_cd_
	 * searchValue: _
	 * replaceValue: -
	 * returns: ab-cd-
	 * @example
	 * targetValue: ab_cd_ef+gh+
	 * searchValue: ['_', '+']
	 * replaceValue: ['-', '@']
	 * returns: ab-cd-ef@fg@
	 */
	toReplaceAll(targetValue, searchValue, replaceValue = '') {
		const typeSearchValue = typeof searchValue;
		const typeReplaceValue = typeof replaceValue;

		// 둘다 string 일 경우
		if (typeSearchValue === 'string' && typeReplaceValue === 'string') {
			// @ts-ignore
			return targetValue.split(searchValue).join(replaceValue);
		}
		// 둘다 배열 일 경우
		if (Array.isArray(searchValue) && Array.isArray(replaceValue)) {
			return searchValue.reduce((value, searchWord, searchIndex) => {
				return value.split(searchWord).join(replaceValue[searchIndex]);
			}, targetValue);
		}
	}

	/**
	 * 어떤 타입이더라도 문자로 변환하여 반환
	 * @param {number | string | boolean | Array | object | Function | symbol | undefined} value
	 * @return {string}
	 * @example
	 * true | false -> 'true' | 'false'
	 * null -> 'null'
	 * function test(a){return a + 1} -> 'function test(a){return a + 1}'
	 * [1,    2] -> '[1,2]'
	 * {a: 1, b: '2'} -> '{"a":1,"b":"2"}'
	 * undefined -> ''
	 */
	toString(value) {
		switch (typeof value) {
			case 'string':
				return value;
			case 'boolean':
			case 'number':
			case 'bigint':
			case 'function':
			case 'symbol':
				return _.toString(value);
			case 'object':
				return JSON.stringify(value);
			case 'undefined':
				return '';
			default:
				return value.toString();
		}
	}

	/**
	 * base64 -> utf8 인코딩
	 * @param {string} source
	 */
	toUtf8(source) {
		return Buffer.from(source, 'base64').toString('utf8');
	}

	/**
	 * string을 ascii decimal로 치환 후 각 자리에 xor 연산 후 char로 변환
	 * @param {string} source
	 */
	toXor(source) {
		return Buffer.from(source)
			.map((decimal, index) => decimal ^ index)
			.toString();
	}
}

module.exports = new CmConversionUtil();

// string util encode
// 21519207_202108311634052663.jpg
// 2072=760W;:9==6<! $  %#%./)5vmy
// kossy2k2_202106091607579606.jpg
// knqp}7m5W;:9==8?) $## !..),5vmy
