/** Dependency Injection Type Backend */
declare namespace DITB {
	type User = {
		userLoginForm: iUser.UserLoginForm;
		user: iUser.User;
	};

	interface Database {
		dbStorage: iDatabase.DBStorage;
	}

	// interface Client {
	// 	user: iUser.User;
	// }

	interface Http {
		userAgent: import('http').IncomingHttpHeaders['user-agent'];
		httpHeader: import('http').IncomingHttpHeaders;
		/** client ipv4 ex) 123.456.789.123  */ remoteAddress: string;
		req: import('express').Request;
		res: import('express').Response;
	}

	interface ETC {
		container: import('awilix').AwilixContainer;
	}

	export interface TypeDI extends User, Database, Http, ETC {}
}
