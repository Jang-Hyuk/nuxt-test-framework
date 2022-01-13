const _ = require('lodash');
const { v4: uuid } = require('uuid');
const Promise = require('bluebird');

const beConfig = require('be/config');

const DatabaseMysql = require('../DatabaseMysql');

jest.mock('../Database.js');

/** @type {import('cm/loggers/Logger')} */
// @ts-ignore
const logger = {
	init: () => logger,
	info: () => {},
	error: () => {},
};

describe('[Hyuk PC Only]', () => {
	const { local } = beConfig.dbConnect;

	describe('backendOption.isRealDB flag에 따른 DB 선택 분기 테스트', () => {
		// pool 이 동일하지 않아야 한다
		test('(isRealDB: true) Real DB 선택', () => {
			beConfig.mainOption.serverInfo.isRealDB = true;

			const localDB = new DatabaseMysql({
				dbKey: 'local',
				logger,
			});

			const localDBEuckr = new DatabaseMysql({
				dbKey: 'local_euckr',
				logger,
			});
			// pool 이 동일하지 않아야 한다
			expect(localDB.pool).not.toBe(localDBEuckr.pool);
		});

		// pool이 동일해야 한다
		test('(isRealDB: false) Test DB 선택', () => {
			beConfig.mainOption.serverInfo.isRealDB = false;

			const localDb = new DatabaseMysql({
				dbKey: 'local',
				logger,
			});

			const localDbEuckr = new DatabaseMysql({
				dbKey: 'local_euckr',
				logger,
			});

			expect(localDb.pool).toBe(localDbEuckr.pool);
		});
	});

	describe.skip('Database 테스트', () => {
		/** @type {import('be/loaders/database/Database')} */
		let db;

		beforeAll(() => {
			beConfig.mainOption.serverInfo.isRealDB = true;
			db = new DatabaseMysql({
				dbKey: 'local',
				logger,
			});

			// cloneLocalConfig.connectionLimit = 1;
		});

		/**
		 * pool에서 connection 개체를 얻어 비동기 insert 처리하는 함수
		 * @param {import('mysql2/promise').Pool} pool Mysql Pool
		 */
		async function asyncInsertRow(pool) {
			const conn = await pool.getConnection();
			try {
				const result = await conn.execute(
					'insert into member (user_id, name) values (?, ?)',
					[uuid(), 'hi'],
				);

				// 지연 1초
				await Promise.delay(1000 * 1);

				return result;
			} catch (error) {
				console.error(error);
			} finally {
				conn.release();
			}

			// console.timeEnd(uniqueId);
		}

		test('Database.js 생성 Test', async () => {
			// DB 커넥션 개체 생성
			const db2 = new DatabaseMysql({
				dbKey: 'local',
				logger,
			});

			// DB 커넥션 개체 생성
			const db3 = new DatabaseMysql({
				dbKey: 'local',
				logger,
			});

			// dbOption이 같다면 pool은 동일해야한다
			expect(db.pool).toEqual(db2.pool);

			expect(db2.pool).not.toEqual(db3.pool);

			const startTime = new Date();

			// 1개당 1초 지연이므로 2개를 수행하면 최소 2초 이상은 걸려야 한다
			await Promise.all([asyncInsertRow(db.pool), asyncInsertRow(db2.pool)]);

			const endTime = new Date().getTime() - startTime.getTime();
			// 2초 이상이 걸려야한다.
			expect(endTime).toBeGreaterThan(2000);

			const conn = await db.createConnection(local);

			const [rows] = await conn.query('select * from member limit 3');

			expect(rows).toHaveLength(3);

			const memberRows = await db.executeSql('select * from member limit ?', [2]);

			expect(memberRows).toHaveLength(2);
		});

		test('트랜잭션 성공 테스트', async () => {
			// 트랜잭션 테스트
			const conn = await db.pool.getConnection();

			const uniqueId = uuid();
			try {
				await conn.beginTransaction(); // 트랜잭션 적용 시작

				await conn.execute('insert into member (user_id, name) values (?, ?)', [
					uniqueId,
					'hi',
				]);
				// 지연 1초 줘봄
				await Promise.delay(1000 * 1);

				await conn.execute('update temp set count = count + 1 where id = ?', [1]);

				await conn.commit(); // 커밋
			} catch (err) {
				await conn.rollback(); // 롤백
			} finally {
				conn.release(); // conn 회수
			}

			// 트랜잭션 결과로 정상적으로 입력되어야 한다
			const rows = await db.querySql('select * from member where user_id = ?', [
				uniqueId,
			]);

			expect(rows).toHaveLength(1);
		});
	});

	describe.skip('Database Common Method 테스트', () => {
		/** @type {DatabaseMysql} */
		let dbMysql;

		/** @type {ibModels.Database.SqlOption} */
		const insertOption = {
			sqlMainOption: {
				user_id: uuid(),
				name: `날짜다${new Date().toLocaleDateString('ko-KR')}`,
			},
		};

		const TBL_MEMBER = 'member';

		beforeAll(() => {
			beConfig.mainOption.serverInfo.isRealDB = true;

			dbMysql = new DatabaseMysql({
				dbKey: 'local',
				logger,
			});
		});

		afterAll(async () => {
			// await mysqlUtil.pool.end();
		});

		test('select', async () => {
			const sqlMainOption = { name: 'hi', login_fail_count: 0 };

			// const tailSql = '';
			const tailSql = 'LIMIT 2';

			const rows = await dbMysql.selectRows(TBL_MEMBER, {
				sqlMainOption,
				tailSql,
			});

			expect(rows).toHaveLength(2);

			const row = await dbMysql.selectRow(TBL_MEMBER, {
				sqlMainOption,
				tailSql,
			});

			expect(row).toHaveProperty('address');

			const rowsByIn = await dbMysql.selectRows(TBL_MEMBER, {
				sqlMainOption: {
					member_seq: [1000, 1001, 1002],
				},
				isViewSql: false,
			});

			expect(rowsByIn).toHaveLength(3);
		});

		test('insert', async () => {
			const resultSetHeader = await dbMysql.insertRow(TBL_MEMBER, insertOption);
			// 입력된 rows는 1줄
			expect(resultSetHeader.affectedRows).toBe(1);

			// (UIX Error) 동일 내용으로 입력할 경우 에러 발생
			await expect(async () => {
				await dbMysql.insertRow(TBL_MEMBER, insertOption);
			}).rejects.toThrow();

			// (no insert data Error) 입력할 내용이 없다면 아래 내용으로 에러 발생 (메시지까지 확인)
			await expect(() =>
				dbMysql.insertRow(TBL_MEMBER, { sqlMainOption: {} }),
			).rejects.toThrow();
			await expect(() =>
				dbMysql.insertRow(TBL_MEMBER, { sqlMainOption: {} }),
			).rejects.toThrow(Error);
			await expect(() =>
				dbMysql.insertRow(TBL_MEMBER, { sqlMainOption: {} }),
			).rejects.not.toThrow(TypeError);
		});

		test('update', async () => {
			/** @type {ibModels.Database.SqlOption} */
			const updateOption = {
				sqlUpdateOption: {
					name: `updated${new Date().toLocaleDateString()}`,
					pw_salt: `솔트${new Date().getSeconds()}`,
				},
				sqlMainOption: {
					user_id: 'tester',
				},
			};

			const updatedResult = await dbMysql.updateTable(TBL_MEMBER, updateOption);
			// update 쿼리 충족 여부 테스트
			expect(updatedResult.affectedRows).toBe(1);

			const updatedRow = await dbMysql.selectRow(TBL_MEMBER, {
				sqlMainOption: updateOption.sqlMainOption,
			});

			// 업데이트된 항목의 값이 맞는지 체크
			expect(updatedRow.user_id).toBe('tester');

			updateOption.sqlMainOption = {
				member_seq: [1000, 1001, 1002],
			};
			const updateResults = await dbMysql.updateTable(TBL_MEMBER, updateOption);

			// Where In 구문이 포함된 업데이트 된 항목의 갯수가 일치하는지 체크
			expect(updateResults.affectedRows).toBe(
				// @ts-ignore
				updateOption.sqlMainOption.member_seq.length,
			);
		});
	});
});

