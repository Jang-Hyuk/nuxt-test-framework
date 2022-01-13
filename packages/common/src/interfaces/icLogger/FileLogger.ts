namespace icLogger {
	export namespace FileLogger {
		/** FileLogger 구동 옵션 */
		export type Configure = {
			/** 파일 명 */
			logOption: {
				/** npm Log Level */
				logLevel: string;
				/** log를 기록할 폴더 */
				logsDir: string;
			};
			/* 로그 해당 옵션 볼지 말지 */
			isProduction: boolean;
		};

		export type Constructor = {
			/** LogUtil 설정 정보 */
			logUtilConfig?: Configure;
			/** 파일 로거 객체 */
			fileLogger: DIFC.Loggers['fileLogger'];
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
