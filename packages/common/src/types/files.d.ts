/** Dependency Injection File Common */
declare namespace DIFC {
	interface Utils {
		// baseUtil: typeof import('cm/utils/base');
	}

	interface Loggers {
		fileLogger: import('cm/loggers/FileLogger');
		fileWinstonLogger: import('cm/loggers/FileWinstonLogger');
		logger: import('cm/loggers/Logger');
		logDebugUtil: import('cm/loggers/DebugLogger');
	}

	interface FilesDI extends Utils, Loggers {}
}
