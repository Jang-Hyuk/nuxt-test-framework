const _ = require('lodash');

const DeviceUtil = require('../Device');

describe('Utils Device', () => {
	const userAgentOption = {
		android: {
			template:
				'Mozilla/5.0 (Linux; Android 10; SM-G960N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36 <%= serviceName %>|a|4596e586c2355918|2.14.327|10',
			androidOption: {
				clubTong: 'CLUBTONG',
				partner: 'partner',
				nothing: 'OoO',
			},
		},
		web: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
		nothing:
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Nothing/537.36 (KHTML, like Gecko) Nothing/96.0.4664.45 Nothing/537.36',
	};

	const deviceUtil = new DeviceUtil({
		userAgent: userAgentOption.web,
	});

	const nothingUtil = new DeviceUtil({
		userAgent: userAgentOption.nothing,
	});

	test('base method check', () => {
		// compareVersion Test
		expect(deviceUtil.compareVersion('11.1.1', '10.0.0')).toBe(1);
		expect(deviceUtil.compareVersion('11.1', '10.0.0')).toBe(1);
		expect(deviceUtil.compareVersion('10.0.0', '10.0.0')).toBe(0);
		expect(deviceUtil.compareVersion('10.0.0', '10.0')).toBe(0);
		expect(deviceUtil.compareVersion('10.0.0', '11.1.1')).toBe(-1);

		const { isChrome } = nothingUtil.browser;

		expect(isChrome).toBeFalsy();
	});

	describe('android feature check', () => {
		const androidTemplate = _.template(userAgentOption.android.template);

		const clubTongDeviceUtil = new DeviceUtil({
			userAgent: androidTemplate({
				serviceName: userAgentOption.android.androidOption.clubTong,
			}),
		});

		const partnerDeviceUtil = new DeviceUtil({
			userAgent: androidTemplate({
				serviceName: userAgentOption.android.androidOption.partner,
			}),
		});

		const nothingDeviceUtil = new DeviceUtil({
			userAgent: androidTemplate({
				serviceName: userAgentOption.android.androidOption.nothing,
			}),
		});

		test('os & platform check', () => {
			const { isAndroid, isIos, isMacOS, isWindows } = clubTongDeviceUtil.os;

			expect(isAndroid).toBeTruthy();
			expect(isIos).toBeFalsy();
			expect(isMacOS).toBeFalsy();
			expect(isWindows).toBeFalsy();

			const {
				isCrawler,
				isDesktop,
				isDesktopOrTablet,
				isMobile,
				isMobileOrTablet,
				isTablet,
			} = clubTongDeviceUtil.platform;

			expect(isCrawler).toBeFalsy();
			expect(isDesktop).toBeFalsy();
			expect(isDesktopOrTablet).toBeFalsy();
			expect(isMobile).toBeTruthy();
			expect(isMobileOrTablet).toBeTruthy();
			expect(isTablet).toBeFalsy();

			const { isChrome, isEdge, isFirefox, isSafari, isSamsung } =
				clubTongDeviceUtil.browser;

			expect(isChrome).toBeTruthy();
			expect(isEdge).toBeFalsy();
			expect(isFirefox).toBeFalsy();
			expect(isSafari).toBeFalsy();
			expect(isSamsung).toBeFalsy();

			expect(clubTongDeviceUtil.mediaType).toBe(clubTongDeviceUtil.mediaOption.MOBILE);

			// appInfo 검증
			const { appName, appVer, phoneVer, smtpSlct, smtpId } = clubTongDeviceUtil.appInfo;
			expect(appName).toBe(userAgentOption.android.androidOption.clubTong);
			expect(smtpSlct).toBe('a');
			expect(smtpId).toBe('4596e586c2355918');
			expect(appVer).toBe('2.14.327');
			expect(phoneVer).toBe('10');
		});

		test('TongTong service check', () => {
			const { isApp, isClub5678, isNothing, isPartner, isTong } =
				clubTongDeviceUtil.services;

			// CLUBTONG
			expect(isApp).toBeTruthy();
			expect(isClub5678).toBeFalsy();
			expect(isNothing).toBeFalsy();
			expect(isPartner).toBeFalsy();
			// CLUBTONG
			expect(isTong).toBeTruthy();
		});

		test('Partener service check', () => {
			const { isApp, isClub5678, isNothing, isPartner, isTong } =
				partnerDeviceUtil.services;

			// Partner
			expect(isApp).toBeTruthy();
			expect(isClub5678).toBeFalsy();
			expect(isNothing).toBeFalsy();
			// Partner
			expect(isPartner).toBeTruthy();
			expect(isTong).toBeFalsy();
		});

		test('Nothing service check', () => {
			const { isApp, isClub5678, isNothing, isPartner, isTong } =
				nothingDeviceUtil.services;

			// Partner
			expect(isApp).toBeFalsy();
			expect(isClub5678).toBeFalsy();
			expect(isNothing).toBeTruthy();
			// Partner
			expect(isPartner).toBeFalsy();
			expect(isTong).toBeFalsy();
		});
	});
});
