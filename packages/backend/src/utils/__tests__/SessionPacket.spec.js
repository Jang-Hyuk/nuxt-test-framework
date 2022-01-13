const Mitm = require('mitm');
const SessionModel = require('be/models/Base');
const Logger = require('cm/loggers/Logger');
const conversionUtil = require('cm/utils/conversion');
const SessionPacketUtil = require('../SessionPacket');

jest.mock('be/models/Session');
jest.mock('cm/loggers/Logger');

describe('Name of the group', () => {
	const sessionServerInfo = {
		server_ip: '127.0.0.1',
		server_port: 8199,
	};

	let sessionModel;

	/** @type {SessionPacketUtil}  */
	let sessionPacketUtil;

	const commandInfo = {
		command: 'sendPmchatAppRun',
		toNo: '987654',
		data: {
			memNo: '123456',
			ptrNo: '999999',
			receiverRoomType: '11',
		},
	};

	let mitm;

	beforeEach(function () {
		// session model set
		// @ts-ignore
		sessionModel = new SessionModel();
		sessionModel.p_server_list = jest.fn().mockReturnValue(sessionServerInfo);

		// @ts-ignore
		sessionPacketUtil = new SessionPacketUtil({
			logger: new Logger(),
			sessionModel,
		});

		mitm = Mitm();

		mitm.on('connection', function (socket) {
			socket.write('Hello back!');
		});
	});

	afterEach(function () {
		mitm.disable();
	});

	test('connect', async () => {
		// client가 생성되어있다면 접속 불가
		await sessionPacketUtil.connect();
		// 붙어있는 상태에서 또 접속할려고 하면 불가
		await expect(sessionPacketUtil.connect()).rejects.toThrow();

		// 클라이언트 초기화
		sessionPacketUtil.client = undefined;

		expect(sessionPacketUtil.host).toBe(sessionServerInfo.server_ip);
		expect(sessionPacketUtil.port).toBe(sessionServerInfo.server_port);

		// 정상 적인 접근
		await sessionPacketUtil.connect();

		// 'connect' 이벤트가 발생해 client가 정의되야 한다.
		expect(sessionPacketUtil.client).not.toBeUndefined();
	});

	test('encoding test', () => {
		const commandInfo = {
			command: '1',
			toNo: '2',
			data: '',
		};

		const commandLength = conversionUtil.toString(commandInfo).length;

		// 데이터를 300개를 채워 넣는다.
		const arrayCount = 300;
		commandInfo.data = Array(arrayCount).fill('x').join('');

		const realCommand = conversionUtil.toString(commandInfo);
		// 336개의 총 길이
		const realCommandLength = commandLength + arrayCount;
		expect(realCommand).toHaveLength(realCommandLength);

		// 총 길이를 4byte little edian 변환 후 앞에 붙인 버퍼 반환
		const encodedCommand = sessionPacketUtil.toEncode(commandInfo);

		// 몇개가 들어왔는지 검증
		const encCommandLength = encodedCommand.readInt32LE(0);
		expect(encCommandLength).toBe(realCommandLength);

		// 실제 데이터를 구간을 잘라 변환 검증 수행
		const encCommandBuf = encodedCommand.slice(4, encCommandLength + 4 + 1);
		expect(encCommandBuf.toString()).toBe(realCommand);
	});

	test('send', async () => {
		const { command, toNo, data } = commandInfo;
		// @ts-ignore
		await expect(sessionPacketUtil.sendMessage(command, data)).resolves.toBeTruthy();
		await expect(
			// @ts-ignore
			sessionPacketUtil.sendMessageToMember(command, toNo, data),
		).resolves.toBeTruthy();

		// 연결을 접속
		sessionPacketUtil.client.destroy();

		expect(sessionPacketUtil.isConnected).toBeFalsy();

		await sessionPacketUtil.connect();

		expect(sessionPacketUtil.isConnected).toBeTruthy();

		await expect(
			// @ts-ignore
			sessionPacketUtil.sendMessageToMember(command, toNo, data),
		).resolves.toBeTruthy();
	});
});
