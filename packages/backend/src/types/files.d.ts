/** Dependency Injection File Backend */
declare namespace DIFB {
	interface Config {
		beConfig: typeof import('be/config');
		baseConnConfig: typeof import('be/config/baseConnConfig');
	}

	interface Models {
		// business model
	}

	interface Services {
		baseService: import('be/services/Base');
	}

	interface Utils {
		baseUtil: import('be/utils/Base');
		cookieUtil: import('be/utils/Cookie');
		clientUtil: import('be/utils/Client');
		deviceUtil: import('be/utils/Device');
		encryptUtil: import('be/utils/Encrypt');
		gpsUtil: import('be/utils/Gps');
		photoUtil: import('be/utils/Photo');
		sessionPacketUtil: import('be/utils/SessionPacket');
	}

	export interface FilesDI extends Config, Models, Services, Utils {}
}
