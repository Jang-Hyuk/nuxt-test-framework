require('module-alias/register');
// 환경 변수 설정 (dotenv 기준)
require.main === module &&
	require('be/config/baseConnConfig').initProcessEnv({ beApiPrefix: '/api' });

const logger = require('be/loaders/logger')();

const { app, initServer, runServer } = require('be/app');

const { backendOption } = require('be/config');

// Express App 초기화 (middleware binding, logging, setting DB, ...etc)
initServer();

module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
	// console.log('backendOption', backendOption);
	// 백엔드 모드로 움직인다는 것을 확인
	backendOption.isBackendMode = true;

	// Express app listening
	runServer();

	const loggerInstance = logger.init('error');

	process.on('uncaughtException', err => {
		loggerInstance.error('uncaughtException', err);
	});

	process.on('unhandledRejection', err => {
		loggerInstance.error('unhandledRejection', err);
	});
}
