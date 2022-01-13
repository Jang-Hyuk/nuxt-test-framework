const serverOption = {
	host: {
		production: 'test.com',
		staging: 'test.com',
		dev: 'test.com',
	},
	url: {
		production: 'https://test.com',
		staging: 'https://test.com',
		dev: 'https://test.com',
	},
};

const serverConfig = {
	serverOption,
	/** @type {ibServer.ServerLinkOption[]} */
	serverLinks: [
		{
			id: 'production',
			name: '실서버',
			url: serverOption.url.production,
		},
		{
			id: 'staging',
			name: '스태이징 서버',
			url: serverOption.url.staging,
		},
	],
};

module.exports = serverConfig;
