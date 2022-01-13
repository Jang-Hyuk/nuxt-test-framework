const crypto = require('crypto');
const Promise = require('bluebird');

/** ************************************************************************************************************** */
//* ************                                  Security 관련                                       *************
/** ************************************************************************************************************** */

class CmSecureUtil {
	/**
	 * Sha256 암호화.(Salt 첨가)
	 * @param {string} text 원데이터
	 * @param {string} [key] 암호화 키
	 * @returns {string} 암호화된 해시
	 */
	encryptSha256(text, key) {
		const secret = key == null || key === '' ? text : key;
		const hash = crypto.createHmac('sha256', secret).update(text).digest('hex');
		return hash;
	}

	genCryptoRandomByte(byte) {
		return crypto.randomBytes(byte || 16).toString('hex');
	}

	/**
	 * @description password를 암호화하여 반환. pbkdf2 알고리즘에 의하여 Sha512 알고리즘 사용한 3단계 암호화 기본.
	 * @param {string} password 패스워드
	 * @param {string} salt 암호화 소금
	 */
	async encryptPbkdf2(password, salt) {
		password = password == null ? '' : password;

		const pbkdf2 = Promise.promisify(crypto.pbkdf2);

		// password, salt, iterations, keylen, digest, callback)
		const hashPw = await pbkdf2(password, salt, 3, 64, 'sha512');

		return hashPw.toString('hex');
	}
}

module.exports = new CmSecureUtil();
