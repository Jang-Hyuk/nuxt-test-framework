namespace ifStore {
	/** 서비스 */
	export namespace Service {
		/** Help */
		export namespace Help {
			export interface State {}
			type S = State;

			export interface Getters extends GetterTree<S> {}

			export interface Mutations extends MutationTree<S> {}

			export interface Actions extends ActionTree<S> {}

			/** 공지 사항 */
			export namespace Notice {
				export interface State {}
				type S = State;

				export interface Getters extends GetterTree<S> {}

				export interface Mutations extends MutationTree<S> {}

				export interface Actions extends ActionTree<S> {}
			}

			/** 고객 문의 */
			export namespace Takeout {
				export interface State {}
				type S = State;

				export interface Getters extends GetterTree<S> {}

				export interface Mutations extends MutationTree<S> {}

				export interface Actions extends ActionTree<S> {}
			}
		}
	}
}
