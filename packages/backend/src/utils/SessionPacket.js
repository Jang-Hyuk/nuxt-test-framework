const net = require('net');

/**
 * Node Session Server에 접속하고 데이터를 보내는 클래스.
 * Session Server는 기본적으로 3초(?)안에 메시지를 받지 않으면 close 시키는 것으로 보임
 */
class BeSessionPacketUtil {
	/** @type {net.Socket}  */
	client;

	/** @type {string} */
	host = '';

	/** @type {number} */
	port = 0;

	/** @param {import('be/types').DependencyInjection} opt */
	constructor(opt) {
		this.sessionModel = opt.sessionModel;

		this.logger = opt.logger;
	}

	/** client가 붙어있는지 확인 */
	get isConnected() {
		return this.client !== undefined && this.client?.destroyed === false;
	}

	/** 접속 세션 서버 url */
	get sessionServerUrl() {
		return `${this.host}:${this.port}`;
	}

	/** Connect Socket Server */
	connect() {
		// 서버 정보가 없을 경우

		return new Promise((resolve, reject) => {
			if (this.isConnected) {
				reject(
					new Error(`Already Connected Session Packet Server. ${this.sessionServerUrl}`),
				);
			}

			const client = net.connect(this.port, this.host);

			client.on('connect', () => {
				this.logger.info(`Connected Session Packet Server : ${this.sessionServerUrl}`);
				this.client = client;
				resolve();
			});

			client.on('close', () => {
				this.logger.info(`Session Packet Closed. ${this.sessionServerUrl}`);
				this.client.destroy();
			});

			client.on('data', data => {});

			client.on('end', () => {
				// this.logger.info(`Session Packet End. ${this.sessionServerUrl}`);
			});

			client.on('error', error => {
				this.logger.error(`Session Packet Error.${error}`);
				reject(error);
			});
		});
	}

	/**
	 * 상대방 사용자를 직접 지정하지 않을 때 사용
	 * @template {keyof icSessionPacket.Commands} K - K는 보낼 명령 ID. string 이어야 합니다.
	 * @param {K} command 서버에서 구분할 커맨드다. 이값에 따라서 서버에서는 처리하는 함수가 다를것이다.
	 * @param {icSessionPacket.Commands[K]} data 데이타는 자유롭게 넣으면 된다. 이 메시지가 수신자에게 그대로(JSON 형태로) 보내질것이다. 물론 수신쪽에서는 해당 $command 에 대하여 JSON 으로 받을 준비가 되어 있어야 한다.
	 */
	sendMessage(command, data) {}

	/**
	 * 클럽 세션서버에 보내질 새로운 규약의 세션패킷을 보내는 함수다.
	 * @template {keyof icSessionPacket.Commands} K - K는 보낼 명령 ID. string 이어야 합니다.
	 * @param {K} command 서버에서 구분할 커맨드다. 이값에 따라서 서버에서는 처리하는 함수가 다를것이다.
	 * @param {string} toNo 받을회원번호 (이 메시지를 누구한테 보낼것이냐?)
	 * @param {icSessionPacket.Commands[K]} data 최종 유저한테 보내질 메시지, 데이타는 자유롭게 넣으면 된다. 이 메시지가 수신자에게 그대로(JSON 형태로) 보내질것이다. 물론 수신쪽에서는 해당 $command 에 대하여 JSON 으로 받을 준비가 되어 있어야 한다.
	 */
	sendMessageToMember(command, toNo, data) {}

	/**
	 * Socket Server로 메시지 전송
	 * @alias writeString
	 * @param {Buffer | string} data 전송 데이터
	 */
	async #send(data) {
		if (this.isConnected === false) {
			await this.connect();
		}

		// global.logger.debug(data.toString());

		return new Promise((resolve, reject) => {
			this.client.write(data, err => {
				if (err) {
					reject(err);
				}
				resolve(true);
			});
		});
	}
}

module.exports = BeSessionPacketUtil;
