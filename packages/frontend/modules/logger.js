import { resolve } from 'path';

import DebugLogger from 'cm/loggers/DebugLogger';
import FileLogger from 'cm/loggers/FileWinstonLogger';

import { mainOption } from 'be/config';

import pkg from '../package.json';

/**
 * @param {import('express').Request} req express Request
 * @returns {object} req
 */
function extractReqInfo(req) {
	return {
		url: req.url,
		method: req.method,
		headers: req.headers,
	};
}

/**
 * @param moduleOptions nuxt.config.js logger 옵션
 * @example
 */
export default function logger(moduleOptions) {
	const { dirPathInfo, isProduction, logOption } = mainOption;
	const winstonOptions = {
		skipRequestMiddlewareHandler: false,
		skipErrorMiddlewareHandler: false,
		...this.options.winstonLog,
		...moduleOptions,
	};

	const fileLogger = new FileLogger({
		// 파일 로거를 생성하는데 필요한 옵션 설정
		fileLoggerConfig: {
			isProduction,
			logOption: {
				logLevel: logOption.logLevel,
				logsDir: resolve(dirPathInfo.logPath),
			},
		},
	});

	// 파일 로거 생성
	fileLogger.init();

	const logUtil = new DebugLogger({
		fileLogger,
		loggerConfig: {
			logLevel: logOption.logLevel,
			viewOption: logOption.viewOption,
		},
	});

	logUtil.init('http:nuxt');

	// @ts-ignore
	process.logger = logUtil;

	// Add serverside-only plugin
	this.addPlugin({
		src: resolve(__dirname, '../plugins', 'logger.server.js'),
		fileName: 'logger.server.js',
		mode: 'server',
	});

	// nuxt request logging
	if (winstonOptions.skipRequestMiddlewareHandler === false) {
		this.nuxt.hook('render:setupMiddleware', app => fileLogger.bindMorganLogger(app));
	}

	// nuxt error logging
	if (winstonOptions.skipErrorMiddlewareHandler === false) {
		// 미들웨어를 추가하기 전 에러가 발생하였을 경우
		this.nuxt.hook('render:errorMiddleware', app => {
			app.use((err, req, res, next) => {
				const newError = new Error(err);
				newError.stack = err.stack;

				logUtil.error(newError, {
					...extractReqInfo(req),
				});
				next(err);
			});
		});
	}
}

// REQUIRED if publishing the module as npm package
module.exports.meta = pkg;

// reqInfo.headers {                                                                 10:04:19
//   host: 'devjs.club5678.com:3060',
//   connection: 'keep-alive',
//   'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
//   'sec-ch-ua-mobile': '?0',
//   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
//   accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//   'sec-fetch-site': 'same-origin',
//   'sec-fetch-mode': 'no-cors',
//   'sec-fetch-dest': 'script',
//   referer: 'https://devjs.club5678.com:3060/',
//   'accept-encoding': 'gzip, deflate, br',
//   'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
//   cookie: 'i18n_redirected=ko; __utma=52273275.692277804.1624068917.1624068917.1624068917.1; __utmz=52273275.1624068917.1.1.utmcsr=club5678.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _fbp=fb.1.1624514911333.1092635325; _ga=GA1.2.692277804.1624068917; _ga_V6532HGX15=GS1.1.1626078419.2.0.1626078419.60; SL_G_WPT_TO=ko; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1'
// }
