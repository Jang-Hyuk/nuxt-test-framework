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
				path: ['/service/fast-video'],
				isActive: false,
			},
			{
				name: 'header.menu.meeting',
				path: ['/service/fast-meet'],
				isActive: false,
			},
		],
		chat: [
			{
				name: 'header.menu.talk',
				path: ['/service/fast-video/chat'],
				isActive: false,
			},
			{
				name: 'header.menu.meeting',
				path: ['/service/fast-meet/chat'],
				isActive: false,
			},
		],
		alarm: [
			{
				name: 'header.menu.talk',
				path: ['/service/fast-video/alarm'],
				isActive: false,
			},
			{
				name: 'header.menu.meeting',
				path: ['/service/fast-meet/alarm'],
				isActive: false,
			},
		],
		block: [
			{
				name: 'header.menu.talk',
				path: ['/service/fast-video/block'],
				isActive: false,
			},
			{
				name: 'header.menu.meeting',
				path: ['/service/fast-meet/block'],
				isActive: false,
			},
		],
		footer: [
			{
				/** 홈 */
				name: 'home',
				path: ['/service/fast-video', '/service/fast-meet'],
				isActive: true,
			},
			{
				/** 대화함 */
				name: 'msg',
				path: ['/service/fast-video/chat', '/service/fast-meet/chat'],
				isActive: false,
			},
			{
				/** 지갑 */
				name: 'wallet',
				path: ['/service/wallet'],
				isActive: false,
			},
		],
	},
});
export default state;
