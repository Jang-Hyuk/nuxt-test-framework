/** Dependency Injection Type Backend */
declare namespace DITC {
	interface Logger {
		loggerConfig: icLogger.Logger.Configure;
	}

	export interface TypeDI extends Logger {}
}
