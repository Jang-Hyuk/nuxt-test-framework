/** @type {ifStore.Root.Actions} */
export const actions = {
	nuxtServerInit(storeContext, nuxtContext) {},

	setSessionServerInfo({ commit }, sessionServerInfo) {
		commit('SET_SESSION_SERVER', sessionServerInfo);
	},
};

export default actions;
