namespace ifStore {
	export namespace Ui {
		export namespace Popup {
			type CallInfo = {
				nick: string;
				age: number;
				memSex: string;
				distance: string;
				description: string;
			};
			export interface State {
				isPopup: boolean;
				callCount: number;
			}
			type S = State;

			export interface Getters extends GetterTree<S> {}

			export interface Mutations extends MutationTree<S> {
				/** 이벤트 팝업 출력 여부 */
				SET_EVENT_POPUP(state: S, payload: boolean): void;
				/** 요청 팝업 횟수 */
				SET_CALL_COUNT(state: S, type: string): void;
			}

			export interface Actions extends ActionTree<S> {
				/** 이벤트 팝업 호출 */
				toggleEventPopup(this: AT, ctx: AC<S>);
				/** Call 팝업 호출 */
				toggleCallPopup(
					this: AT,
					ctx: AC<S>,
					payload: { callInfo: CallInfo; isUse: boolean },
				);
			}
		}
	}
}
