const { resolve } = require('path');

const beConfig = require('be/config');

const DebugLogger = require('cm/loggers/DebugLogger');
const FileWinstonLogger = require('cm/loggers/FileWinstonLogger');
const { asClass, asValue } = require('awilix');

/**
 * @param {import('awilix').AwilixContainer} [container]
 */
module.exports = container => {
	const {
		mainOption: { isProduction, logOption, dirPathInfo },
	} = beConfig;

	/** @type {icLogger.FileLogger.Configure}  */
	const fileLoggerConfig = {
		isProduction,
		logOption: {
			logLevel: logOption.logLevel,
			logsDir: resolve(dirPathInfo.logPath),
		},
	};

	// 파일 로거 생성
	const fileLogger = new FileWinstonLogger({
		// 파일 로거를 생성하는데 필요한 옵션 설정
		fileLoggerConfig,
	});

	// 파일 로거 초기 설정
	fileLogger.init();

	const loggerInstance = new DebugLogger({
		fileLogger,
		loggerConfig: logOption,
	});

	// 의존성 주입 객체가 있다면 DI 주입
	if (container) {
		container.register({
			loggerConfig: asValue(logOption),
			fileLogger: asValue(fileLogger),
			logger: asClass(DebugLogger),
		});
	}

	return loggerInstance;
};
