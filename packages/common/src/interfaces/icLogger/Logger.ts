namespace icLogger {
	export namespace Logger {
		/** 로그인 시도 API 반환 값 */
		export type Configure = {
			/** 로그 해당 옵션 볼지 말지 */
			viewOption: {
				/** 파일 명 */
				isFileName: boolean;
				/** 함수 명 */
				isFnName: boolean;
				/** 시간 */
				isTime: boolean;
				/** 밀리세컨드 */
				isTimeMs: boolean;
			};
			/* npm log Level */
			logLevel: string;
		};

		export type Constructor = {
			/** LogUtil 설정 정보 */
			loggerConfig?: Configure;
			/** 파일 로거 객체 */
			fileLogger: DIFC.Loggers['fileLogger'];
			/** baseUtil 객체 */
		};

		/** Call Stack 프로퍼티 중 쓸만한 녀석만 string으로 반환 */
		export type RefineCallStackInfo = {
			/** 호출 파일 */
			fileName: string;
			/** 호출 함수&메소드 */
			functionName: string;
			/** 행:열 */
			lineNumber: string;
		};

		export interface Class {}
	}
}
