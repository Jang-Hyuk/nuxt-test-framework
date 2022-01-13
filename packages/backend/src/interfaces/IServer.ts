/** 서버 관련 */
namespace ibServer {
	/**
	 * 빠른 만남
	 * @example
	 * Frontend Server Base Port 가 8200이고 pointIndex가 5라면 포트는 8050번
	 */

	/**
	 * 2가지 용도로 사용되어 진다.
	 * ① (host) 서버 host 포트를 결정
	 * ② (ops) 운영 중인 Production, Staging, Development 서버 목록 생성
	 * @example
	 * ① (host) 서버 host 포트 결정 (process.env, ServerLinkOption[id, portIndex, url] 사용)
	 * process.env의 USER(default), DEV_ID(dotenv), PORT(dotenv) 가져옴
	 * DEV_ID가 지정되어 있다면 해당 아이디를, 아니라면 USER를 가져와 ServerLinkOption[id] 일치 정보 추출
	 * BASE_PORT(8200) + ServerLinkOption[portIndex] * 10 을 증가하여 PORT 정의
	 * process.env.PORT가 정의되어 있다면 상기의 PORT에 재정의
	 * @example
	 * ② (ops) 운영 중인 Production, Staging, Development 서버 목록 생성
	 * ServerLinkOption 목록을 이루고 있는 code.server.serverLinks 로딩
	 */
	export interface ServerLinkOption {
		/** (host) 개발자 Id or Server Id */
		id: string;
		/** (ops) 개발자 명 or 서버 명 */
		name: string;
		/** (host, ops) 기준 Port에 더할 값 (서버마다 고유해야함) */
		portIndex?: number;
		/** 개발자 회사 PC ip Host ID */
		hostId?: number;
		/** (ops) 호스팅 주소를 입력하고자 할 경우 */
		url?: string;
	}
}
