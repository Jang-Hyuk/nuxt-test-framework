namespace iTemp {
	export type APIMsg = {
		status: number;
		msg: string;
		code: string;
		accessToken?: string;
	};

	type APIResponseMsg = {};

	export type apiResponseStorage = {
		auth: {
			login: {
				error: {
					inactiveAccount: APIMsg;
					blockIp: APIMsg;
				};
				success: APIMsg;
			};
		};
		temp: APIMsg;
	};

	export interface APIResponse {
		[category: string]: {
			[page: string]: {
				// [key: string]: {
				// 	[key: string]: APIMsg;
				// };
				error: {
					[responseType: string]: APIMsg;
				};
				success: {
					[responseType: string]: APIMsg;
				};
			};
		};
	}
}
