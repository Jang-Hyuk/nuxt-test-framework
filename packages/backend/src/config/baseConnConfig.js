require('module-alias/register');

const _ = require('lodash');
const fs = require('fs');
const dotenv = require('dotenv');
const { resolve, sep } = require('path');
const ip = require('ip');

const {
	server: {
		config: { serverLinks, serverOption },
		ip: {
			officeIP: { gwangJu: gwangJuIp },
		},
	},
	service: {
		base: { subDomain },
	},
} = require('be/config/code');
const ClientUtil = require('be/utils/Client');

/** Nuxt Frontend 호스팅 포트 */
const FE_BASE_PORT = 8200;
/** API Backend 호스팅 포트 */
const BE_BASE_PORT = 8201;
/**
 * 개발자 Port Index에 곱할 수. 개발자 index가 5고 라면 BASE_PORT + 5
 * @example
 * FE_BASE_PORT 8200
 * PORT_INDEX_MULTIPLE 10
 * 계산된 portIndex 5
 * 8200 + 5 * 10 = 개발자 호스팅 포트 8250
 */
const PORT_INDEX_MULTIPLE = 10;

module.exports = new (class {
	#envRange = {
		/** 사용하고 있는 환경 변수 */
		uses: ['production', 'staging', 'development'],
		/** 프로덕션 환경 변수 */
		productions: ['production', 'staging'],
	};

	/** 환경변수 프로세스 초기화 여부. 1회만 허용 */
	#isEnvProcessInit = false;

	#rootPath = resolve(__dirname, '../../../..');

	/**
	 * 환경 변수를 수정할 경우 인자 값을 이용하여 변경
	 * NODE_ENV 값을 기반으로 dotenv 값을 활용하여 환경변수 등록
	 * env 파일은 workspace 최상단에 있어야한다.
	 * @param {object} config 환경 변수
	 * @param {string} [config.beApiPrefix=api] backend api prefix
	 * @example
	 * frontEnd에서는 Server Middleware에서 경로를 지정하므로 기본 BE prefix를 제거
	 */
	initProcessEnv(config = {}) {
		if (this.#isEnvProcessInit === true) {
			return false;
		}

		this.#isEnvProcessInit = true;

		const { beApiPrefix = '/' } = config;

		// CLI 상에서 입력되는 NODE_ENV 값. ex) cross-env NODE_ENV=production nodemon src/app.js
		// const envFileName = NODE_ENV === 'production' ? '.env.production' : '.env.dev';

		// Set the NODE_ENV to 'development' by default
		process.env.NODE_ENV = this.#envRange.uses.includes(process.env.NODE_ENV)
			? process.env.NODE_ENV
			: 'development';

		// 현재 파일을 기준으로 workspace 경로로 이동하여 환경변수 파일 경로를 정의
		const envPath = resolve(this.#rootPath, `.env.${process.env.NODE_ENV}`);

		// env 파일을 기준으로 환경변수 등록
		const envOutput = dotenv.config({ path: envPath });

		if (envOutput.error) {
			// This error should crash whole process
			throw new Error("⚠️  Couldn't find .env file  ⚠️");
		}

		// 환경 변수 재설정
		Object.keys(envOutput.parsed).forEach(key => {
			process.env[key] = envOutput.parsed[key];
		});

		// 만약 순수 개발용 환경 설정 파일이 존재할 경우 설정 덮어쓰기
		const devEnvPath = resolve(this.#rootPath, '.env.dev');
		if (!this.isProduction && fs.existsSync(devEnvPath)) {
			const devEnvOutput = dotenv.config({ path: devEnvPath });
			// 환경 변수 재설정
			Object.keys(devEnvOutput.parsed).forEach(key => {
				process.env[key] = devEnvOutput.parsed[key];
			});
		}

		// 백엔드 API 라우팅 재정의 -> https://url{/BE_API_PREFIX}/path
		process.env.BE_API_PREFIX = beApiPrefix;
		this.setEnv();

		return this;
	}

	/** 디렉터리 경로 */
	get directoryPathInfo() {
		const {
			// path Info
			/** 로그를 기록할 위치 */
			LOG_ROOT = '..',
		} = process.env;

		const dirPathInfo = {
			logPath: resolve(this.#rootPath, LOG_ROOT, 'logs'),
			healthPath: resolve(this.#rootPath, '..', 'service_check'),
			workspacePath: resolve(this.#rootPath),
			bePath: resolve(this.#rootPath, 'packages', 'backend'),
			fePath: resolve(this.#rootPath, 'packages', 'frontend'),
			cmPath: resolve(this.#rootPath, 'packages', 'common'),
		};

		return dirPathInfo;
	}

	/** NODE_ENV 값이 프로덕션(production, staging) 에 해당하는 값이라면 true 반환 */
	get isProduction() {
		// NODE_ENV 프로덕션 유효 범위. 프로덕션이라면 nuxt build 진행을 하지 않는다.

		const { NODE_ENV = 'development' } = process.env;

		// NODE_ENV 프로덕션 유효 범위. 프로덕션이라면 nuxt build 진행을 하지 않는다.
		const isProduction = this.#envRange.productions.includes(NODE_ENV);

		return isProduction;
	}

	/** 서비스 중인 현 위치 폴더 값에 해당하는 인덱스 값 반환 (실서비스는 포트 2개로 호스팅)  */
	get productionServerIndex() {
		const {
			// ↓↓↓↓↓↓ 주입 환경 변수
			HOST_FOLDERS = 'node_1, node_2',
		} = process.env;

		// HOST_FOLDERS 옵션을 읽어들여 현재 위치하는 폴더의 값과 비교 후 index 변경이 있다면 포트 번호 증가
		const currHostFolder = this.#rootPath.split(sep).pop();

		return HOST_FOLDERS.split(',')
			.map(_.trim)
			.findIndex(hostFolderName => hostFolderName === currHostFolder);
	}

	/** 프록시 정보 */
	get proxyOption() {
		// sub-domain api-{prefix} 형식으로 추가
		const proxyOption = _.reduce(
			subDomain,
			(proxyInfo, proxyContents, proxy) => {
				const apiPath = `/api-${proxy}/`;
				proxyInfo.proxy[apiPath] = {
					target: proxyContents,
					pathRewrite: { [`^${apiPath}`]: '' },
				};
				proxyInfo.proxyApiPrefix[proxy] = apiPath;
				return proxyInfo;
			},
			{
				proxy: {},
				proxyApiPrefix: {},
			},
		);

		return proxyOption;
	}

	/** 구동에 필요한 서버 정보 옵션 */
	get serverInfo() {
		const {
			/** 스키마 */
			SCHEMA,
			/** 서버 실행 호스트 */
			HOST,
			/** 넉스트 실행 포트 */
			PORT,
			/** 백엔드 실행 포트 */
			BE_PORT,
			/** 실DB 접속 유무 */
			IS_REAL_DB = '0',
			/** 실 도메인 사용 여부 */
			IS_REAL_SERVER = '0',
		} = process.env;

		// 기본적인 서버 정보
		const baseServerInfo = {
			schema: SCHEMA,
			host: HOST,
			serverOption: undefined,
			serverLinkList: this.createServerLinks(),
			isRealDB: IS_REAL_DB === '1',
			isRealServer: IS_REAL_SERVER === '1',
		};
		// IPv6 형태로 들어오면 IPv4 형태로 변환
		const localIp = ip.address().replace(/^.*:/, '');
		// @ts-ignore
		const clientUtil = new ClientUtil({
			remoteAddress: localIp,
		});

		const isOfficeNetwork = clientUtil.isOfficeNetwork(localIp);

		const { bePath } = this.directoryPathInfo;

		// 스키마가 설정되어 있지 않다면 동적으로 현재 ip를 기준으로 결정
		if (SCHEMA.length === 0) {
			// 프로덕션 모드 또는 회사 ip 대역에서 돌릴경우 http
			baseServerInfo.schema = this.isProduction || isOfficeNetwork ? 'http' : 'https';
		}

		// HOST가 설정되어 있지 않을 경우 개발모드로 판단하고 동적으로 부여
		if (HOST.length === 0) {
			baseServerInfo.host = isOfficeNetwork ? localIp : serverOption.host.dev;
		}

		// https를 돌리기 위한 정보
		if (baseServerInfo.schema === 'https') {
			baseServerInfo.serverOption = {
				key: fs.readFileSync(resolve(bePath, 'ssh', 'key.pem')),
				cert: fs.readFileSync(resolve(bePath, 'ssh', 'cert.pem')),
				ca: fs.readFileSync(resolve(bePath, 'ssh', 'chain.pem')),
			};
		}

		const feServerInfo = {
			port: PORT,
			origin: `${baseServerInfo.schema}://${baseServerInfo.host}:${PORT}`,
		};

		const beServerInfo = {
			port: BE_PORT,
			origin: `${baseServerInfo.schema}://${baseServerInfo.host}:${BE_PORT}`,
		};

		return {
			baseServerInfo,
			feServerInfo,
			beServerInfo,
		};
	}

	/**
	 * 호스팅 중인 서버 링크 생성. 기존 객체의 url을 수정하여 반환
	 */
	createServerLinks() {
		const baseDevUrl = serverOption.url.dev;
		const { networkId } = gwangJuIp;

		const hostedServerList = serverLinks.reduce((serverLinks, serverLinkOption) => {
			// url이 지정되어 있지 않으면 dev Url을 사용
			// = serverOption.url.dev
			const { url = '', portIndex, hostId, name } = serverLinkOption;

			// url이 존재하면 해당 값 그대로 삽입
			if (url.length) {
				serverLinks.push(serverLinkOption);
			} else if (portIndex) {
				// portIndex가 존재한다면 로컬에서도 생성된다고 가정
				// 포트가 지정되어 있는지 여부 (https://devjs.club5678.com:8888) -> length 3
				const port = portIndex * PORT_INDEX_MULTIPLE + FE_BASE_PORT;

				// devjs url 입력
				const devUrl = `${baseDevUrl}:${port}`;
				// 개발자 local 입력
				const localUrl = `http://${networkId}.${hostId}:${port}`;

				const devServer = { ...serverLinkOption, url: devUrl };
				delete devServer.portIndex;
				delete devServer.hostId;
				serverLinks.push(devServer);

				const localServer = { ...serverLinkOption, name: `${name} 로컬`, url: localUrl };
				delete localServer.portIndex;
				delete localServer.hostId;
				serverLinks.push(localServer);
			}

			return serverLinks;
		}, []);

		return hostedServerList;
	}

	/**
	 * process.env DEV_ID 값에 따라 process.env 포트 조정
	 * @returns 서버를 구동하기 위한 설정 정보
	 */
	getOperationInfo() {
		this.#isEnvProcessInit === false && this.initProcessEnv();

		const {
			HEALTH_FILE_NAME = '',
			/** 호스팅 서비스 종류 */
			SERVER_NAME_LIST = 'CLUBTONG, partner, club5678',
			/** 현재 서비스 중인 서비스 명 */
			SERVER_NAME = 'CLUBTONG',
			/** 콘솔창에 출력할 npm LogLevel 범위 */
			LOG_LEVEL = 'silly',
			/** 콘솔창에 출력할 내용 */
			LOG_OPT_IS_FILE_NAME = '0',
			LOG_OPT_IS_FN_NAME = '0',
			LOG_OPT_IS_TIME = '0',
			LOG_OPT_IS_TIME_MS = '0',
			/** Backend API 경로 */
			BE_API_PREFIX = '/api',
			/** 넉스트에서 render:setupMiddleware 훅이 발생하였을 경우 기록할지 여부( SSR Access ) */
			IS_SKIP_FE_REQ_MID_LOG = '0',
			/** 넉스트에서 render:errorMiddleware 훅이 발생하였을 경우 기록할지 여부 */
			IS_SKIP_FE_ERR_MID_LOG = '0',
		} = process.env;

		const { baseServerInfo, beServerInfo, feServerInfo } = this.serverInfo;

		const operatoinInfo = {
			/** Global Setting */
			mainOption: {
				serverInfo: baseServerInfo,
				serverNameList: SERVER_NAME_LIST.toUpperCase().split(',').map(_.trim),
				serverName: SERVER_NAME.toUpperCase(),
				isProduction: this.isProduction,
				healthFileName: HEALTH_FILE_NAME,
				dirPathInfo: this.directoryPathInfo,
				logOption: {
					logLevel: LOG_LEVEL,
					viewOption: {
						isFileName: LOG_OPT_IS_FILE_NAME === '1',
						isFnName: LOG_OPT_IS_FN_NAME === '1',
						isTime: LOG_OPT_IS_TIME === '1',
						isTimeMs: LOG_OPT_IS_TIME_MS === '1',
					},
				},
				proxyOption: this.proxyOption,
			},
			/** Backend Setting */
			backendOption: {
				apiPrefix: BE_API_PREFIX,
				isBackendMode: false,
				serverInfo: beServerInfo,
			},
			/** Frontend Setting */
			frontendOption: {
				serverInfo: feServerInfo,
				logOption: {
					isSkipRequest: IS_SKIP_FE_REQ_MID_LOG,
					isSkipError: IS_SKIP_FE_ERR_MID_LOG,
				},
			},
		};

		return operatoinInfo;
	}

	/** 현재 구동 서버가 운영 서버 목록에 존재하는지 체크 후 링크 반환 */
	getServerLink() {
		const {
			// ↓↓↓↓↓↓ process.env 기본 프로퍼티
			USER,
			/** 개발자 ID */
			DEV_ID = '',
		} = process.env;

		const realUserId = DEV_ID.length ? DEV_ID : USER;

		return _.find(serverLinks, { id: realUserId });
	}

	/** 환경 변수 재설정 */
	setEnv() {
		const {
			// ↓↓↓↓↓↓ 주입 환경 변수
			/** 웹서버 운영 정보 */
			SCHEMA = '',
			HOST = '',
			PORT = '',

			HOST_FOLDERS = 'node_1, node_2',
			HEALTH_FILES = 'service1.txt, servce2.txt',
			/** 백엔드 단독으로 돌릴경우 포트 */
			BE_PORT = PORT,
		} = process.env;

		const portInfo = {
			fePort: FE_BASE_PORT,
			bePort: BE_BASE_PORT,
		};

		// 서버 링크 정보가 있을 경우 포트 자동 부여
		const serverLinkInfo = this.getServerLink();
		if (serverLinkInfo) {
			const { portIndex = 0 } = serverLinkInfo;

			const addPort = portIndex * PORT_INDEX_MULTIPLE;

			portInfo.fePort = FE_BASE_PORT + addPort;
			portInfo.bePort = BE_BASE_PORT + addPort;
		}

		// 포트가 지정되어 있을 경우 포트 우선 순위를 가지므로 덮어쓰기 수행
		PORT.length && _.set(portInfo, 'fePort', Number(PORT));
		BE_PORT.length && _.set(portInfo, 'bePort', Number(BE_PORT));

		// HOST_FOLDERS 옵션을 읽어들여 현재 위치하는 폴더의 값과 비교 후 index 변경이 있다면 포트 번호 증가
		const currHostFolder = this.#rootPath.split(sep).pop();

		const serverInstanceIndex = HOST_FOLDERS.split(',')
			.map(_.trim)
			.findIndex(hostFolderName => hostFolderName === currHostFolder);

		let healthFileName = '';
		if (serverInstanceIndex !== -1) {
			portInfo.fePort += serverInstanceIndex;
			portInfo.bePort += serverInstanceIndex;

			// 헬스 파일 위치 결정
			healthFileName = HEALTH_FILES.split(',').map(_.trim)[serverInstanceIndex];
		}

		// 프로세스 환경 변수 재정의
		process.env.SCHEMA = SCHEMA;
		process.env.HOST = HOST;
		process.env.PORT = portInfo.fePort.toString();
		process.env.BE_PORT = portInfo.bePort.toString();
		process.env.HEALTH_FILE_NAME = healthFileName;
	}
})();
