namespace IProcedure {
	export type ResultDefineInfo = {
		/** (jsdoc @description) 결과 설명  */
		comment?: string;
		/** (jsdoc @example) 예제 */
		exampleList?: string[];
		/** 실제 결과 값을 백틱으로 감싼 값 */
		row: string;
	};

	export type ProcedureDefineInfo = {
		/** (jsdoc @description) 프로시저 description */
		comment?: string;
		/** 프로시저 파라메터 값울 백틱으로 감싼 값 */
		param?: string;
		/** 프로시저 요청 결과 */
		result?: {
			/** 요청 실패 시 */
			failList?: ResultDefineInfo[];
			successList?: ResultDefineInfo[];
		};
	};

	export type ProcedureStructure = {
		[procedureName: string]: ProcedureDefineInfo;
	};

	export type ExecuteResultInfo = {
		/** 결과 예제 */
		exampleList?: string[];
	} & ResultDefineInfo;

	export type ProcedureInfo = {
		/** 프로시저 이름 */
		procedureName: string;
		/** 프로시저 설명 */
		comment: string;
		/** 프로시저 파라미터 값 */
		paramList: {
			/** 프로퍼티 키 */
			propertyKey: string;
			/** 프로퍼티 타입(타입스크립트 기본 자료형) */
			propertyType: string;
			/** 프로퍼티 설명 */
			comment?: string;
		}[];
		result: ProcedureDefineInfo['result'];
	};
}
