namespace ifStore {
	export namespace Auth {
		/** 유저정보 */
		type UserInfo = {
			/** 쿠키 */
			cookie: string;
			/** 유저 번호 */
			memNo: number;
			/** 유저 아이디 */
			memId: string;
			/** 유저 닉네임 */
			memNick: string;
			/** 유저 비밀번호 */
			memPw: string;
			/** 로그인 방법 */
			memSlct: string;
			/** 유저 성별 */
			memSex: string;
		};
		export interface State {
			/** 유저 정보 */
			userInfo: UserInfo;
			/** 로그인 여부 */
			isLoggedIn: boolean;
			/** 회원가입 정보 저장용 */
			joinInfo: object;
			/** 주변 유저 정보 */
			nearMemList: Array<object>;
		}
		type S = State;

		export interface Getters extends GetterTree<S> {
			getUserInfo(state: S): UserInfo;

			getNearMemList(state: S): Array<Object>;
		}

		export interface Mutations extends MutationTree<S> {
			/** 유저 정보 */
			setUser(state: S, payload: UserInfo): void;
			/** 회원가입 임시저장용 정보 */
			setJoinInfo(state: S, payload: UserInfo): void;
		}

		/** 실명 인증 정보 */
		type CertifyNameInfo = {
			rName: string;
			rGen: string;
			bYear: number;
			bMonth: number;
			bDay: number;
		};

		export interface Actions extends ActionTree<S> {
			/** 로그인 */
			login(this: AT, ctx: AC<S>, payload: { username: string });
			// login(this: ActThis, ctx: ActCtx<S>, payload: { username: string });
			/** 로그아웃 */
			logout(this: AT, ctx: AC<S>);

			/** 회원가입 정보저장용 - 수정필요 */
			join(this: AT, ctx: AC<S>, payload: { userInfo: object });

			/** 실명인증 */
			certifyName(
				this: AT,
				ctx: AC<S>,
				certifyNameInfo: CertifyNameInfo,
			): Promise<string>;

			/** 실명인증으로 아이디 찾기 */
			findIdByName(this: AT, ctx: AC<S>, payload: { encAuthInfo: string }): Promise<any>;

			/** 폰인증으로 아이디 찾기 */
			findIdByPhone(this: AT, ctx: AC<S>, payload: { memDi: string }): Promise<any>;

			/** 실명인증으로 비밀번호 찾기 */
			findPwByName(
				this: AT,
				ctx: AC<S>,
				payload: { memId: string; encAuthInfo: string },
			): Promise<any>;

			/** 폰인증으로 비밀번호 찾기 */
			findPwByPhone(
				this: AT,
				ctx: AC<S>,
				payload: { memId: string; memDi: string },
			): Promise<any>;

			/** 회원탈퇴 */
			leave(this: AT, ctx: AC<S>, payload: { memId: string; inputPw: string });
		}
	}
}
