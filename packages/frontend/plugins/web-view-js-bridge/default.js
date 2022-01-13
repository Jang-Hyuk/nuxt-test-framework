export default {
	debug: true,
	schemaName: 'yy',
	delay: 200,
	nativeHandlerName: 'callFromWeb',
	mock: false,
	/**
	 * @description 개발 단계의 mockHandler 서비스는 Mock과 함께 사용해야 합니다. mock은 둘 다 설정되어야 적용됩니다. 함수입니다. 첫 번째 매개변수는 페이로드를 수신하고, 두 번째 매개변수는 브리지 콜백 함수를 수신합니다.
	 */
	mockHandler(payload, next) {
		next({ form: 'native', ...payload });
	},
	// mockHandler: null,
};
