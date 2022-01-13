namespace ifStore {
	export namespace Server {
		type ServerInfo = {
			isCheckServer: boolean;
			startTime: string;
			endTime: string;
			serverMsg: string;
		};
		export interface State {
			/** 서버점검 확인 여부 */
			isCheckServer: boolean;
			/** 사내 아이피 확인 여부 */
			isCompanyIp: boolean;
			/** 시작시간 */
			startTime: string;
			/** 만료시간 */
			endTime: string;
			/** 점검 메세지 */
			serverMsg: string;
		}
		type S = State;

		export interface Getters extends GetterTree<S> {}

		export interface Mutations extends MutationTree<S> {
			/** 서버점검 데이터 변경 */
			setCheckServer(state: S, payload: ServerInfo): void;
			/** 사내 아이피 확인 여부 */
			setCheckCompanyIp(state: S, payload: boolean): void;
		}

		export interface Actions extends ActionTree<S> {
			/** 서버점검  */
			checkServer(this: AT, ctx: AC<S>, payload: ServerInfo);
			/** 사내 아이피 확인 */
			checkCompanyIp(this: AT, ctx: AC<S>);
		}
	}
}
