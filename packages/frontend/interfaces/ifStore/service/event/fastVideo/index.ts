namespace ifStore {
	export namespace Service {
		export namespace Event {
			export namespace FastVideo {
				/** 회차정보 */
				type RankingDist = {
					/** 회차 번호 */
					distNo: number;
					/** 회차 시작 날짜 */
					distStart: number;
					/** 회차 끝 날짜 */
					distEnd: number;
					/** 회차 발표일자 */
					distWin: number;
					/** 현재 진행회차 여부 */
					isLatestDist: boolean;
				};
				export interface State {
					rankingDist: RankingDist;
				}
				type S = State;

				export interface Getters extends GetterTree<S> {
					getRankingDist(state: S): RankingDist;
				}

				export interface Mutations extends MutationTree<S> {
					/** 회차 랭킹 정보 */
					SET_RANKING_DIST(state: S, payload: RankingDist): void;
				}

				export interface Actions extends ActionTree<S> {
					// leave(this: AT, ctx: AC<S>, payload: { memId: string; inputPw: string });
					rankingDist(this: AT, ctx: AC<S>, payload: { distNo: number });
				}
			}
		}
	}
}
