namespace ifStore {
	export namespace Ui {
		export namespace Snack {
			type SnackInfo = {
				content: string;
				color: string;
			};
			export interface State {
				/** 스낵바 내용 */
				content: string;
				/** 스낵바 컬러 */
				color: string;
			}
			type S = State;

			export interface Getters extends GetterTree<S> {}

			export interface Mutations extends MutationTree<S> {
				/** 스낵바 출력 여부 */
				showMessages(state: S, payload: SnackInfo): void;
			}

			export interface Actions extends ActionTree<S> {}
		}
	}
}
