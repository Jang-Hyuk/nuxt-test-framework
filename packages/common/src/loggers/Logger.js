const util = require('util');
const chalk = require('chalk');

const dateUtil = require('cm/utils/date');

class Logger {
	#colorOption = {
		purple: chalk.keyword('purple'),
		green: chalk.green,
		blue: chalk.blue,
		blueBright: chalk.blueBright,
		red: chalk.red,
		yellow: chalk.yellow,
		orange: chalk.keyword('orange'),
	};

	/** @type {icLogger.Logger.Configure}  */
	configure = {
		viewOption: {
			isFileName: true,
			isFnName: true,
			isTime: true,
			isTimeMs: true,
		},
		logLevel: 'info',
	};

	/** @enum {number} logLevel ENUM */
	logLevelEnumOpt = {
		error: 0,
		warn: 1,
		info: 2,
		http: 3,
		verbose: 4,
		debug: 5,
		silly: 6,
	};

	/** @readonly npm Log Level List */
	logLevelOpts = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

	/** @param {icLogger.Logger.Constructor} [opt] */
	constructor(opt) {
		this.fileLogger = opt?.fileLogger;
		this.configure = opt?.loggerConfig || this.configure;
	}

	/**
	 * @param {string} debugId debug id
	 */
	init(debugId) {
		return this;
	}

	/** Logger Header를 볼지 여부 */
	get isViewLog() {
		return Object.values(this.configure.viewOption).some(isView => isView);
	}

	/** @returns {number} 앱 로그 레벨 반환 */
	get logLevelRank() {
		return this.logLevelEnumOpt[this.configure.logLevel] ?? 0;
	}

	/**
	 * logHeader, logFooter 사이에 메시지 입력
	 * @param {any[]} messages 로깅 메시지 목록
	 */
	cLog(...messages) {
		// 콜 스택 callstack[call -> cLog -> #consoleLog -> #getRefineStackTrace -> #getStackTrace]
		this.#consoleLog(3, messages);
	}

	/**
	 * 콜스택을 string 으로 변환하여 반환
	 * @param {number} maxCount callStack 가져올 갯수
	 */
	cLogCallStack(maxCount = 1) {
		// 콜 스택 callstack[call -> cLogCallStack -> getCallStack -> #getRefineStackTrace -> #getStackTrace]
		console.log(this.#getCallStack(3, maxCount).join('\n'));
	}

	/**
	 * (default: inspect 10) Console Log Inspect
	 * @param  {any[]} messages 로깅 메시지 목록
	 */
	cLogInspect(...messages) {
		// 콜 스택 callstack[call -> cLogInspect -> #consoleLog -> #getRefineStackTrace -> #getStackTrace]
		this.#consoleLog(
			3,
			...messages.map((logInfo, index) => {
				const delimiter = index % 2 !== 0 ? this.#colorOption.purple(' --> ') : '';

				return `${delimiter} ${util.inspect(logInfo, true, 5)}`;
			}),
		);
	}

	/**
	 * (default: inspect 10) Console Log Inspect by stackDepth
	 * @param  {{}|[]} message collection
	 * @param {number} depthInspect inspect depth number
	 */
	cLogInspectDepth(message, depthInspect) {
		// 콜 스택 callstack[call -> cLogInspectDepth -> #consoleLog -> #getRefineStackTrace -> #getStackTrace]
		this.#consoleLog(3, util.inspect(message, true, depthInspect));
	}

	/**
	 * Log Level Rank를 Lock Level 로 변환
	 * @param {number} logLevelRank npm logLevel
	 */
	convertLogRankToLevel(logLevelRank) {
		return this.logLevelOpts[logLevelRank] ?? this.configure.logLevel;
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	debug(...messages) {
		console.debug(messages);
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	error(...messages) {
		console.error(messages);
	}

	/**
	 *
	 * @param {any} message 메시지
	 * @param {number} [logLevelRank] 로그 레벨 우선 순위
	 * @param stackDepth callStack Depth (콜스택 추적 index)
	 */
	getLogInfo(message, logLevelRank, stackDepth = 2) {
		const [stackInfo] = this.#getRefineStackTrace(stackDepth);

		const logPrefixLevel = this.#toLogLevelColor(logLevelRank);
		return {
			logHeader: `${logPrefixLevel} ${this.#getLogHeader(stackInfo)}`,
			logBody: message,
			logFooter: `${logPrefixLevel} ${this.#getLogFooter(stackInfo)}`,
		};
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	http(...messages) {
		console.log(messages);
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	info(...messages) {
		console.info(messages);
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	silly(...messages) {
		console.log(messages);
	}

	/**
	 * Call Stack 반환
	 * @returns {{getFunctionName: Function, getLineNumber: Function, getColumnNumber: Function, getFileName: Function}[]} 콜 스택 반환
	 */
	#getStackTrace() {
		const orig = Error.prepareStackTrace;
		Error.prepareStackTrace = function (_, stack) {
			return stack;
		};
		const err = new Error();
		Error.captureStackTrace(err, this.#getStackTrace);

		const { stack } = err;
		Error.prepareStackTrace = orig;
		// @ts-ignore
		return stack;
	}

	/**
	 * stackDepth에 해당하는 callStack을 찾은 후 `refineCallStackInfo` 형태로 반환
	 * @param {number} [stackDepth=2] 콜 스택 callstack[call -> #getRefineStackTrace -> #getStackTrace]
	 * @param {number} [maxCount = 1] 콜스택 가져올
	 * @returns {icLogger.Logger.RefineCallStackInfo[]} 정제된 콜 스택
	 */
	#getRefineStackTrace(stackDepth = 2, maxCount = 1) {
		return this.#getStackTrace()
			.splice(stackDepth, maxCount)
			.map(stack => {
				/** @type {icLogger.Logger.RefineCallStackInfo} */
				const stackInfo = {
					fileName: `.${stack.getFileName().slice(process.cwd().length)}`,
					functionName: stack.getFunctionName(),
					lineNumber: `${stack.getLineNumber()}:${stack.getColumnNumber()}`,
				};

				return stackInfo;
			});
	}

	/**
	 * 콜스택을 string 으로 변환하여 반환
	 * @param {number} [stackDepth=2] 콜 스택 callstack[call -> #getRefineStackTrace -> #getStackTrace]
	 * @param {number} maxCount callStack 가져올 갯수
	 */
	#getCallStack(stackDepth = 2, maxCount = 1) {
		// 콜 스택 callstack[call -> getCallStack -> #getRefineStackTrace -> #getStackTrace]
		const callStackList = [];

		callStackList.push(`${this.#colorOption.orange('@@@')} Call Stack Start`);

		this.#getRefineStackTrace(stackDepth, maxCount).forEach(stackInfo => {
			const { fileName, functionName, lineNumber } = stackInfo;

			const strCallStack = [
				`(${this.#colorOption.red(functionName)})`,
				`.${this.#colorOption.green(fileName)}:${this.#colorOption.yellow(lineNumber)}`,
			].join(' ');

			callStackList.push(strCallStack);
		});

		callStackList.push(`${this.#colorOption.orange('@@@')} Call Stack End`);

		return callStackList;
	}

	/**
	 * 로그 헤더
	 * @param {icLogger.Logger.RefineCallStackInfo} stackInfo 정제된 콜 스택
	 * @returns {string} 로그 헤더 정보
	 */
	#getLogHeader(stackInfo) {
		const logHeaders = [];

		const { fileName, functionName, lineNumber } = stackInfo;

		const { isFileName, isFnName, isTime, isTimeMs } = this.configure.viewOption;

		isFileName &&
			logHeaders.push(
				`${this.#colorOption.green(fileName)}:${this.#colorOption.yellow(lineNumber)}`,
			);

		isFnName && logHeaders.push(this.#colorOption.red(functionName));

		isTime &&
			logHeaders.push(
				this.#colorOption.green(
					dateUtil.toString(new Date(), isTimeMs ? 'millisecond' : 'second'),
				),
			);

		return logHeaders.join(' ');
	}

	/**
	 * 로그 푸터
	 * @param {icLogger.Logger.RefineCallStackInfo} stackInfo 정제된 콜 스택
	 * @returns {string} 로그 푸터 정보
	 */
	#getLogFooter(stackInfo) {
		const logHeaders = [];

		const { fileName, functionName, lineNumber } = stackInfo;

		const { isFileName, isFnName, isTime, isTimeMs } = this.configure.viewOption;

		isFileName &&
			logHeaders.push(
				`${this.#colorOption.blue(fileName)}:${this.#colorOption.yellow(lineNumber)}`,
			);

		isFnName && logHeaders.push(this.#colorOption.red(functionName));

		isTime &&
			logHeaders.push(
				this.#colorOption.green(
					dateUtil.toString(new Date(), isTimeMs ? 'millisecond' : 'second'),
				),
			);

		return logHeaders.join(' ');
	}

	/**
	 * logLevel 값에 따라 색을 입혀서 반환
	 * @param {number} logLevel npm log Levels
	 * @returns 색상이 가미된 logLevelName
	 */
	#toLogLevelColor(logLevel) {
		const { error, warn, info, http, verbose, debug, silly } = this.logLevelEnumOpt;

		let logLevelName = this.logLevelOpts[logLevel];

		switch (logLevel) {
			case error:
				logLevelName = `❗ ${this.#colorOption.red(logLevelName)}`;
				break;
			case warn:
				logLevelName = `🔔 ${this.#colorOption.yellow(logLevelName)}`;
				break;
			case info:
				logLevelName = `➰ ${this.#colorOption.green(logLevelName)}`;
				break;
			case http:
				logLevelName = `🎈 ${this.#colorOption.green(logLevelName)}`;
				break;
			case verbose:
				logLevelName = `🕵️‍♀️ ${this.#colorOption.orange(logLevelName)}`;
				break;
			case debug:
				logLevelName = `🎆 ${this.#colorOption.blue(logLevelName)}`;
				break;
			case silly:
				logLevelName = `👓 ${this.#colorOption.purple(logLevelName)}`;
				break;
			default:
				break;
		}

		return logLevelName;
	}

	/**
	 * console.log 이용하여 출력
	 * @param {number} stackDepth callStack Depth (콜스택 추적 index)
	 * @param  {any[]} messages 로깅 메시지 목록
	 */
	#consoleLog(stackDepth = 2, ...messages) {
		// 콜 스택 callstack[call -> #getRefineStackTrace -> #getStackTrace]
		const [stackInfo] = this.#getRefineStackTrace(stackDepth);

		const logSet = new Set();

		logSet.add(this.#getLogHeader(stackInfo));

		messages.forEach(log => logSet.add(log));

		// logSet.add(this.#getLogFooter(stackInfo));

		console.log([...logSet].join('\n'));
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	verbose(...messages) {
		console.log(messages);
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	warn(...messages) {
		console.warn(messages);
	}
}

module.exports = Logger;
