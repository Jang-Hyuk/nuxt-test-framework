namespace ibServices {
	/** 로그인 시도 API 반환 값 */
	export type BaseReturn = {
		/* 메시지 */
		msg: string;
		/* 접속 반환 코드 (에러 타입 추적) */
		code: string;
	};
}
