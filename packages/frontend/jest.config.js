module.exports = {
	testEnvironment: 'jsdom',
	globalSetup: '<rootDir>/jest.setup.js',
	setupFiles: ['<rootDir>/assets/js/jest/jest.global.js'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
		'^~/(.*)$': '<rootDir>/$1',
		'^vue$': 'vue/dist/vue.common.js',
	},
	moduleFileExtensions: ['js', 'vue', 'json'],
	modulePathIgnorePatterns: [
		'<rootDir>/node_modules',
		'<rootDir>/build',
		'<rootDir>/dist',
	],
	transform: {
		'^.+\\.js$': 'babel-jest',
		'.*\\.(vue)$': 'vue-jest',
	},
	collectCoverage: true,
	collectCoverageFrom: ['<rootDir>/components/**/*.vue', '<rootDir>/pages/**/*.vue'],
	// Jest Snapshot 테스트에 필요한 모듈을 지정합니다.
	// snapshotSerializers: ['jest-serializer-vue'],
};
