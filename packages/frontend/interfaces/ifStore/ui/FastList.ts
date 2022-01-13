namespace ifStore {
	export namespace Ui {
		export namespace FastList {
			type ListInfo = {
				id: number;
				slug: number;
				title: string;
				description: string;
				height: string;
				countries: string[];
				continent: string;
				image: string;
				dir: string;
				path: string;
				updateAt: string;
			};

			type ListOptInfo = {
				/** 리스트 데이터 reset 여부 */
				reset: boolean;
				/** 검색 데이터 여부 */
				search: boolean;
				/** 불러온 리스트 데이터 */
				data: ListInfo[];
			};

			export interface State {
				/** 출력된 리스트 데이터 */
				fastList: object[];
				/** 리스트 더보기 여부 판단 */
				isMoreList: boolean;
				/** 리스트 불러오는 개수 */
				fastLimit: number;
				/** 검색 목록 */
				searchList: object[];
				/** 리스트 로딩 여부 */
				isFastLoading: boolean;
			}
			type S = State;

			export interface Getters {
				/** 검색 list */
				getSearchList: () => (data: object[]) => object[];
				/** 성별 한글로 변환 */
				getReplaceGender: () => (data: string) => string;
				/** 유저 닉네임, 성별, 나이 종합 정보 */
				getFastTitle: (
					state: S,
					getters: Getters,
				) => (title: string, gender: string, age: number) => string;
			}

			export interface Mutations extends MutationTree<S> {
				/** 리스트 */
				updateFastList(state: S, payload: ListOptInfo): void;
				/** 검색 리스트 */
				updateSearchList(state: S, payload: object[]): void;
				/** 리스트 불러오기 로딩 show/hide  */
				updateFastListLoading(state: S, payload: boolean): void;
			}

			export interface Actions extends ActionTree<S> {
				/** 리스트 데이터 가져오기 */
				fetchFastList(this: AT, ctx: AC<S>, payload: object);
				/** 검색 목록 데이터 가져오기 */
				fetchSearchList(this: AT, ctx: AC<S>);
			}
		}
	}
}
