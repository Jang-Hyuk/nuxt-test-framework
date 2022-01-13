namespace ibModels {
	export namespace Database {
		export type Constructor = {
			dbOption: iDatabase.DBOption;
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
			pool: object;
			dbOption: iDatabase.DBOption;

			/* Database Connection 을 얻고자 할 경우  */
			createConnection(dbOption: iDatabase.DBOption): Promise<any>;
		}
	}
}
