namespace ifStore {
	/** 서비스 */
	export namespace Service {
		/** 지갑 */
		export namespace Wallet {
			type MyCashInfo = {
				cash: string;
				credit: string;
				gender: string;
				btnLabel: string;
			};
			type MyJewelInfo = {
				cash: string;
				btnLabel: string;
			};
			export interface State {
				// TODO 데이터 확인되면 Object 타입 정의해야함.
				/** 전체 이용내역 리스트 */
				historyList: Array<object>;
				myCashInfo: MyCashInfo;
				myJewelInfo: MyJewelInfo;
				myItemList: Array<object>;
				shopItemList: Array<object>;
			}
			type S = State;

			export interface Getters extends GetterTree<S> {
				// TODO 데이터 확인되면 Object 타입 정의해야함.
				getHistoryList(state: S): Array<object>;
				getMyCashInfo(state: S): MyCashInfo;
				getMyJewelInfo(state: S): MyJewelInfo;
				getMyItemList(state: S): Array<object>;
				getShopItemList(state: S): Array<object>;
			}

			export interface Mutations extends MutationTree<S> {
				// TODO 데이터 확인되면 Object 타입 정의해야함.
				/** 전체 이용내역 리스트 셋팅 */
				SET_HISTORY_LIST(state: S, payload: Array<object>): void;
				SET_MY_CASH_INFO(state: S, payload: MyCashInfo): void;
				SET_MY_JEWEL_INFO(state: S, payload: MyJewelInfo): void;
				SET_MY_ITEM_LIST(state: S, payload: Array<object>): void;
				SET_SHOP_ITEM_LIST(state: S, payload: Array<object>): void;
			}

			export interface Actions extends ActionTree<S> {
				// TODO 데이터 확인되면 Object 타입 정의해야함. 실데이터 적용시 리턴타입 Promise로 변경
				/** 히스토리 리스트 업데이트 */
				setHistoryList(this: AT, ctx: AC<S>): void;
			}

			/** 출금 신청 - 확인 */
			export namespace Check {
				export interface State {}
				type S = State;

				export interface Getters extends GetterTree<S> {}

				export interface Mutations extends MutationTree<S> {}

				export interface Actions extends ActionTree<S> {}
			}

			/** 출금 신청 - 출금 신청 / 처리 현황 */
			export namespace Takeout {
				export interface State {}
				type S = State;

				export interface Getters extends GetterTree<S> {}

				export interface Mutations extends MutationTree<S> {}

				export interface Actions extends ActionTree<S> {}
			}

			/** 출금 신청 - 계좌 불러오기 */
			export namespace Account {
				export interface State {}
				type S = State;

				export interface Getters extends GetterTree<S> {}

				export interface Mutations extends MutationTree<S> {}

				export interface Actions extends ActionTree<S> {}
			}
		}
	}
}
