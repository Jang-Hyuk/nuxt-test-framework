namespace ibModels {
	export namespace DatabaseMysql {
		export type Constructor = {
			/** 백엔드 설정 정보 */ dbOption: iDatabase.DBOption;
			/** LogUtil */ logger: DIFC.Loggers['logger'];
		};

		/** Select Query Param */
		export type SqlOption = {
			/** (default: {}) where, insert 조건 {key: value, key: value, ...} */
			sqlMainOption: object;
			/** (default: {}) update 절 {key: value, key: value, ...} */
			sqlUpdateOption?: object;
			/** (default: '') 추가할 쿼리문 */
			tailSql?: string;
			/** 요청 sql Log 여부 */
			isViewSql?: boolean;
		};

		export interface Class {
			// ↓↓↓ constructor

			// ↓↓↓ property
			// instanceStorage: Map<import('mysql2/promise').ConnectionOptions, this>;
			pool: object;
			dbOption: iDatabase.DBOption;

			/* Database Connection 을 얻고자 할 경우  */
			createConnection(
				dbOption: iDatabase.DBOption,
			): Promise<import('mysql2/promise').Connection>;
		}
	}
}
