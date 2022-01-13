const BaseUtil = require('../Base');

const baseUtil = new BaseUtil();

describe('baseUtil', () => {
	test('createUniqueValue', () => {
		// 26f14937-8dfc-4aa0-8d12-1b762adf0515 이런 형식으로 생성
		const uniqueValue = baseUtil.createUuid();
		expect(uniqueValue).toHaveLength(36);
		// 값은 다르게 생성되어야 한다
		expect(baseUtil.createUuid()).not.toBe(uniqueValue);
	});

	test('delay', () => {
		const DELAY_TIME = 1_000;
		jest.useFakeTimers();
		jest.spyOn(global, 'setTimeout');
		jest.spyOn(Promise, 'resolve');

		baseUtil.delay(DELAY_TIME);

		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), DELAY_TIME);

		jest.runAllTimers();
	});
});
