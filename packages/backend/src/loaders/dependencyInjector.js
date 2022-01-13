const _ = require('lodash');
const { resolve, sep } = require('path');
const awilix = require('awilix');

const { createContainer, asValue, asClass } = awilix;

const {
	mainOption: {
		dirPathInfo: { bePath },
	},
} = require('be/config');
const BaseUtil = require('be/utils/Base');

const loggerLoader = require('./logger');

const beSrcPath = resolve(bePath, 'src');
// nuxt에서 hmr이 이루어지지 않아 모든 파일 require 처리
[['config'], ['models'], ['services'], ['utils']].forEach(dirName =>
	BaseUtil.requireFolder(beSrcPath, dirName),
);

module.exports = {
	/**
	 * 메인 카테고리 추출
	 * @param {import('awilix').ModuleDescriptor} descriptor
	 * @param {number} folderDepth 계층 깊이
	 * @param {boolean} isPluralFolder 복수형 메인 폴더 여부
	 */
	getMainCategory(descriptor, folderDepth, isPluralFolder) {
		const splat = descriptor.path.split(sep);

		// index는 0부터 시작하기 때문에 +1
		const mainCategoryIndex = folderDepth + 1;
		const namespace = splat[splat.length - mainCategoryIndex]; // `repository` or `service`

		return isPluralFolder ? namespace.slice(0, namespace.length - 1) : namespace;
	},
	/**
	 * 서브 카테고리 추출
	 * @param {import('awilix').ModuleDescriptor} descriptor
	 * @param {number} [folderDepth = 1] 계층 깊이
	 */
	getSubCategory(descriptor, folderDepth) {
		const splat = descriptor.path.split(sep);

		const subCategoryIndex = folderDepth;

		const fileIndex = splat.length;

		return _.chain(splat)
			.slice(fileIndex - subCategoryIndex, fileIndex - 1)
			.join(' ')
			.camelCase()
			.value();
	},
	/**
	 * 폴더 이름이 복수형(s)일 경우 끝의 문자 한개를 뺀후 카멜 케이스로 명명
	 * @param {string} fileName
	 * @param {import('awilix').ModuleDescriptor} descriptor
	 * @param {object} [option] 계층 깊이
	 * @param {number} [option.folderDepth = 1] 계층 깊이
	 * @param {boolean} [option.isPluralFolder = true] 복수형 폴더 여부
	 * @example
	 * fileName: Cookie
	 * descriptor.path: '...\\src\\utils\\Cookie.js'
	 * option.isPluralFolder: true -> utils에서 s 제거후 cookieUtil 생성
	 */
	createFileName(fileName, descriptor, option = {}) {
		const { folderDepth = 1, isPluralFolder = true } = option;
		const mainCategory = this.getMainCategory(descriptor, folderDepth, isPluralFolder);
		const subCategory = this.getSubCategory(descriptor, folderDepth);

		const injectedFileName = _.camelCase(`${subCategory} ${fileName} ${mainCategory}`);

		// global.logger.debug(injectedFileName);

		return injectedFileName;
	},

	/**
	 * 프로젝트 전반에 걸쳐 사용될 컨테이너 정의
	 * @param {object} opt
	 * @param {iDatabase.DBStorage} opt.dbStorage
	 * @param {import('awilix').AwilixContainer} [opt.container]
	 */
	injectBase({ dbStorage, container = createContainer() }) {
		const loggerInstance = loggerLoader();
		try {
			// Common Cradle 적용
			container.register({
				dbStorage: asValue(dbStorage),
			});

			// Load our modules!
			// to customize how modules are named in the container (and for injection)
			container.loadModules([[resolve(beSrcPath, 'models', '*.js')]], {
				resolverOptions: {
					lifetime: 'SINGLETON',
					register: asClass,
					injectionMode: 'PROXY',
				},
				// This formats the module name so `repository/account.js` becomes `accountRepository`
				formatName: (fileName, descriptor) => this.createFileName(fileName, descriptor),
			});

			return container;
		} catch (error) {
			loggerInstance
				.init('error:loader')
				.error('🔥 Error on dependency injector loader: %o', error);
		}
	},
	/**
	 * 사용자 세션이 유지되는 동안 사용될 컨테이너 정의
	 * @param {object} opt
	 * @param {import('awilix').AwilixContainer} [opt.container]
	 */
	injectPerUser({ container }) {
		// PubSub 패턴 상 이벤트가 발생하였을 경우 Subscribers에게 전달할 컨테이너(per User Container)
		container.register({
			container: asValue(container),
		});

		// Load our modules!
		// to customize how modules are named in the container (and for injection)
		container.loadModules(
			[
				//
				resolve(beSrcPath, 'services', '*.js'),
				resolve(beSrcPath, 'utils', '*.js'),
			],
			{
				resolverOptions: {
					lifetime: 'SCOPED',
					register: asClass,
					injectionMode: 'PROXY',
				},
				// This formats the module name so `repository/account.js` becomes `accountRepository`
				formatName: (fileName, descriptor) => this.createFileName(fileName, descriptor),
			},
		);

		container.loadModules(
			[
				resolve(beSrcPath, 'services', 'fastMeet', '*.js'),
				resolve(beSrcPath, 'services', 'fastVideo', '*.js'),

				resolve(beSrcPath, 'models', 'fastMeet', '*.js'),
				resolve(beSrcPath, 'models', 'fastVideo', '*.js'),
				resolve(beSrcPath, 'models', 'fastCall', '*.js'),
				resolve(beSrcPath, 'models', 'wallet', '*.js'),
				resolve(beSrcPath, 'models', 'event', '*.js'),
			],
			{
				resolverOptions: {
					lifetime: 'SCOPED',
					register: asClass,
					injectionMode: 'PROXY',
				},
				// This formats the module name so `repository/account.js` becomes `accountRepository`
				formatName: (fileName, descriptor) =>
					this.createFileName(fileName, descriptor, {
						folderDepth: 2,
					}),
			},
		);

		return container;
	},
};
