/**
 * @description 새로고침을 하여도 store data 유지.
 * 3가지 방식 localStorage, cookie, secure-ls
 * localStorage 방식은 Client Side Rendering에서만 가능
 * cookie 방식은 서버로 전송이 가능. (js-cookie 라이브러리 사용.)
 * secure-ls 방식은 암호화 가능. (secure-ls 라이브러리 사용.)
 * https://www.npmjs.com/package/vuex-persistedstate
 */
import createPersistedState from 'vuex-persistedstate';

export default ({ store }) => {
	/** @type {import('vuex-persistedstate')} */
	createPersistedState({
		paths: [], // ['example.fastList'], // store  .구분으로 path 지정 가능
		// reducer: state => ({
		// 	fastList: state.fastList.fastList,
		// }),
	})(store);
};
