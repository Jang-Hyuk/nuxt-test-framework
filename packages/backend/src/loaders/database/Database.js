/**
 * @class DB Pool 생성, db 질의에 대한 메소드는 기본적으로 pool을 기반으로 작성됨
 * @implements {ibModels.Database.Class}
 */
class Database {
	/** @type {iDatabase.DBOption}  */
	dbOption;

	/** Database Pool 객체 */
	pool;

	/**
	 * No DI
	 * @param {ibModels.Database.Constructor} opt
	 */
	constructor(opt) {
		const { dbOption } = opt;

		this.dbOption = dbOption;
	}

	/**
	 * Database Connection 을 얻고자 할 경우 (Pool 사용)
	 * @abstract
	 * @param {iDatabase.DBOption} dbOption db 접속 정보
	 * @returns {Promise} 커넥션 객체
	 */
	createConnection(dbOption) {
		return Promise.reject(new Error('Method not implemented'));
	}

	/**
	 * Database Connection 을 얻고자 할 경우 (Pool 사용)
	 * @abstract
	 * @param {iDatabase.DBOption} dbOption db 접속 정보
	 * @returns {Promise} Database Pool 객체
	 */
	createPool(dbOption) {
		return Promise.reject(new Error('Method not implemented'));
	}

	/**
	 * 객체를 keys, values, questions 로 해체하여 반환
	 * value가 undefined | null 일 경우 질의가 성립하지 않으므로 ''로 정의
	 * @param {object} dataHash 해쉬 자료 구조 데이터
	 */
	destructHash(dataHash) {
		return Object.keys(dataHash).reduce(
			(resultHash, key) => {
				const value = dataHash[key];

				const { values, keys, questions, equalSigns } = resultHash;

				keys.push(key);
				questions.push('?');

				// 배열이면 IN 구문으로 변경 (prepare statement 구문에서 배열 값을 인식하지 못함. string으로 변환한다하더라도...)
				if (Array.isArray(value)) {
					equalSigns.push(`${key} IN (${Array(value.length).fill('?').join(', ')})`);
					values.push(...value.map(v => v ?? ''));
				} else {
					equalSigns.push(`${key} = ?`);
					values.push(value ?? '');
				}

				return resultHash;
			},
			{
				keys: [],
				values: [],
				questions: [],
				equalSigns: [],
			},
		);
	}

	/**
	 * 프로시저 질의 결과로 반환값이 존재할 경우 rows 형태로 반환
	 * @abstract
	 * @param {string} sql sql 문
	 * @param {any[]} [values] sql ? 값에 대응할 값 배열
	 * @param {boolean} [isViewSql] 완성된 쿼리문 볼지 여부
	 * @returns {Promise<any>}
	 */
	executeProSql(sql, values, isViewSql) {
		return Promise.reject(new Error('Method not implemented'));
	}

	/**
	 * 프로시저 결과물에 대한 가공을 하지 않고 가지고 올 경우 사용
	 * @template {keyof ibProc} K - Database Name
	 * @template {keyof ibProc[K]} V - Procedure Name
	 * @param {K} dbName 프로시저 db 접두사
	 * @param {V} pName 프로시저 명
	 * @param {object} [dataInfo] 프로시저 실행에 필요한 데이터
	 * @param {object} [option] 프로시저 실행 옵션
	 * @param {boolean} [option.isViewSql = false] 질의문 터미널 출력 여부
	 * @param {'[0][0]' | '[0]' | '[1]' | ''} [option.resultFlag = '[0][0]'] 데이터 반환 형 지정
	 * @returns {Promise<any>}
	 * @example
	 * dbName -> c_session
	 * pName -> p_smtphone_logIn
	 * dataInfo -> {a: 1, b: 'xxx', c: true}
	 * config/code/procedureTuple 에서 params 값을 자동으로 찾아와 sql 생성 후 질의 후 반환
	 */
	executeProSqlByAuto(dbName, pName, dataInfo, option) {
		return Promise.reject(new Error('Method not implemented'));
	}

	/**
	 * 프로시저 sql과 데이터 객체, 가지고 올 keys를 이용하여 프로시저 질의
	 * @param {string} sql
	 * @param {object} dataInfo
	 * @param {string[]} [filterKeys] Object.keys(dataInfo)
	 * @param {boolean} [isViewSql]
	 * @returns {Promise<any>}
	 * @example
	 * sql -> CALL c_session.p_smtphone_logIn
	 * dataInfo -> {a: 1, b: 'xxx', c: true}
	 * filterKeys -> ['c', 'a']
	 */
	executeProSqlByFilter(sql, dataInfo, filterKeys = Object.keys(dataInfo), isViewSql) {
		return Promise.reject(new Error('Method not implemented'));
	}

