namespace iUser {
	/** 접속 디바이스 정보 */
	export interface Device {
		/** App Version */
		G_CHNL: string;
		/** App 여부 */
		isApp: boolean;
	}

	/** Login 시도 회원 정보 */
	export interface UserLoginForm {
		memId: string;
		passWd: string;
		/** latitude|longitude 조합 */
		gpsCoord: string;
		/** 타입[b:일반회원,k:카카오,n:네이버] */
		memSlct: string;
	}

	/** Login 성공 회원 정보 (DB) */
	export interface User extends Device {
		id: string;
		age: number;
		writedate: Date;
	}

	export type UserGps = {
		memNo: number;
		/** 위도 */
		lat: string;
		/** 경도 */
		lot: string;
	};

	/** user-agent를 분석하여 나온 Client App 정보 */
	interface AppInfo {
		appName?: string;
		/** 스마트폰구분 (a:안드로이드,b:아이폰) */
		smtpSlct: string;
		/** 디바이스 ID */
		smtpId: string;
		appVer: string;
		phoneVer: string;
	}

	/** 클럽 로그인할때 사용되는 정보 */
	export interface ClubLoginUser extends AppInfo {
		memId: string;
		passWd: string;
		memIp: string;
		userAgent: string;
		svrIp: string;
		sessKey: string;
		smtpToken: string;
		memSlct: string;
		memChnl: number;
	}

	/** 접속 장치 정보 */
	export interface ClientEnvInfo extends AppInfo {
		isApp: boolean;
		isARD: boolean;
		isIOS: boolean;
		isMOB: boolean;
		/** w(pc_web),x(mobile_web),s(app) */
		media: string;
		/** 앱 버젼 */
		G_CHNL: number;
	}

	type loginUserType = ibProc.c_session.p_smtphone_logIn.firstSuccessType[0];

	export interface CookieUser {
		NO: loginUserType['mem_no'];
		ID: loginUserType['mem_id'];
		SEX: loginUserType['mem_sex'];
		NICK: loginUserType['mem_nick'];
		AGE: loginUserType['mem_age'];
		BYEAR: loginUserType['mem_birth_year'];
		LEVEL: loginUserType['mem_level'];
		SESS_KEY: loginUserType['sess_key'];
		MEDIA: string;
		GROUP_NO: string;
		CHNL: number;
		LASTLOG_DT: loginUserType['mem_lastlog_dt'];
		LAT?: number;
		LOT?: number;
		/** 스페셜 회원일 경우 S */
		M_AUTH?: string;
		/** 스페셜 회원 종료일 */
		END_DT?: string;
		ISADMIN?: boolean;
		/** Admin일 경우 sess_key 정의 */
		ADMIN?: string;

		/** 지역 중분류 코드 (A01, B01, C01, ...etc) */
		LOC?: string;
		/** 지역 중분류 코드 앞자리를 소문자로 ?(a, b, c, ...etc) */
		SLCT?: string;
	}
}
