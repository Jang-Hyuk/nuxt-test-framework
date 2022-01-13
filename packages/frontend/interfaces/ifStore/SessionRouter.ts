namespace ifStore {
	export namespace SessionRouter {
		export interface State {}
		type S = State;

		export interface Getters extends GetterTree<S> {}

		export interface Mutations extends MutationTree<S> {}

		export type Actions = {
			[key in keyof icSessionPacket.Commands]: (
				this: AT,
				ctx: AC<S>,
				payload: icSessionPacket.Commands[key],
			) => Promise<any> | any;
		} & ActionTree<S>;
	}
}
