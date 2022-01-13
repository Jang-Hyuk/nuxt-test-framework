namespace ifStore {
	export namespace Dev {
		export interface State {}
		type S = State;

		export interface Getters extends GetterTree<S> {}

		export interface Mutations extends MutationTree<S> {}

		export interface Actions extends ActionTree<S> {
			/** 서버점검 */
			checkServer(this: AT, ctx: AC<S>, payload: number);
		}
	}
}
