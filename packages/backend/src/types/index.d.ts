/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { Resolver } from 'awilix';

interface DependencyInjection
	extends DITB.TypeDI,
		DIFB.FilesDI,
		DITC.TypeDI,
		DIFC.FilesDI {}

declare global {
	var logger: DIFC.Loggers['logger'];
	var code: typeof import('be/config/code');
	// express-jsdoc-swagger 오류 처리
	interface array<T> extends Array<T> {}
}

declare module 'awilix' {
	type registerOption = {
		// FIXME value type 지정을 형까지 나왔으면 좋겠음
		[K in keyof DependencyInjection]: Resolver<DependencyInjection[K]>;
	};

	export interface AwilixContainer {
		cradle: DependencyInjection;

		// container.register override.
		register(name: keyof DependencyInjection | symbol, registration: symbol): this;
		register(options: Partial<registerOption>): this;
	}
}

declare module 'express-serve-static-core' {
	export interface Request {
		scope: import('awilix').AwilixContainer;
		SC: import('awilix').AwilixContainer['cradle'];
	}
}

declare module 'http' {
	export interface IncomingMessage {
		scope: import('awilix').AwilixContainer;
		SC: import('awilix').AwilixContainer['cradle'];
	}
	export interface ServerResponse {
		locals: any;
	}
}
