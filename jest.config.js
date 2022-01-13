module.exports = {
	// testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^~/(.*)$': '<rootDir>/packages/frontend/$1',
		'^be/(.*)$': '<rootDir>/packages/backend/src/$1',
		'^cm/(.*)$': '<rootDir>/packages/common/src/$1',
	},
	moduleFileExtensions: ['js', 'json'],
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	collectCoverage: false,
	collectCoverageFrom: [],
};
