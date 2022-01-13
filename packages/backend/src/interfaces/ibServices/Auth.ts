namespace ibServices {
	export namespace AuthService {
		/** 로그인 시도 API 반환 값 */
		export type LoginReturn = {
			/* 자동로그인 토큰. memId 와 memPwd를 이용하여 만듬 */
			accessToken?: string;
		} & BaseReturn;

		export interface Class {
			// ↓↓↓ constructor

			// ↓↓↓ property
			/* 로그인인디라 */
			signin(userInfo: iUser.UserLoginForm): Promise<LoginReturn>;
		}
	}
}
