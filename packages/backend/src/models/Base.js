const DefaultModel = require('./Default');

module.exports = class extends DefaultModel {
	/** @param {import('be/types').DependencyInjection} opt */
	constructor(opt) {
		super();

		const { dbStorage: db, logger } = opt;

		this.db = db;
		this.logger = logger;
	}
};
