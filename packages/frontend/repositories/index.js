import testRepository from './testRepository';

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} $axios
 */
export default $axios => ({
	/** 테스트 레포지토리 패턴 작성 가이드 */
	test: testRepository($axios),
});
