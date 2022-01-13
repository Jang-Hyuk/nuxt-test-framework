// FIXME: 소스 정리 필요
// import { resolve } from 'path';

// import baseConnConfig from 'be/config/baseConnConfig';

import axios from 'axios';
import qs from 'qs';

import pkg from '../package.json';

// const {
// 	mainOption: { proxyOption },
// } = baseConnConfig.getOperationInfo();

axios.defaults.paramsSerializer = params => {
	return qs.stringify(params);
};

/**
 * @param moduleOptions nuxt.config.js global 옵션
 * @example
 */
export default function global(moduleOptions) {
	// // @ts-ignore
	// process.global = {
	// 	PROXY: proxyOption.proxyApiPrefix,
	// };
	// // Add plugin
	// this.addPlugin({
	// 	src: resolve(__dirname, '../plugins', 'global.js'),
	// 	fileName: 'global.js',
	// });
}

// REQUIRED if publishing the module as npm package
module.exports.meta = pkg;
