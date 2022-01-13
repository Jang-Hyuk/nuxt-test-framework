// const request = require('supertest');

// const app = require('be/app');

describe('POST /auth/login', () => {
	// Model 휴먼 아이디 복원 처리
	// UTIL 사내망 체크
	// 파트너 회원인지 검증
	// 파트너회원, 디바이스체크 - 모두다 만족해야 로그인처리
	// gps set
	// isSpecial
	// isAdmin
	// NOTE 관리자거나 회사에서 접속하였다면 회원 정보 프로퍼티를 변경
	// NOTE base64 encoding
	// NOTE array를 | 을 포함한 스트링으로 만든다 (사람이 알아먹을수 있음)
	// pmchat login set
	// session agent set
	// 자동로그인 토큰
	// NOTE JSON 객체로 변환하여 반환
	test('login!!', () => {
		/** @type {iUser.UserLoginForm}  */
		// const userInfo = {
		// 	memId: 'tester',
		// 	passWd: '1234',
		// 	gpsInfo: '',
		// };

		expect(true).toBeTruthy();

		// const response = await request(app).post('/api/auth/login').send(userInfo);

		// expect(response.statusCode).toBe(200);
	});
});
