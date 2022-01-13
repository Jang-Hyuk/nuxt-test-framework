const { resolve } = require('path');
const morgan = require('morgan');

let isBindMorgan = false;
/**
 * Logger 클래스의 생성자 인자 값으로 들어가는 목적으로 정의된 클래스
 */
class FileLogger {
	/** 헬스 체크 로거 */
	accessHealthLogger;

	/** 헬스 체크 로그 스트림 */
	accessHealthLoggerStream;

	/** 엑세스 로거 */
	accessLogger;

	/** 엑세스 로그 스트림 */
	accessLoggerStream;

	/** @type {icLogger.FileLogger.Configure} */
	configure = {
		isProduction: false,
		logOption: {
			logLevel: 'silly',
			logsDir: resolve(process.cwd(), 'logs'),
		},
	};

	/** Log File Writer */
	fileLogger;

	/**
	 * @param {object} opt 설정 정보
	 * @param {icLogger.FileLogger.Configure} [opt.fileLoggerConfig] 파일 로거 설정 정보
	 */
	constructor({ fileLoggerConfig }) {
		this.configure = fileLoggerConfig || this.configure;
	}

	/** 초기화 구동. fileLogger를 설정 */
	init() {}

	/**
	 * morgan.js에서 출력되는 로깅을 파일시스템에 저장하기 위한 바인딩 처리
	 * @param {import('express').Application} app
	 */
	bindMorganLogger(app) {
		if (isBindMorgan) {
			return false;
		}
		isBindMorgan = true;
		// @ts-ignore
		morgan.token('remote-real-addr', req => {
			if (req.headers['x-forwarded-for']) {
				return req.headers['x-forwarded-for'];
			}
			return req.socket.remoteAddress;
		});

		morgan.token('response-time-seconds', function (req, res) {
			return (this['response-time'](req, res) / 1000).toFixed(3);
		});

		// HTTP request logger middleware for node.js
		const morganFormat =
			':remote-real-addr :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent :response-time-seconds"';
		// 헬스 체크를 할 경우에는 다른 파일에 저장(헬스 체크를 SE에서 2초마다 호출하여 로깅이 과도하게 쌓이는 상태 해결)
		app.use(
			morgan(morganFormat, {
				skip: req => req.url.split('/').pop() === 'check-service-health',
				stream: this.accessLoggerStream,
			}),
		);

		app.use(
			morgan(morganFormat, {
				skip: req => req.url.split('/').pop() !== 'check-service-health',
				stream: this.accessHealthLoggerStream,
			}),
		);
	}

	/** console 출력 */
	logFile() {}

	/**
	 * access logger 기록
	 * @param {string} message 로깅할 메시지 정보 목록
	 */
	writeAccessLogFile(message) {}

	/**
	 * @interface
	 * 파일 로깅 -> logLevel에 따라 파일단위로 떨구는 작업.
	 * @param {string} [logLevel=info] npm Log Level
	 * @param {any[]} [messages] 로깅할 메시지 정보 목록
	 */
	writeFile(logLevel = 'info', messages) {}
}

module.exports = FileLogger;
