import { cloneDeep } from 'lodash';

/** @type {ifStore.Root.Getters} */
export const getters = {
	getActiveMenu: state => (route, type) => {
		const serviceList = ['chat', 'wallet', 'alarm', 'block'];
		const routePath = route.replace(/[/]$/, '');
		const pathList = routePath.split('/');
		let pathIndex = 0;
		serviceList.forEach(v => {
			if (pathList.includes(v)) {
				pathIndex = pathList.findIndex(pathValue => pathValue === v);
			}
		});
		const menuInfo = type === 'footer' ? type : pathList[pathIndex];
		// @ts-ignore
		const list = cloneDeep(state.menuList[menuInfo] || state.menuList.service);
		list.forEach(v => {
			v.isActive = v.path.includes(routePath);
		});
		return list;
	},
};

export default getters;
