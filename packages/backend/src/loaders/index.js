const awilix = require('awilix');

const { createContainer } = awilix;

const beCode = require('be/config/code');
const cmCode = require('cm/code');

const loggerLoader = require('./logger');
const expressLoader = require('./express');
const mysqlLoader = require('./database/mysql');
const dependencyInjector = require('./dependencyInjector');

/**
 * @param {object} opt loader setup
 * @param {import('express').Application} opt.expressApp express App
 */
module.exports = async ({ expressApp }) => {
	const container = createContainer();

	// set fileLogger.
	const logger = loggerLoader(container);
	// debugId를 app:loader로 정의
	logger.init('app:loader').info('✅ Logger loaded');

	global.logger = logger.init('app');

	// Database Connect 목록 수만큼 MysqlUtil 객체를 생성하고 container에 등록
	const dbStorage = mysqlLoader();
	logger.info('✅ mysqlUtil loaded');

	dependencyInjector.injectBase({ container, dbStorage });
	logger.info('✅ Dependency Injector loaded');

	// TODO Jobs Loader

	await expressLoader({ container, app: expressApp });
	logger.info('✅ Express loaded');

	// throw new Error('What Happend');
};
