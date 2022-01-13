namespace ifStore {
	/** S: State, RT: Return Type */
	export type Getter<S, RT> = (
		state: S,
		getters: any,
		rootState: ifStore.Root.State,
		rootGetters: any,
	) => RT;

	/** S: State, P: Payload */
	export type Mutation<S, P> = (state: S, payload?: P) => any;

	// FIXME Action 정의를 깔끔하게 정의하는 방법 필요
	type RootState = ifStore.Root.State;

	/** Action This */
	export type AT = import('vuex').Store<RootState>;

	/** Action Context */
	export type AC<S> = import('vuex').ActionContext<S, RootState>;

	export interface GetterTree<S> {
		[key: string]: import('vuex').Getter<S, ifStore.Root.State>;
	}

	export interface MutationTree<S> {
		[key: string]: import('vuex').Mutation<S>;
	}

	export interface ActionTree<S> {
		[key: string]: import('vuex').Action<S, RootState>;
	}
	export namespace Root {
		export type SessionServerInfo = {
			isConnected: boolean;
			onMark: string;
			offMark: string;
			host: string;
		};

		export interface State {
			/** Nodejs socket.io 서버  */
			sessionServerInfo: SessionServerInfo;
			count: number;
			menuList: object;
		}
		type S = State;

		export interface Getters extends GetterTree<S> {
			getActiveMenu: (state: S) => (route: string, type: string) => {};
		}

		export interface Mutations extends MutationTree<S> {
			/** Node Session 접속 정보 */
			SET_SESSION_SERVER(state: State, sessionServerInfo: SessionServerInfo);
		}

		export interface Actions extends ActionTree<S> {
			/** Node Session 접속 정보 정의 */
			setSessionServerInfo(
				this: AT,
				ctx: AC<S>,
				sessionServerInfo: SessionServerInfo,
			): void;
		}
	}
}
