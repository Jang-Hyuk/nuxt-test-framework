const chalk = require('chalk');
const http = require('http');
const https = require('https');
// Fast, unopinionated, minimalist web framework for node.
const express = require('express');
// 초기 구동 시 필요한 사항들 로딩
const loader = require('be/loaders');
const logger = require('be/loaders/logger')();

const {
	mainOption: { serverInfo },
	backendOption: {
		serverInfo: { origin, port },
	},
} = require('be/config');

const app = express();

/**
 * Event listener for HTTP server "error" event.
 * @param error SystemError
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const errLogger = logger.init('error');

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port1 ${port}`;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			errLogger.error(`${bind} requires elevated privilasdasdeges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			errLogger.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 *
 * @param {http.Server|https.Server} server Http Server 객체
 * @example
 */
function onListening(server) {
	const addr = server.address();
	const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

	logger.init('http').info(`Listening on ${bind}`);
}

/** api server 설정 */
async function initServer() {
	// Split the startup process into modules
	await loader({ expressApp: app });
}

/** Express App Listening */
function runServer() {
	// Create HTTP server
	const server =
		serverInfo.schema === 'https'
			? https.createServer(serverInfo.serverOption, app)
			: http.createServer(app);

	server.listen(Number(port), () => {
		logger.init('http').cLog(`
      ###############################################################
          🛡️  Server listening ${chalk.underline(chalk.yellowBright(origin))} 🛡️
      ###############################################################
	  `);
	});
	server.on('error', onError);
	server.on('listening', () => onListening(server));
}

module.exports = {
	initServer,
	runServer,
	app,
};
