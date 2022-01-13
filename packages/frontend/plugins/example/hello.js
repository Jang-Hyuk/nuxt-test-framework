/** @type {import('@nuxt/types').Plugin} 헬로우 출력 예제 */
const plugins = ({ $axios, redirect }, inject) => {
	// server: $hello, client: this.$hello 사용 가능
	inject('hello', msg => console.log(msg));

	// Axios 요청시 404 에러가 발생하였을 경우 sorry 페이지로 리다이렉트
	$axios.onError(error => {
		if (error.response.status === 404) {
			redirect('/sorry');
		}
	});
};

export default plugins;
