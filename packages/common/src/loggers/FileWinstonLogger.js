const winston = require('winston');

require('winston-daily-rotate-file');

const { createLogger, format } = winston;

const FileLogger = require('./FileLogger.js');

const accessLogFormat = format.printf(({ level, message, label, timestamp }) => {
	return `${timestamp} ${message.slice(0, message.length - 1)}`;
});

class FileWinstonLogger extends FileLogger {
	accessHealthLoggerStream = {
		write: msg => {
			this.accessHealthLogger.http(msg);
		},
	};

	accessLoggerStream = {
		write: msg => {
			this.accessLogger.http(msg);
		},
	};

	formatOptions = [];

	/** 초기화 구동. fileLogger를 설정 */
	init() {
		// level => error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
		// const formatOptions = [];
		if (this.configure.isProduction) {
			this.formatOptions.push(format.combine(format.json()));
		} else {
			// 개발 모드는 json을 보기 쉽게
			this.formatOptions.push(format.prettyPrint());
		}

		this.#initFileLogger();

		this.#initAccessLogger();

		this.#initAccessHealthLogger();
	}

	#initFileLogger() {
		const transports = [];

		// 일반 로깅
		transports.push(
			new winston.transports.DailyRotateFile({
				level: 'silly',
				datePattern: 'YYYY-MM-DD',
				dirname: `${this.configure.logOption.logsDir}`,
				filename: `%DATE%.log`,
				// zippedArchive: true,
			}),
		);

		// Error 오류는 항상 error 로그에 저장
		transports.push(
			new winston.transports.DailyRotateFile({
				level: 'error',
				datePattern: 'YYYY-MM-DD',
				dirname: `${this.configure.logOption.logsDir}`,
				filename: `%DATE%.error.log`,
				// zippedArchive: true,
			}),
		);

		this.fileLogger = createLogger({
			level: this.configure.logOption.logLevel,
			levels: winston.config.npm.levels,
			exitOnError: false,
			format: winston.format.combine(
				format.errors({ stack: true }),
				format.json(),
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss.SSS',
				}),
				...this.formatOptions,
			),
			transports,
		});
	}

	/** 엑세스 로거 */
	#initAccessLogger() {
		const transports = [];

		// 일반 로깅
		transports.push(
			new winston.transports.DailyRotateFile({
				level: 'http',
				datePattern: 'YYYY-MM-DD',
				dirname: `${this.configure.logOption.logsDir}`,
				filename: '%DATE%.access.log',
				// zippedArchive: true,
			}),
		);

		this.accessLogger = createLogger({
			level: 'http',
			levels: winston.config.npm.levels,
			exitOnError: false,
			format: winston.format.combine(
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				accessLogFormat,
			),
			transports,
		});
	}

	/** 헬스 체크 로거  */
	#initAccessHealthLogger() {
		const transports = [];

		// 일반 로깅
		transports.push(
			new winston.transports.DailyRotateFile({
				level: 'http',
				datePattern: 'YYYY-MM-DD',
				dirname: `${this.configure.logOption.logsDir}`,
				filename: '%DATE%.healthcheck.log',
				// zippedArchive: true,
			}),
		);

		this.accessHealthLogger = createLogger({
			level: 'http',
			levels: winston.config.npm.levels,
			exitOnError: false,
			format: winston.format.combine(
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				accessLogFormat,
			),
			transports,
		});
	}

	/**
	 * access logger 기록
	 * @param {string} message 로깅할 메시지 정보 목록
	 */
	writeAccessLogFile(message) {
		this.accessLogger.http(message);
	}

	/**
	 * 파일 로깅 -> logLevel에 따라 파일단위로 떨구는 작업.
	 * @param {string} [logLevel=info] 로그 레벨
	 * @param {any[]} [messages] 로깅할 메시지 정보 목록
	 */
	writeFile(logLevel = 'info', messages) {
		if (this.fileLogger) {
			// 프로덕션 모드 (NODE_ENV: production or staging)일 경우 한줄로 보여야함
			let logMessages = messages;
			if (this.configure.isProduction) {
				logMessages = messages.map(msg => {
					if (msg instanceof Error) {
						const { message, name, stack } = msg;
						return { message, name, stack };
					}
					return msg;
				});
			}

			this.fileLogger[logLevel] !== undefined && this.fileLogger[logLevel](logMessages);
		}
	}
}

module.exports = FileWinstonLogger;
