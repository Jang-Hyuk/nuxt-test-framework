const { dbConnect: dbConnectConfig } = require('be/config');

const loggerLoader = require('be/loaders/logger');
const DatabaseMysql = require('./DatabaseMysql');

module.exports = () => {
	/** @type {iDatabase.DBStorage} db 정보를 순회하며 MysqlUtil 정의 */
	// @ts-ignore
	const dbStorage = Object.keys(dbConnectConfig).reduce((db, dbKey) => {
		const database = new DatabaseMysql({
			dbKey,
			logger: loggerLoader().init('app:db'),
		});

		db[dbKey] = database;
		return db;
	}, {});

	return dbStorage;
};
