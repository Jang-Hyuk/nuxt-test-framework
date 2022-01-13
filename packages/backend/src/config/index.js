const baseConnConfig = require('./baseConnConfig');

const dbConnect = require('./code/server/dbConnect');

const { mainOption, backendOption } = baseConnConfig.getOperationInfo();

module.exports = {
	/** Global Setting */
	mainOption,

	/** Backend Setting */
	backendOption,

	/** mysql.ConnectionOption List */
	dbConnect,
};
