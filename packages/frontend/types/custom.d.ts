export interface validRules {
	length(len: number): (v: any) => boolean;
	required(fields: any): (v: any) => boolean;
}

export interface config {
	FE_PORT: number;
	PROXY: {
		secure: string;
		pay: string;
		session: string;
		photo: string;
		image: string;
		video: string;
		tong: string;
	};
	serverInfo: {
		// serverUrl: string;
		protocol: 'http' | 'https';
		isRealDB: boolean;
		isRealServer: boolean;
		serverLinkList: ibServer.ServerLinkOption[];
	};
}
