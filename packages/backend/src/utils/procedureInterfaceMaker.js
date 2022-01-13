require('module-alias/register');

const _ = require('lodash');
const { resolve } = require('path');
const fs = require('fs');
const BaseUtil = require('be/utils/Base');

const backendSrcPath = resolve(__dirname, '..');
const procedureSrcPath = resolve(backendSrcPath, 'config/procedures');
const procedureInterfacePath = resolve(backendSrcPath, 'interfaces/ibProc');
const procedureJsPath = resolve(backendSrcPath, 'config/code/procedureTuples');

class ProcedureMaker {
	/** 프로시저 결과물 행 네이밍 튜플 */
	prefixNameList = ['first', 'second', 'third', 'fourth'];

	/**
	 * DB에서 사용되는 타입을 Js 원시타입으로 변환하여 반환
	 * @param {string} dataType
	 */
	convertDbTypeToJsType(dataType) {
		const realDataType = _.chain(dataType)
			.toUpper()
			.thru(realDataType => {
				return realDataType.split('(').shift();
			})
			.value();

		const stringList = [
			'CHAR',
			'VARCHAR',
			'TINYTEXT',
			'TEXT',
			'MEDIUMTEXT',
			'LONGTEXT',
			'JSON',
			'ENUM',
			// // 바이너리
			// 'BINARY',
			// 'VARBINARY',
			// 'TINYBLOB',
			// 'BLOB',
			// 'MEDIUMBLOB',
			// 'LONGBLOB',
		];
		const numberList = [
			'TINYINT',
			'SMALLINT',
			'MEDIUMINT',
			'INT',
			'BIGINT',
			'BIT',
			'FLOAT',
			'DOUBLE',
			'DECIMAL',
		];
		const dateList = ['DATE', 'TIME', 'YEAR', 'DATETIME', 'TIMESTAMP'];
		const bufferList = [
			'BINARY',
			'VARBINARY',
			'TINYBLOB',
			'BLOB',
			'MEDIUMBLOB',
			'LONGBLOB',
		];

		const caseList = {
			string: stringList.concat(bufferList),
			number: numberList,
			Date: dateList,
			// Buffer: bufferList,
		};

		return _.findKey(caseList, dataTypes => dataTypes.includes(realDataType));
	}

	/**
	 * 인터페이스 자동 생성 명령
	 * @param {string[]} [targetFiles]
	 */
	createInterfaceFile(targetFiles = []) {
		const procedureFiles = targetFiles.length
			? targetFiles
			: BaseUtil.getFiles(procedureSrcPath, ['js']);

		// 각 파일의 프로시저.md 를 읽어들여 Param과 Returns로 나누어 변환한다.
		procedureFiles.forEach(fileName => {
			const dbName = fileName.split('.')[0];
			/** @type {IProcedure.ProcedureStructure} 동적 로딩  */
			// eslint-disable-next-line global-require
			const procedureDoc = require(resolve(procedureSrcPath, fileName));

			const interfaceList = _.map(procedureDoc, (procedureInfo, procedureName) => {
				const { comment, param, result } = procedureInfo;
				// 파라메터 인터페이스 생성
				const paramInterface = this.refineTextParams(param);

				/** @type {IProcedure.ProcedureInfo} */
				const interfaceInfo = {
					procedureName,
					comment: comment ?? '',
					paramList: paramInterface,
					result,
				};

				return interfaceInfo;
			});

			// fs 모듈을 이용한 {filename}.ts 파일 생성
			this.writeInterface(dbName, interfaceList);

			this.writeJavascript(dbName, interfaceList);
		});
	}

	/**
	 * 프로시저 결과물을 인터페이스로 기록할 Text 생성
	 * @param {IProcedure.ExecuteResultInfo[]} executeResultList
	 * @param {boolean} [isSuccess] 성공 반환 여부. interface 변수 명 생성에 필요함
	 */
	createTextResultInterface(executeResultList, isSuccess = true) {
		const nameType = isSuccess ? 'Success' : 'Fail';

		const valueTemplate = _.template(`
    <%= comment %>
    const <%= valueName %>Info = <%= row %>
    export type <%= valueName %>Type = typeof <%= valueName %>Info
  `);

		return executeResultList.map((resultInfo, index) => {
			const { row, comment = '', exampleList = [] } = resultInfo;

			let commentTxt = '';

			// 주석이 존재할 경우
			if (comment.length || exampleList.length) {
				const exampleJsdocList = exampleList
					.map(exampleElement => `* ${exampleElement}`)
					.join('\n');

				const commentTemplate = _.template(`
          /**
            * <%= comment %> ${
							exampleList.length
								? `
            * @example
            <%= exampleJsdocList %>`
								: ''
						}
          */`);

				commentTxt = commentTemplate({
					comment,
					exampleJsdocList,
				});
			}
			return valueTemplate({
				comment: commentTxt,
				valueName: `${this.prefixNameList[index]}${nameType}`,
				row,
			});
		});
	}

