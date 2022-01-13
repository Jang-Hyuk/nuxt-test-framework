const debug = require('debug');

const LogUtil = require('./Logger');

class DebugLogger extends LogUtil {
	// console 에 찍어줄 로거
	#appDebug = debug('app');

	/**
	 * @param {string} debugId debug id
	 */
	init(debugId) {
		super.init(debugId);

		if (debugId.length === 0) {
			throw new SyntaxError('debugId는 존재해야합니다.');
		}

		this.#appDebug = debug(debugId);

		return this;
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	debug(...messages) {
		this.#debugLog(this.logLevelEnumOpt.debug, messages);
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	error(...messages) {
		this.#debugLog(this.logLevelEnumOpt.error, messages);
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	http(...messages) {
		this.#debugLog(this.logLevelEnumOpt.http, messages);
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	info(...messages) {
		this.#debugLog(this.logLevelEnumOpt.info, messages);
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	silly(...messages) {
		this.#debugLog(this.logLevelEnumOpt.silly, messages);
	}

	/**
	 * 로깅 수행(CLI & File)
	 * @param {number} logLevelRank 로그 레벨 우선 순위 (0으로 갈수록 우선 순위 높음)
	 * @param {any[]} messages 로깅할 메시지 정보 목록
	 */
	#debugLog(logLevelRank = -1, messages) {
		// 파일에 로깅
		this.fileLogger.writeFile(this.convertLogRankToLevel(logLevelRank), messages);

		// callstack[call -> logLevel -> debugLog -> getLogInfo -> #getRefineStackTrace -> #getStackTrace]
		const { logHeader } = this.getLogInfo(messages, logLevelRank, 4);

		// 로그를 볼 의향이 있고 사용자의 LogLevel이 로깅하고자 하는 LogLevel과 같거나 우선될 경우에만 로깅
		if (logLevelRank !== -1 && logLevelRank <= this.logLevelRank) {
			// 뷰 옵션이 존재하지 않는다면 header를 출력하지 않는다.
			this.isViewLog && this.#appDebug(logHeader);

			// @ts-ignore
			this.#appDebug(...messages);
		}
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	verbose(...messages) {
		this.#debugLog(this.logLevelEnumOpt.verbose, messages);
	}

	/** @param {any[]} messages 로깅할 메시지 정보 목록 */
	warn(...messages) {
		this.#debugLog(this.logLevelEnumOpt.warn, messages);
	}
}

module.exports = DebugLogger;
