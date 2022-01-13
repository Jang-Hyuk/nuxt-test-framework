namespace ifStore {
	/** 서비스 */
	export namespace Service {
		/** 빠른 만남 */
		export namespace FastMeet {
			export interface State {}
			type S = State;

			export interface Getters extends GetterTree<S> {}

			export interface Mutations extends MutationTree<S> {}

			export interface Actions extends ActionTree<S> {}

			/** 빠른 만남 - 대화함 */
			export namespace Chat {
				export interface State {}
				type S = State;

				export interface Getters extends GetterTree<S> {}

				export interface Mutations extends MutationTree<S> {}

				export interface Actions extends ActionTree<S> {}
			}

			/** 빠른 만남 - 알림 설정 */
			export namespace Alarm {
				export interface State {}
				type S = State;

				export interface Getters extends GetterTree<S> {}

				export interface Mutations extends MutationTree<S> {}

				export interface Actions extends ActionTree<S> {}
			}
		}
	}
}