	/** 프로시저 파라메터를 인터페이스 파일로 생성하기 위한 전처리 과정 */
	refineTextParams(fileContents = '') {
		// console.log(fileContents);
		// 파람 값 시작 인덱스
		const pParamStartIndex = fileContents.indexOf('(');
		// 파람 값 종료 인덱스
		const pParamEndIndex = fileContents.lastIndexOf(')');

		// 프로시저 파람값을 분석하여 유의미한 정보로 변환
		const paramContents = fileContents
			.slice(pParamStartIndex + 1, pParamEndIndex)
			.split('\n')
			.filter(rowSchema => rowSchema.includes('\t') && /\w/.test(rowSchema))
			.map(rowSchema => {
				// console.error('rowSchema', rowSchema);
				// 코멘트 추출
				const [name, dataType, ...comment] = rowSchema
					.replace(/\t|--/g, ' ')
					.trim()
					.replace(/^[,]/, ' ')
					.replace(/(\s)\1+/g, ' ')
					.trim()
					.split(' ');

				return {
					propertyKey: name,
					propertyType: this.convertDbTypeToJsType(dataType),
					comment: `${dataType} ${comment.join(' ')}`,
				};
			});

		return paramContents;
	}

	/**
	 * 실제 Inteface 파일 생성 (덮어쓰기)
	 * @param {string} dbName
	 * @param {IProcedure.ProcedureInfo[]} procedureList
	 */
	writeInterface(dbName, procedureList) {
		// console.log(dbName, procedureList);
		const writeStream = fs.createWriteStream(
			`${resolve(procedureInterfacePath, dbName)}.ts`,
		);

		const propertyTemplate = _.template(`
    /** <%= comment %> */
    <%= propertyKey %>: <%= propertyType %>;`);

		const txtProcedure = procedureList.map(procedureInfo => {
			const {
				procedureName,
				comment = '',
				paramList,
				result: { failList = [], successList = [] } = {},
			} = procedureInfo;

			// 성공 실패 interface 결과물을 가져옴
			const successResults = this.createTextResultInterface(successList);
			const failResults = this.createTextResultInterface(failList, false);

			// 결과물에 따라 Returns에 넣어줄 반환형으로 변환
			const returnsInterface = [];
			// 성공 순회
			successResults.forEach((v, index) => {
				returnsInterface.push(`${this.prefixNameList[index]}SuccessType`);
			});

			// 실패 순회
			failResults.forEach((v, index) => {
				const failReturn = `${this.prefixNameList[index]}FailType`;
				if (returnsInterface[index] === undefined) {
					returnsInterface.push(failReturn);
				} else {
					returnsInterface[index] += ` & ${failReturn}`;
				}
			});

			// NOTE: typeDummy 가 없으면 제네릭으로 접근이 안되어 더미 집어넣음.
			return `
      ${comment.length ? `/** ${comment} */` : ''} 
      export namespace ${procedureName} {
        const typeDummy = '';
        export type Param = {
          ${paramList.map(paramInfo => propertyTemplate(paramInfo)).join('')}
        }

        export type ParamTuple = [
          ${paramList.map(paramInfo => `'${paramInfo.propertyKey}'`)}
				]

        ${successResults.join('\n')}
        ${failResults.join('\n')}

        export type Returns = [
          ${returnsInterface.join(',')}
        ]
        
      }
    `;
		});

		writeStream.write(`
    namespace ibProc {
      export namespace ${dbName} {
        ${txtProcedure.join('')}
      }
    }
	`);
	}

	/**
	 * 실제 Js 파일 생성 (덮어쓰기)
	 * @param {string} dbName
	 * @param {IProcedure.ProcedureInfo[]} procedureList
	 */
	writeJavascript(dbName, procedureList) {
		const moduleTemplate = _.template(`
      module.exports = new (class{
        <%= procedureTupleList %>
      })()
    `);

		const procedureTupleTemplate = _.template(
			`
      /** <%= comment %> */
      <%= procedureName %> = [<%= procedureTuple %>]
      `,
		);

		const procedureTupleList = procedureList.map(procedureInfo => {
			const { procedureName, paramList, comment } = procedureInfo;

			return procedureTupleTemplate({
				comment,
				procedureName,
				procedureTuple: paramList.map(tupleInfo => `'${tupleInfo.propertyKey}'`),
			});
		});

		const result = moduleTemplate({
			dbName,
			procedureTupleList: procedureTupleList.join(''),
		});

		const writeStream = fs.createWriteStream(`${resolve(procedureJsPath, dbName)}.js`);

		writeStream.write(result);
	}
}

const procedureMaker = new ProcedureMaker();
module.exports = procedureMaker;

// Start standalone server if directly running
if (require.main === module) {
	// 특정 파일만 지정하고자 할 경우 확장자 제외하고 입력
	const targetFiles = [];
	// const targetFiles = ['c_member'];

	// createInterfaceFile(targetFiles);

	procedureMaker.createInterfaceFile(targetFiles);

	console.info('yarn gen 성공');
}
