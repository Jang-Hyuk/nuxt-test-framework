const resource = '/api/dev';

/**
 * 테스트 레포지토리 패턴 작성 가이드
 * @param {ifBase.AxiosInstance} $axios
 */
export default $axios => ({
	/**
	 * All Read
	 * @param {string | object} [query]
	 * @returns {Promise<ifBase.AxiosReponse<any>>}
	 */
	all(query) {
		return $axios.get(resource, {
			params: query,
		});
	},

	/**
	 * Read
	 * @param {string} id (params) readId
	 * @returns {Promise<ifBase.AxiosReponse<any>>}
	 */
	read(id) {
		return $axios.get(`${resource}/${id}`);
	},

	/**
	 * Create
	 * @param {object} body 생성 데이터
	 * @returns {Promise<ifBase.AxiosReponse<any>>}
	 */
	create(body) {
		return $axios.post(`${resource}`, body);
	},

	/**
	 * Update
	 * @param {string} id (params) updateId
	 * @param {object} body 수정 데이터
	 * @returns {Promise<ifBase.AxiosReponse<any>>}
	 */
	update(id, body) {
		return $axios.put(`${resource}/${id}`, body);
	},

	/**
	 * Delete
	 * @param {string} id (params) deleteId
	 * @returns {Promise<ifBase.AxiosReponse<any>>}
	 */
	delete(id) {
		return $axios.delete(`${resource}/${id}`);
	},
});
