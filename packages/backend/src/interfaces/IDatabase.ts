namespace iDatabase {
	export type DBOption = {
		/** DB Alias */
		alias?: string;
		/** (기본값: localhost) 접속 경로 */
		host?: string;
		/** (기본값: root) 접속 ID */
		user?: string;
		/** 접속 PW */
		password: string;
		/** (기본값: test) 접속 this.db */
		database?: string;
		/** (기본값: true) 사용 가능한 연결이 없고 제한에 도달한 경우 풀의 작업을 결정합니다. true인 경우 풀은 연결 요청을 대기열에 넣고 사용할 수 있게 되면 이를 호출합니다. false인 경우 풀은 즉시 오류와 함께 콜백합니다. */
		waitForConnections: boolean;
		/** (기본값: 10) 한 번에 만들 수 있는 최대 연결 수입니다. */
		connectionLimit?: number;
		/** (기본값: 0) getConnection에서 오류를 반환하기 전에 풀이 대기열에 넣을 최대 연결 요청 수입니다. 0으로 설정하면 대기 중인 연결 요청 수에 제한이 없습니다. */
		queueLimit?: number;
		/** 인코딩 셋 */
		charset?: 'euckr' | 'utf-8';
	};
}
