module.exports = {
	// testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^~/(.*)$': '<rootDir>/$1',
		'^be/(.*)$': '<rootDir>/src/$1',
		'^cm/(.*)$': '<rootDir>/../common/src/$1',
	},
	moduleFileExtensions: ['js', 'json'],
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	collectCoverage: false,
	collectCoverageFrom: [],
};
