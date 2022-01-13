const _ = require('lodash');
const mysql = require('mysql2/promise');

const beConfig = require('be/config');
const { procedureTuples } = require('be/config/code');

const Database = require('./Database.js');

/**
 * Mysql 기본 조작을 처리하는 method 구성
 * @implements {ibModels.DatabaseMysql.Class}
 */
class DatabaseMysql extends Database {
	/** @type {Map<mysql.ConnectionOptions, DatabaseMysql>} */
	static #instanceStorage = new Map();

	dbName;

	/**
	 * No DI
	 * @param {object} opt
	 * @param {string} opt.dbKey db 생성 키
	 * @param {DIFC.Loggers['logger']} opt.logger
	 */
	constructor({ dbKey, logger }) {
		let dbOption = beConfig.dbConnect[dbKey];

		super({ dbOption });

		const {
			mainOption: { serverInfo },
			dbConnect,
		} = beConfig;

		// dbOption 실디비 여부에 따라 변경
		dbOption = serverInfo.isRealDB ? dbOption : dbConnect.test_db;

		const instance = DatabaseMysql.#instanceStorage.get(dbOption);

		// 이미 만들어진 인스턴스가 있다면 반환
		if (instance) {
			return instance;
		}

		// 풀 정의
		this.dbName = dbKey;
		/** @type {mysql.Pool} */
		this.pool = mysql.createPool(dbOption);

		// 저장소에 인스턴스 저장
		DatabaseMysql.#instanceStorage.set(dbOption, this);

		this.dbOption = dbOption;
		this.logger = logger.init('app:db');
	}

	/**
	 * logging sql
	 * @param {string} sql sql 문
	 * @param {any[]} [values] sql ? 값에 대응할 값 배열
	 * @param {boolean} [isViewSql] 완성된 쿼리문 볼지 여부
	 */
	consoleLogSql(sql, values, isViewSql) {
		// 로깅 뷰
		if (isViewSql) {
			const escapedValues = values.map(v => mysql.escape(v));
			const procedureName = sql.split('(').shift();

			this.logger.info(procedureName.concat(`(${escapedValues})`));
		}
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
		const { questions, values } = this.destructHash(_.pick(dataInfo, filterKeys));

		const autoSql = `${sql} (${questions})`;

		return this.executeProSql(autoSql, values, isViewSql);
	}

	/**
	 * Database Connection 을 얻고자 할 경우 (Pool 사용)
	 * @override
	 * @param {iDatabase.DBOption} dbOption db 접속 정보
	 * @returns {Promise<mysql.Connection>}
	 */
	async createConnection(dbOption) {
		const connection = await mysql.createConnection(dbOption);

		return connection;
	}

	/**
	 * 프로시저 질의 결과로 반환값이 존재할 경우 rows 형태로 반환
	 * @param {string} sql sql 문
	 * @param {any[]} [values] sql ? 값에 대응할 값 배열
	 * @param {boolean} [isViewSql] 완성된 쿼리문 볼지 여부
	 * @returns {Promise<*>} 리턴이 존재할 경우 mysql.RowDataPacket[] 으로 반환
	 * @example result
	 * 프로시저: [BinaryRow[], ResultSetHeader]
	 */
	async executeProSql(sql, values, isViewSql) {
		// sql 문이 프로시저인지 아닌지 판단
		const isProSql = sql.split(' ')[0].toLocaleLowerCase() === 'call';

		if (isProSql === false) {
			throw new Error(`sql:${sql}은 프로시저가 아닙니다.`);
		}

		const results = await this.executeSql(sql, values, isViewSql);

		// 프로시저 리턴값이 없을 경우 ResultSetHeader 형태로 넘어옴
		if (!Array.isArray(results)) {
			return results;
		}

		// ResultSetHeader(mysql가 자동생성) 를 제거하고 반환 (사용할 필요가 없을 것으로 보임)
		results.pop();

		// @ts-ignore
		return results;
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
	async executeProSqlByAuto(dbName, pName, dataInfo, option = {}) {
		const { isViewSql = false, resultFlag = '[0][0]' } = option;
		// dbName과 pName을 통해 프로시저 명 생성
		const procedureCommand = `CALL ${dbName}.${pName}`;

		// dbName과 pName을 통해 paramTuples 추출
		// @ts-ignore
		const filterKeys = procedureTuples[dbName][pName];

		// executeProSqlByFilter을 통해 프로시저 실행
		const resultRows = await this.executeProSqlByFilter(
			procedureCommand,
			dataInfo,
			// @ts-ignore dataInfo에 제네릭 연동이 안되서 object 로 둠
			filterKeys,
			isViewSql,
		);

		switch (resultFlag) {
			case '':
				return resultRows;
			case '[0]':
				return resultRows[0];
			case '[1]':
				return resultRows[1];
			case '[0][0]':
				return resultRows[0][0];
			default:
				return resultRows;
		}
	}

	/**
	 * 프로시저 sql과 데이터 객체, 가지고 올 keys를 이용하여 프로시저 질의
	 * @param {string} sql
	 * @param {object} dataInfo
	 * @param {string[]} [filterKeys] Object.keys(dataInfo)
	 * @param {boolean} [isViewSql]
	 * @example
	 * sql -> CALL c_session.p_smtphone_logIn
	 * dataInfo -> {a: 1, b: 'xxx', c: true}
	 * filterKeys -> ['c', 'a']
	 * result
	 * proExecuteSql('CALL c_session.p_smtphone_logIn(?, ?)', [true, 1])
	 */

	/**
	 * 준비된 명령문 사용하여 질의(LRU 캐시). 준비된 명령문으로 MySQL은 동일한 쿼리를 위해 매번 계획을 준비할 필요가 없고, 성능이 더 좋아진다.
	 * @param {string} sql sql 문
	 * @param {any[]} [values] sql (?) 값에 대응할 값 배열
	 * @param {boolean} [isViewSql] 완성된 쿼리문 볼지 여부
	 * @example result
	 * 프로시저: [BinaryRow[], ResultSetHeader]
	 * 쿼리(select): BinaryRow[]
	 * 쿼리(insert, update, delete): ResultSetHeader
	 */
	async executeSql(sql, values, isViewSql) {
		// try {
		// 로깅 뷰
		this.consoleLogSql(sql, values, isViewSql);

		const [resultExecute] = await this.pool.execute(sql, values);

		return resultExecute;
		// } catch (error) {
		// 	this.logger.init('error').error(error);

		// 	throw error;
		// }
	}

	/**
	 * select 쿼리만 사용 가능
	 * @param {string} sql sql 문
	 * @param {any[]} [values] sql ? 값에 대응할 값 배열
	 * @param {boolean} [isViewSql] 완성된 쿼리문 볼지 여부
	 * @returns {Promise<any[]>}
	 */
	async querySql(sql, values, isViewSql) {
		// try {
		// this.consoleLogSql(sql, values, isViewSql);

		const [rows] = await this.pool.query(sql, values);

		// @ts-ignore
		return rows;
		// } catch (error) {
		// 	this.logger.init('error').error(error);

		// 	throw error;
		// }
	}
}

module.exports = DatabaseMysql;
