namespace ifStore {
	/** 서비스 */
	export namespace Service {
		/** 포토 뷰어 */
		export namespace Gallery {
			type PhotoInfo = {
				auto_no: number;
				mem_no: number;
				mem_id: string;
				mem_sex: string;
				mem_photo: string;
				rprsn_yn: string;
				cert_yn: string;
				chrgr_name: string;
				upd_date: string;
			};
			export interface State {
				photoList: Array<PhotoInfo>;
			}
			type S = State;

			export interface Getters extends GetterTree<S> {
				getPhotoList(state: S): Array<PhotoInfo>;
			}

			export interface Mutations extends MutationTree<S> {
				SET_PHOTO_LIST(state: S, photoList: Array<PhotoInfo>): void;
				REMOVE_PHOTO(state: S, photoId: number): void;
				CHANGE_MAIN_IMAGE(state: S, nextPhotoId: number): void;
			}

			export interface Actions extends ActionTree<S> {
				setPhotoList(this: AT, ctx: AC<S>): void;
				removePhoto(this: AT, ctx: AC<S>, photoId: number): void;
				changeMainImage(this: AT, ctx: AC<S>, nextPhotoId: number): void;
			}
		}
	}
}