	/**
	 * 준비된 명령문 사용하여 질의, 모든 쿼리 사용 가능
	 * @abstract
	 * @param {string} sql sql 문
	 * @param {any[]} [values] sql ? 값에 대응할 값 배열
	 * @param {boolean} [isViewSql] 완성된 쿼리문 볼지 여부
	 * @returns {Promise<any>}
	 * @example result
	 * 프로시저: [BinaryRow[], ResultSetHeader]
	 * 쿼리(select): BinaryRow[]
	 * 쿼리(insert, update, delete): ResultSetHeader
	 */
	executeSql(sql, values, isViewSql) {
		return Promise.reject(new Error('Method not implemented'));
	}

	/**
	 * select 쿼리만 사용 가능
	 * @abstract
	 * @param {string} sql sql 문
	 * @param {any[]} [values] sql ? 값에 대응할 값 배열
	 * @param {boolean} [isViewSql] 완성된 쿼리문 볼지 여부
	 * @returns {Promise<any[]>}
	 */
	querySql(sql, values, isViewSql) {
		return Promise.reject(new Error('Method not implemented'));
	}

	/**
	 * INSERT 일반 테이블
	 * @param {string} tblName Table 명
	 * @param {ibModels.Database.SqlOption} option 조회 옵션
	 */
	async insertRow(tblName, option) {
		const { sqlMainOption: insertOption = {}, isViewSql = false } = option ?? {};

		const { keys, questions, values } = this.destructHash(insertOption);

		if (keys.length === 0) {
			throw new Error('no information to insert into the db');
		}

		const sql = `INSERT INTO ${tblName} (${keys}) VALUES (${questions})`;

		const resultSetHeader = await this.executeSql(sql, values, isViewSql);

		return resultSetHeader;
	}

	/**
	 * simple SELECT 일반 테이블, where 절은 AND 조건
	 * @param {string} tblName Table 명
	 * @param {ibModels.Database.SqlOption} option 조회 옵션
	 */
	async selectRow(tblName, option) {
		const [row] = await this.selectRows(tblName, option);

		return row;
	}

	/**
	 * simple SELECT 일반 테이블, where 절은 AND 조건
	 * @param {string} tblName Table 명
	 * @param {ibModels.Database.SqlOption} option 조회 옵션
	 */
	async selectRows(tblName, option) {
		const { sqlMainOption: whereOption, isViewSql, tailSql = '' } = option;

		// 최종으로 완성될 sql 문 선언 및 가져올 테이블 설정
		let sql = `SELECT * FROM ${tblName} `;
		// query 절 `?` 에 매칭될 데이터 배열
		const { keys, values, equalSigns } = this.destructHash(whereOption);

		// where 절이 없다면 sql에 조건절 추가하지 않음
		if (keys.length) {
			// execute 요청을 하기위해 prepared statements 를 준비
			sql += `WHERE ${equalSigns.join(' AND ')} `;
		}

		// 사용자가 추가할 sql
		sql += tailSql;

		// 결과
		/**  @type {object[]} */
		// @ts-ignore
		const rows = await this.querySql(sql, values, isViewSql);

		return rows;
	}

	/**
	 * UPDATE 일반 테이블
	 * @param {string} tblName Table 명
	 * @param {ibModels.Database.SqlOption} option 업데이트 정보
	 */
	async updateTable(tblName, option) {
		const {
			sqlMainOption: whereOption,
			sqlUpdateOption,
			isViewSql,
			tailSql = '',
		} = option;

		// 업데이트 정보 객체
		const { values: updateValues, equalSigns: updateEqualSigns } =
			this.destructHash(sqlUpdateOption);

		const {
			keys: whereKeys,
			values: whereValues,
			equalSigns: whereEqualSigns,
		} = this.destructHash(whereOption);

		let sql = `UPDATE ${tblName} SET ${updateEqualSigns.join(', ')} `;

		if (whereKeys.length) {
			sql += ` WHERE ${whereEqualSigns.join(' AND ')}`;
		}

		// 사용자가 추가할 sql
		sql += tailSql;

		const resultSetHeader = await this.executeSql(
			sql,
			updateValues.concat(whereValues),
			isViewSql,
		);

		return resultSetHeader;
	}
}

module.exports = Database;
