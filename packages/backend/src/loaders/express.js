const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const helmet = require('helmet');
const { resolve, join } = require('path');
const { asValue } = require('awilix');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const { init } = require('express-oas-validator');

const BaseUtil = require('be/utils/Base');
const dependencyInjector = require('be/loaders/dependencyInjector');

const {
	backendOption: { apiPrefix, isBackendMode },
	mainOption: {
		dirPathInfo: { bePath },
	},
} = require('be/config');

/**
 * 지정 폴더를 기준으로 app.use 처리. 단 index는 '/'
 * @param {import('express').Application} app express App
 * @param {string[]} dirPath dirPath
 * @param {string} [apiPrefix = ''] dirPath
 * @param {number} [omitDepth = 1] 제외하고자 하는 dirPath 깊이
 */
function injectRouter(app, dirPath, apiPrefix = '', omitDepth = 1) {
	const dynamicDirPath = resolve(bePath, ...dirPath);
	// 디렉토리 목록 추출 (테스트 폴더 제외)
	const directoryList = BaseUtil.getDirectories(dynamicDirPath).filter(
		dirPath => dirPath.includes('test') === false,
	);
	// 파일 명 추출
	const fileList = BaseUtil.getFiles(dynamicDirPath, ['js']);

	// 파일 명 순회
	fileList.forEach(file => {
		// 제외 폴더(routes 폴더를 기준으로 할 경우 routes 폴더명까지 들어가는것을 방지)
		const realRouterDirPath = dirPath.slice(omitDepth);
		// 파일 이름
		const fileName = file.slice(0, file.lastIndexOf('.'));
		// 파일 경로
		const filePath = join(bePath, ...dirPath, fileName);
		// 파일 이름이 index.js가 아닐 경우 router에 해당 파일 이름 설정
		if (file !== 'index.js') {
			realRouterDirPath.push(fileName);
		}
		// 라우트 경로(apiPrefix가 '/' 이런 형식이 올 경우 삭제 처리)
		const routerPath = `${
			apiPrefix.length <= 1 ? '' : apiPrefix
		}/${realRouterDirPath.join('/')}`;
		// 동적 라우팅
		// eslint-disable-next-line global-require
		const dynamicModule = require(filePath);
		// app에 경로 설정
		app.use(routerPath, dynamicModule);
	});
	// 하부 폴더 목록을 기준으로 재귀
	directoryList.forEach(dirName => {
		return injectRouter(app, dirPath.concat(dirName), apiPrefix, omitDepth);
	});
}

/**
 * @param {object} opt express App 설정을 위한 객체
 * @param {import('express').Application} opt.app express Application
 * @param {import('awilix').AwilixContainer} opt.container Awilix Container
 */
