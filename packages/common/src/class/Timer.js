const dayjs = require('dayjs');

/** setTimeout을 사용하는 형식과 비슷하나, 요청 callback 수행까지의 남은 시간 반환, 일시 정지, 동작 상태 지원 */
module.exports = class {
	/** @type {Function} timer 시간이 되었을 때 실행할 콜백 함수 */
	#callback;

	/** @type {NodeJS.Timeout} setTimeout 반환 id  */
	#id;

	/** @type {number} callback 실행까지 남은 millisecond  */
	#remainMs = 0;

	/** @type {dayjs.Dayjs} 타이머 시작 시간  */
	#startDate;

	/** @type {boolean} Timer 동작 유무  */
	isRunning = false;

	/**
	 * @param {Function} callback
	 * @param {number} [delayMs = 0]
	 */
	constructor(callback, delayMs = 0) {
		this.#callback = callback;
		this.#remainMs = delayMs;
	}

	/**
	 * 요청 명령 실행까지의 남은 시간 반환
	 * @returns {number} Remained Millisecond
	 */
	getTimeLeft() {
		if (this.isRunning) {
			this.pause();
			this.start();
		}
		return this.#remainMs;
	}

	/** setTimeout 정지 (clearTimeout 처리함) */
	pause() {
		if (this.isRunning) {
			this.isRunning = false;
			clearTimeout(this.#id);
			this.#remainMs -= dayjs().diff(this.#startDate, 'date');

			return true;
		}
		return false;
	}

	/** setTimeout 재개 (setTimeout 처리함) */
	start() {
		if (this.isRunning !== true) {
			// 현 시각을 받아옴
			this.#startDate = dayjs();
			this.isRunning = true;
			this.#id = setTimeout(() => {
				this.#callback();
			}, this.#remainMs);

			return true;
		}

		return false;
	}
};
