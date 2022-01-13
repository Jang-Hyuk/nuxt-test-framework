const Timer = require('../Timer');

const callback = jest.fn(() => {});

const delayMs = 100;
// 단위 진행 시간
const processMs = 10;

describe('Timer', () => {
	test('timer 검증', () => {
		jest.useFakeTimers();

		const timer = new Timer(callback, delayMs);

		expect(timer.isRunning).toBeFalsy();

		// 타이머 시작
		timer.start();
		// 시작 되었으므로 상태값은 true
		expect(timer.isRunning).toBeTruthy();

		// 시작 한 후 바로 멈추었으나 millisecond 단위로 수행함.
		expect(timer.pause()).toBeTruthy();
		expect(timer.pause()).toBeFalsy();
		expect(delayMs - timer.getTimeLeft()).toBeGreaterThanOrEqual(0);
		// 미세하게 진행하나 10ms 보단 작다
		expect(delayMs - timer.getTimeLeft()).toBeLessThan(10);

		// 정지 상태에서 시작으로 전환
		expect(timer.start()).toBeTruthy();
		// 이미 시작된 상태
		expect(timer.start()).toBeFalsy();

		jest.advanceTimersByTime(processMs);

		// await baseUtil.delay(processMs);
		// 프로세스 시간이 지나면 남은 시간은 반영되어야 한다
		expect(timer.getTimeLeft()).toBeLessThanOrEqual(delayMs - processMs);

		jest.advanceTimersByTime(delayMs);

		// 시간이 지나고 난 후에는 콜백이 실행되었어야 한다
		expect(callback).toHaveBeenCalled();
	});
});
