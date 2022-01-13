/** @type {ifStore.Root.Mutations} */
export const mutations = {
	SET_SESSION_SERVER(state, sessionServerInfo) {
		state.sessionServerInfo = sessionServerInfo;
	},
};
export default mutations;
