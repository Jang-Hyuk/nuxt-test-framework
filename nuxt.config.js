/**
 * PM2 구동 시 현재의 nuxt.config.js 파일을 기반으로 구동하므로 PM2를 위한 설정 파일
 * 올바른 경로를 인식시킬 수 있다면 현재의 파일은 제거해도 됨
 */

// @ts-nocheck
import nuxtConfig from './packages/frontend/nuxt.config';

/** @type {import('@nuxt/types').NuxtConfig} */
const config = {
	...nuxtConfig,
	rootDir: '.',
	srcDir: 'packages/frontend',
	modulesDir: ['./node_modules'],
};

export default config;
