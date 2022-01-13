namespace icSessionPacket {
	export type SessionPacketFormat = {
		command: string;
		toNo: string;
		data: any;
	};

	/** 빠른 만남 */
	export interface FastMeet {}

	/** 임시 */
	export interface Main {
		sendPmchatAppRun: {
			/** 회원 번호 */
			memNo: string;
			/** 파트너 번호 */
			ptrNo: string;
			/** 수신 방 타입 */
			receiverRoomType: '11';
		};
	}

	/** 모든 명령 집합 */
	export interface Commands extends FastMeet, Main {}
}
