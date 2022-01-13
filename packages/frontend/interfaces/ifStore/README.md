## Store 정의

getters:
GetterFn -> State, Return
GetterParamFn -> State, Param, Return

- type, interface 명칭은 Pascal Case로 한다
- State, Getters, Mutations, Actions 에 사용할 type이 필요할 경우 해당하는 해당 컨셉 위에서 정의하고 사용한다.
- Store 뿐만 아니라 *.vue 파일에서도 접속이 필요할 경우 export type 한다

# State
State를 기본으로 사용하되 State 를 사용하는 getters, mutations, actions 제네릭 타입을 간소화 하기위하여 type S 를 정의

# Actions
payload 데이터 이름은 의미에 맞추어 이름을 부여한다
각 메소드의 return type은 반드시 기록한다.



```ts
namespace ifStore {
	export namespace Example {
		export interface State {
			/** 개발 서버 여부 */
			isDevServer: false;
			/** Count 숫자 */
			count: number;
			/** 문자 */ str: string;
			/** 메시지 목록 */
			messages: string[];
		}
    /** State Alias */
    type S = State;

		/** 예제 목록 */
		type Examples = {
			name: string;
			age: number;
		}[];

		export interface Getters extends GetterTree<S> {
			/** Getters 기본 형태. bollean 값 반환  */
			isDevServer(state: S): boolean;
			/** Getters 기본 형태. bollean 값 반환  */
			hasOperationKey(state: S): boolean;
			/** Getters 기본 형태. Generic을 이용하여 정의  */
			getValue(state: S): number;
			/** 메소드 형식을 띈 Getters 형태. 수동으로 정의한다 */
			getSubNavigations: (
				state: S,
			) => (mainPath: string, subPath: string) => Examples[];
		}

		/** 메시지 내용을 변경시키고자 할 경우 */
		type MsgChangeOption = {
			/** 일치 문자 */
			matchCharacter: string;
			/** 변경 문자 */
			replaceCharacter: string;
		};

		export interface Mutations extends MutationTree<S> {
			/** set Count */
			SET_COUNT(state: S, count: number): void;
			/** Count 값 증감 */
			ADD_COUNT(state: S, count: number): void;
			/** Msg 내용 변경 */
			CHANGE_MESSAGES(state: S, MsgChangeOption): void;
			/** Msg 목록 일부분 삭제. number라면 index부터 삭제, string일 경우 해당 단어 삭제   */
			REMOVE_MESSAGES(state: S, condition: number | string): void;
		}

		/**
		 * 메시지 변경 조건. actions 접두사를 맨 뒤로 보내어 작성한 후 타입 성격 추가
		 * export로 내보낼 경우 vue 파일에서 해당 타입을 검색할 수 있어 타입을 작성하는데 좋다
		 * @example
		 *  *.vue script 영역 안에서 jsdoc 형식으로 불러온다.
		 *  `/** @type {Dev.MessagesChangeOption} * /`
		 */
		export type MessagesChangeOption = {
			/** 메시지 변경 조건 */
			condition: string;
			/** 예제 데이터 */
			exampleValue: number;
		};

		export interface Actions extends ActionTree<S> {
			// ↓↓↓ 직접적인 데이터 조작에 관해서 이루어 질 경우
			/** Count 업데이트 */
			setCount(this: AC, ctx: AC<S>, count?: any): void;
			/** User 업데이트 */
			addCount(this: AC, ctx: AC<S>, count?: any): void;
			/** 메시지 변경 */
			changeMessages(this: AC, ctx: AC<S>, MessagesChangeOption): void;

			// ↓↓↓ 서비스 측면에서 호출될 경우
			/** 이미지 업로드 */
			uploadImages(this: AC, ctx: AC<S>, payload: any): Promise<any>;
		}
	}
}

```
