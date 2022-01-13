import code from 'cm/code';

import createRepository from '~/repositories';

/** @type {import('@nuxt/types').Plugin} 사용자 정의 플러그인 */
export default function (ctx, inject) {
	// globalThis.$ = {};

	// @ts-ignore
	inject('global', process.global || {});

	// Repository Pattern DI
	inject('repo', createRepository(ctx.$axios));

	inject('code', code);
}
