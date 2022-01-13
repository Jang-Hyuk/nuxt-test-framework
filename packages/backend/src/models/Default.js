const mysql = require('mysql2');

module.exports = class {
	mysql = mysql;

	/**
	 * data escape 처리
	 * @param {any} data
	 * @returns
	 */
	escape(data) {
		return mysql.escape(data);
	}
};
