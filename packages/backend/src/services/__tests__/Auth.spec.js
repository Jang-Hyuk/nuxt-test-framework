// @ts-nocheck
const createError = require('http-errors');

const MemberModel = require('be/models/Member');
const ClientUtil = require('be/utils/Client');
const CookieUtil = require('be/utils/Cookie');
const DeviceUtil = require('be/utils/Device');
const GpsUtil = require('be/utils/Gps');
const Logger = require('cm/loggers/Logger');

Object.keys(createError).forEach(fnName => {
	createError[fnName] = jest.fn(data => new Error(JSON.stringify(data)));
});

jest.mock('be/utils/Client');
jest.mock('be/utils/Cookie');
jest.mock('be/utils/Device');
jest.mock('be/utils/Gps');

jest.mock('be/models/Member');
jest.mock('cm/loggers/Logger');

const conversionUtil = require('cm/utils/conversion');
const AuthService = require('../Base');

const container = jest.fn();

/**
 *
 */
function getMockReturnValueOnce(value) {
	return jest.fn().mockReturnValueOnce(value);
}

describe.skip('Auth Service Test', () => {
	/** @type {AuthService}  */
	let authService;

	beforeEach(() => {
		authService = new AuthService({
			container,
			clientUtil: new ClientUtil(),
			cookieUtil: new CookieUtil(),
			deviceUtil: new DeviceUtil(),
			gpsUtil: new GpsUtil(),
			memberModel: new MemberModel(),
			logger: new Logger(),
		});

		authService.clientUtil.MEM_SLCT = {
			/** 일반 접속 */
			normal: 'b',
			kakao: 'k',
			naver: 'n',
		};
	});

	test('login', async () => {
		/** @type {iUser.UserLoginForm}  */
		const loginUser = {
			memId: 'test',
			passWd: '1234',
			gpsCoord: 'hihhi',
			memSlct: 'b',
		};

		/* Case 휴먼 아이디 체크 결과를 true로 함 */
		authService.memberModel.isInactiveAccount = jest
			.fn()
			.mockReturnValueOnce(true)
			.mockReturnValueOnce(false);

		await expect(authService.signin(loginUser)).rejects.toThrow(
			conversionUtil.toString({
				msg: '휴면아이디입니다.',
				code: '59053',
			}),
		);

		/* Case 회사 네트워크가 아니고 블록 Ip일 경우를 가정 */
		authService.clientUtil.isOfficeNetwork = getMockReturnValueOnce(false);
		authService.memberModel.isBlockIp = getMockReturnValueOnce(true);

		// 블럭 IP
		await expect(authService.signin(loginUser)).rejects.toThrow(
			conversionUtil.toString({
				msg: '차단아이피입니다.',
				code: '59003',
			}),
		);

		/* Case 클럽 로그인 요청 시 오류 프로퍼티로 인한 로그인 실패 검증 */
		authService.memberModel.p_smtphone_logIn = getMockReturnValueOnce({
			retVal: 0,
		}).mockReturnValue({});

		// const failLoginProperty = await authService.login(loginUser);
		// expect(failLoginProperty.code).toBe(loginError.loginFail.code);
		// 로그인 실패
		await expect(authService.signin(loginUser)).rejects.toThrow(
			conversionUtil.toString({
				msg: '로그인에 실패했습니다.',
				code: '99999',
			}),
		);

		/* Case 접속하는 회원 권한이 충분한지 체크 */
		authService.memberModel.p_pm_chat_group_mem_chk = getMockReturnValueOnce(true);

		await expect(authService.signin(loginUser)).rejects.toThrow(
			conversionUtil.toString({
				msg: '권한이 부족합니다.',
				code: '99999',
			}),
		);

		/* Case 접속하는 회원 권한이 충분한지 체크 */
		authService.memberModel.isAdmin = getMockReturnValueOnce(false);

		const successLogin = await authService.signin(loginUser);

		expect(successLogin).toHaveProperty('accessToken');
	});
});