module.exports = ({ app, container }) => {
	const swaggerOptions = {
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: 'TongTong store',
		},
		security: {
			BasicAuth: {
				type: 'http',
				scheme: 'basic',
			},
		},
		baseDir: resolve(bePath, 'src', 'api', 'routes'), // Expose OpenAPI UI
		// Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
		filesPattern: './**/*.js',
		// URL where SwaggerUI will be rendered
		swaggerUIPath: '/docs',
		// Expose OpenAPI UI
		exposeSwaggerUI: true,
		// Expose Open API JSON Docs documentation in `apiDocsPath` path.
		exposeApiDocs: false,
		// Open API JSON Docs endpoint.
		apiDocsPath: '/v3/api-docs',
		// Set non-required fields as nullable by default
		notRequiredAsNullable: false,
		// You can customize your UI options.
		// you can extend swagger-ui-express config. You can checkout an example of this
		// in the `example/configuration/swaggerOptions.js`
		swaggerUiOptions: {},
		// multiple option in case you want more that one instance
		multiple: true,
	};

	// @ts-ignore
	const instance = expressJSDocSwagger(app)(swaggerOptions);

	// Catch the favicon.ico request and send a 204 No Content status
	app.get('/favicon.ico', (req, res) => res.status(204));

	// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// It shows the real origin IP in the heroku or Cloudwatch logs
	app.enable('trust proxy');

	// Morgan 로깅 Filesystem 저장
	isBackendMode && container.cradle.fileLogger.bindMorganLogger(app);

	// The magic package that prevents frontend developers going nuts
	// Alternate description:
	// Enable Cross Origin Resource Sharing to all origins by default
	app.use(cors());

	// 최상위 헬멧 기능은 15개의 작은 미들웨어에 대한 래퍼이며 그 중 11개가 기본적으로 활성화되어 있습니다. https://github.com/helmetjs/helmet
	app.use(helmet());

	// app.use(
	// 	cookieSession({
	// 		name: 'sid',
	// 		keys: [/* secret keys */ uuid()],
	// 		// Cookie Options
	// 		// a number representing the milliseconds from Date.now() for expiry
	// 		maxAge: 24 * 60 * 60 * 1_000, // 24 hours
	// 		// a boolean indicating whether the cookie is only to be sent over HTTPS
	// 		secure: true,
	// 		// a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default).
	// 		httpOnly: true,
	// 		// a boolean or string indicating whether the cookie is a "same site" cookie (false by default). This can be set to 'strict', 'lax', 'none', or true (which maps to 'strict').
	// 		sameSite: false,
	// 	}),
	// );

	// Some sauce that always add since 2014
	// "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
	// Maybe not needed anymore ?
	app.use(methodOverride());

	// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
	app.use(cookieParser());
	// Middleware that transforms the raw string of req.body into json
	app.use(express.json());

	// bodyParser 미들웨어의 여러 옵션 중에 하나로 false 값일 시 node.js에 기본으로 내장된 queryString, true 값일 시 따로 설치가 필요한 npm qs 라이브러리를 사용
	// extended 는 중첩된 객체표현을 허용할지 말지를 정하는 것. 객체 안에 객체를 파싱할 수 있게하려면 true.
	app.use(express.urlencoded({ extended: false }));

	// 사용자 세션 당 의존성 주입 (by awilix.js)
	app.use((req, res, next) => {
		// 사용자 세션이 유지되는 동안 사용될 컨테이너 생성
		req.scope = container.createScope();
		// 빠르게 사용하기 위한 객체. Scope Cradle
		req.SC = req.scope.cradle;

		req.scope.register({
			userAgent: asValue(req.headers['user-agent']),
			httpHeader: asValue(req.headers),
			// IPv6 접두사가 있을 경우 제거하고 정의
			remoteAddress: asValue(req.socket.remoteAddress.replace(/^.*:/, '')),
			req: asValue(req),
			res: asValue(res),
		});

		// DI 주입. 주입된 클래스들은 사용자당 singleton으로 생성. 세션이 종료되면 자동으로 제거
		dependencyInjector.injectPerUser({
			container: req.scope,
		});

		next();
	});

	// Load API routes
	injectRouter(app, ['src/api/routes'], apiPrefix);

	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		res.status(404).json({ message: 'Not Found' });
	});

	/**
	 * 사용자가 비동기 요청 중일 경우에 발생하는 에러 핸들러
	 * @param {Error} err http-errors HttpError
	 * @param {express.Request} req express.Request
	 * @param {express.Response} res express.Response
	 */
	function clientErrorHandler(err, req, res, next) {
		// 요청이 ajax라면
		if (req.xhr) {
			res.status(500).send({ error: 'Something failed!' });
		} else {
			next(err);
		}
	}

	/**
	 * 404 에러가 아닌 경우에는 자세한 오류를 기록
	 * @param {Error} err http-errors HttpError
	 * @param {express.Request} req express.Request
	 * @param {express.Response} res express.Response
	 */
	function logErrors(err, req, res, next) {
		const { query, body, params } = req;

		// 객체 형태로 넘어올 경우 풀어서 재정의 한다
		const logErr =
			typeof err.message === 'object' ? { ...err, message: err.message } : err;

		req.SC.logger.error(logErr, {
			query,
			body,
			params,
		});
		next(err);
	}

	/**
	 * catch-all error handler. http-errors 에서 전송한 HttpError 객체 처리
	 * @param {Error} err http-errors HttpError
	 * @param {express.Request} req express.Request
	 * @param {express.Response} res express.Response
	 */
	function errorHandler(err, req, res, next) {
		// next()응답 작성을 시작한 후 오류로 호출 하는 경우 (예: 응답을 클라이언트에 스트리밍하는 동안 오류가 발생한 경우) Express 기본 오류 처리기는 연결을 닫고 요청에 실패합니다.
		if (res.headersSent) {
			return next(err);
		}

		const error = req.app.get('env') === 'development' ? err : {};

		res.status(error.status || 500);
		res.json({ error });
	}

	app.use(logErrors);
	app.use(clientErrorHandler);
	app.use(errorHandler);

	return new Promise(resolve => {
		instance.on('finish', data => {
			init(data);
			resolve(app);
		});
	});
};
