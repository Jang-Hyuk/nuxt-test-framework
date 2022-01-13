/** @type {import('@nuxt/types').Plugin} 윈스톤 로거 플로그인 */
export default function (ctx, inject) {
	// Inject winston logger instance to the Nuxt context as $winstonLog
	// @ts-ignore
	inject('logger', process.logger || {});
}