describe.skip('[Devjs Only] database charset convert test', () => {
	// let dbEuckr;
	/** @type {DatabaseMysql} */
	let dbFastConts;

	beforeAll(() => {
		dbFastConts = new DatabaseMysql({
			dbKey: 'c_fast_conts',
			logger,
		});
	});

	test('빠른 만남 소개글 변경', async () => {
		const sqlProc = 'CALL c_fast_conts.p_fast_meet_201_cont_upd (?, ?)';

		/** @type {[Array<{s_return: number}>]} */
		// @ts-ignore
		const [contUpdRows] = await dbFastConts.executeSql(sqlProc, [21546392, '요맨']);

		expect(contUpdRows[0].s_return).toEqual(1);

		/** @type {[Array<{s_return: number}>]} */
		const [proContUpdRows] = await dbFastConts.executeProSql(sqlProc, [
			21546392,
			'요맨ㅇ_ㅇ',
		]);

		expect(proContUpdRows).toHaveLength(1);

		expect(proContUpdRows[0]).toHaveProperty('s_return');
		expect(proContUpdRows[0]).toEqual({ s_return: 1 });
	});

	test('빠른 만남 Real DB 인코딩 테스트', async () => {
		// const qMeetSqlOpt = {};

		const pagePerCnt = 1;

		/** @type {ibProc.c_fast_conts.p_fast_meet_list_v5_201.Param}  */
		const qMeetSqlInfo = {
			slatitude: 0,
			slongitude: 0,
			memNo: 21546392,
			memLoc: '',
			memSex: 'f',
			ordSlct: 0,
			photoYn: 'n',
			chrgrYn: 'n',
			pageNo: 1,
			pagePerCnt,
		};

		let dynamicSql = 'call c_fast_conts.p_fast_meet_list_v5_201 ';

		dynamicSql += _.chain(qMeetSqlInfo)
			.keys()
			.map(() => '?')
			.join(', ')
			.thru(strQuery => `(${strQuery})`)
			.value();

		/** @type {ibProc.c_fast_conts.p_fast_meet_list_v5_201.Returns}  */
		const [firstRows, secondRows] = await dbFastConts.executeProSql(
			dynamicSql,
			Object.values(qMeetSqlInfo),
		);

		expect(firstRows[0].cnt).toEqual(1);

		expect(secondRows).toHaveLength(pagePerCnt);
	});
});
