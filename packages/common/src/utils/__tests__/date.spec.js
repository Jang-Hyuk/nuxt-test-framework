const _ = require('lodash');
const dayjs = require('dayjs');
const dateUtil = require('../date');

describe('date 검증', () => {
	const activeDate = '2021-12-10 11:11';
	const passiveDate = '2021-10-15 13:30';

	test('convertValueToDayjs', () => {
		const { toDayjs } = dateUtil;

		// 숫자로 dayjs 객체 일치 여부
		const nDate = _.floor(new Date().getTime() / 1000);
		const currentDayjs = toDayjs(nDate);
		expect(nDate).toEqual(currentDayjs.unix());

		// 동일한 dayjs 객체를 반환하는지 판별
		const dayjsDate = dayjs();
		expect(toDayjs(dayjsDate)).toEqual(dayjsDate);

		const strDate = '2021-11-15 11:09';

		expect(toDayjs(strDate)).toEqual(dayjs(strDate));
	});

	test('getTextDate', () => {
		const targetDate = '2021-12-11 15:12:10:123';

		expect(dateUtil.toString(targetDate, 'millisecond')).toBe(targetDate);
		expect(dateUtil.toString(targetDate, 'second')).toBe('2021-12-11 15:12:10');
		expect(dateUtil.toString(targetDate)).toBe('2021-12-11 15:12:10');
		// @ts-ignore
		expect(dateUtil.toString(targetDate, 'customize')).toBe('2021-12-11 15:12:10');
		expect(dateUtil.toString(targetDate, 'minute')).toBe('2021-12-11 15:12');
		expect(dateUtil.toString(targetDate, 'hour')).toBe('2021-12-11 15');
		expect(dateUtil.toString(targetDate, 'day')).toBe('2021-12-11');
		expect(dateUtil.toString(targetDate, 'month')).toBe('2021-12');
		expect(dateUtil.toString(targetDate, 'year')).toBe('2021');
	});

	test('getDiffBetween', () => {
		const INTERVAL = 3;

		const currentDate = dayjs();

		const prevMsDate = currentDate.subtract(INTERVAL, 'millisecond');
		const prevSecDate = currentDate.subtract(INTERVAL, 'second');
		const prevMinDate = currentDate.subtract(INTERVAL, 'minute');
		const prevHourDate = currentDate.subtract(INTERVAL, 'hour');
		const prevDayDate = currentDate.subtract(INTERVAL, 'day');
		const prevMonthDate = currentDate.subtract(INTERVAL, 'month');

		expect(dateUtil.diff(prevMsDate, currentDate)).toEqual(-INTERVAL);
		expect(dateUtil.diff(prevSecDate, currentDate, 'second')).toBe(-INTERVAL);
		expect(dateUtil.diff(prevMinDate, currentDate, 'minute')).toBe(-INTERVAL);
		expect(dateUtil.diff(prevHourDate, currentDate, 'hour')).toBe(-INTERVAL);
		expect(dateUtil.diff(prevDayDate, currentDate, 'day')).toBe(-INTERVAL);
		expect(dateUtil.diff(prevMonthDate, currentDate, 'month')).toBe(-INTERVAL);

		expect(dateUtil.diff(activeDate, passiveDate, 'month')).toBe(1);

		expect(dateUtil.diff(-1, 'asds', 'millisecond')).toBeNaN();
	});

	test('isAfter', () => {
		// active 날짜는 time으로 볼대 높다
		expect(dayjs(activeDate).isAfter(passiveDate)).toBeTruthy();
		// year 년도까지 감안하면 같으므로 false
		expect(dayjs(activeDate).isAfter(passiveDate, 'year')).toBeFalsy();
		//
		expect(dayjs(activeDate).isAfter(passiveDate, 'month')).toBeTruthy();

		// 함수 검증
		expect(dateUtil.isAfter(activeDate, passiveDate)).toBeTruthy();
		expect(dateUtil.isAfter(activeDate, passiveDate, 'year')).toBeFalsy();
		expect(dateUtil.isAfter(activeDate, passiveDate, 'month')).toBeTruthy();
	});
});
