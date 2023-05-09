/** @returns {ifStore.Root.State} */
export const state = () => ({
	sessionServerInfo: {
		isConnected: false,
		onMark: '',
		offMark: '',
		host: '',
	},
	count: 0,
	menuList: {
		service: [
			{
				name: 'header.menu.talk',
				path: ['/service/fast-1'],
				isActive: false,
			},
			{
				name: 'header.menu.meeting',
				path: ['/service/fast-2'],
				isActive: false,
			},
		],
	},
});
export default state;
