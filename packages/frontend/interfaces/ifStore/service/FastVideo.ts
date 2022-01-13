namespace ifStore {
	/** 서비스 */
	export namespace Service {
		/** 빠른 대화 */
		export namespace FastVideo {
			export interface State {}
			type S = State;

			export interface Getters extends GetterTree<S> {}

			export interface Mutations extends MutationTree<S> {}

			export interface Actions extends ActionTree<S> {}

			/** 빠른 대화 - 대화함 */
			export namespace Chat {
				export interface State {}
				type S = State;

				export interface Getters extends GetterTree<S> {}

				export interface Mutations extends MutationTree<S> {}

				export interface Actions extends ActionTree<S> {}

				/** 빠른 대화 - 대화함 상세 */
				export namespace Detail {
					export interface State {}
					type S = State;

					export interface Getters extends GetterTree<S> {}

					export interface Mutations extends MutationTree<S> {}

					export interface Actions extends ActionTree<S> {}
				}
			}

			/** 빠른 대화 - 차단 회원 관리 */
			export namespace Block {
				export interface State {}
				type S = State;

				export interface Getters extends GetterTree<S> {}

				export interface Mutations extends MutationTree<S> {}

				export interface Actions extends ActionTree<S> {}
			}

			/** 빠른 대화 - 알림 설정 */
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
