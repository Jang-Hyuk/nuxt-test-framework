export interface pluginOption<P = any, R = any> {
	debug?: boolean;
	delay?: number;
	nativeHandlerName: string;
	mock?: boolean;
	mockHandler?: (payload: P, next: (response: R) => void) => void;
}

// declare const VueJsBridge: VueJsBridge;

type callHandlerParam = {
	/** native에서 실행할 함수 명 */ cmd: string;
	/** 해당 함수에 넘겨줄 인자 */ data?: any;
	/**  */ handler?: any;
};
export class VueJsBridgePlugin {
	constructor(options: pluginOption);

	private init(callback: (bridge: Bridge) => void);

	public callHandler<P extends callHandlerParam, R>(payload: P): Promise<R>;

	public registerHandler<D, P = any>(
		name: string,
		fn: (data: D, callback: (payload?: P) => void) => void,
	): void;
}

export default VueJsBridgePlugin;
