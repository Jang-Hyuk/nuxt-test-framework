/**
 * NODE_ENV 값을 기반으로 환경 파일을 동적으로 로드 및 환경 변수 초기화를 진행
 * 개발모드, 스테이지모드, 서비스모드 환경변수 설정.
 * 아무런 NODE_ENV를 입력하지 않을 경우 development 진행한다
 * @example
 * 개발 모드   : cross-env NODE_ENV=development && pm2 start ecosystem.config.js
 * 스테이징 모드 : cross-env NODE_ENV=staging && pm2 start ecosystem.config.js
 * 서비스 모드 : cross-env NODE_ENV=production && pm2 start ecosystem.config.js
 */

require('module-alias/register');

const baseConnConfig = require('be/config/baseConnConfig');

baseConnConfig.initProcessEnv();
// 환경 변수 설정
const {
	mainOption: {
		isProduction,
		serverInfo: { host },
	},
	frontendOption: {
		serverInfo: { port },
	},
} = baseConnConfig.getOperationInfo();

const { PM2_INSTANCE } = process.env;
// 개발 모드에서만 디버깅 포트를 개방
const inspectPort = isProduction ? '' : `--inspect=${Number(port) + 9}`;

module.exports = {
	apps: [
		{
			name: 'TongTong',
			exec_mode: isProduction ? 'cluster' : 'fork',
			instances: PM2_INSTANCE,
			// script: process.env.HOME + '/nuxtExercise/node_modules/nuxt/bin/nuxt.js',
			script: './node_modules/nuxt/bin/nuxt.js',
			args: isProduction ? 'start' : '',
			node_args: [inspectPort],
			env: {
				HOST: host,
				PORT: port,
			},
			restart_delay: 1000,
		},
	],
};
