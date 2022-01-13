namespace ifStore {
	export namespace Service {
		export namespace Event {
			export interface State {}
			type S = State;

			export interface Getters extends GetterTree<S> {}

			export interface Mutations extends MutationTree<S> {}

			export interface Actions extends ActionTree<S> {}
		}
	}
}
