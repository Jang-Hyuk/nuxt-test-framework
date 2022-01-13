const Joi = require('joi');

class CmValidationUtil {
	/** 유저 이메일 */
	get isEmail() {
		return Joi.string().regex(
			/^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/,
		);
	}

	/** 유저 아이디 */
	get isMemberId() {
		return Joi.string()
			.alphanum()
			.regex(/^(?=.*[a-zA-Z])(?=.*[0-9])[0-9a-zA-Z]{4,10}$/)
			.min(4)
			.max(10);
	}

	/** 유저 닉네임 */
	get isNickName() {
		return Joi.string()
			.regex(/^[가-힣]+$/)
			.min(2)
			.max(8);
	}

	/** 유저 비밀번호 */
	get isPassword() {
		return Joi.string()
			.regex(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,12}$/)
			.min(6)
			.max(12);
	}

	/**
	 * 유효성 검증
	 * @param {*} value
	 * @param {Joi.Schema} scheme
	 * @returns
	 */
	isValidate(value, scheme) {
		return !scheme.validate(value).error;
	}
}

module.exports = new CmValidationUtil();
