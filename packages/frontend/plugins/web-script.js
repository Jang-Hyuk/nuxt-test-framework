// import bridgeRouter from '~/plugins/web-script/bridge-rotuer.js';

/** @type {import('@nuxt/types').Plugin} 사용자 정의 플러그인 */
export default (ctx, inject) => {
	globalThis.getBridge = data => {
		ctx.$toast.show(`${data}:getBridge`);
	};
	globalThis.$ = {
		/**
		 * 뒤로가기 버튼을 눌렀을때, 엑티비티에 히스토리에 스택이 한개도 없을때 호출한다
		 * 해쉬에 있는값은 히스토리 스택에 포함되지 않는다
		 *
		 * @param data.isMain {Boolean}
		 */
		appExitEvent: data => {
			ctx.$toast.show(`뒤로가기${JSON.stringify(data)}`);
			// console.log(this.$nuxt);
			// if (backButtonAction.getDepth() > 0) {
			// 	history.back();
			// 	return;
			// }
			// if (data.isMain) {
			// 	app.enddingPopupV2();
			// } else {
			// 	app.closeWin();
			// }
		},
		getBridge: data => {
			ctx.$toast.show(`${data}aa`);
		},
		/**
		 * 자식윈도우 닫기/전체닫기 실행 결과 받기
		 * @param _data
		 */
		closeWinRecv: _data => {
			ctx.$toast.show(`closeWin${_data.data}`);
			// app.closeWinFunc.receive(_data.data);
		},

		/**
		 * 앱에서 통화종료후 웹뷰로 호출해 주는 함수
		 * @param _data
		 */
		endPhoneCall: _data => {
			// if (cookie.enc('gCCV:SEX') === 'm' && _data.ptrSex === 'f' && _data.callTime > 60) {
			// 	vueBus.$emit('callEndPop', _data);
			// }
		},
		/**
		 * push를 받아서 실행
		 * @param {object} data
		 * @param {boolean} action
		 */
		webScript: (data, action) => {
			// const { $cookie } = ctx;
			// const gCCV = $cookie.get('gCCV');
			// if (!gCCV) {
			// 	// app.notLogin(JSON.parse(action));
			// 	return;
			// }
			// data.ptrId = data.ptrId ? data.ptrId : data.ptrID; /** data compatible */

			// const gCCVNO = ctx.$cookie.get('ID');
			// if (gCCVNO === 'clubapp1' || gCCVNO === 'clubapp2' || gCCVNO === 'aosid') {
			// 	return;
			// }
			if (
				data.ptrId === 'clubapp1' ||
				data.ptrId === 'clubapp2' ||
				data.ptrId === 'aosid'
			) {
				return;
			}

			let linkScript = '';
			console.log(data.type);
			switch (data.type) {
				/**
				 * 빠른만남 메시지 수신
				 */
				case '11': {
					linkScript = `app.openWin("/fastMeetMsg/detailMsg?ptrMemNo=${data.contsNo}");`;
					break;
				}

				/**
				 * 빠른대화 - 요청하기
				 */
				case '73': {
					linkScript = `vueBus.$emit("fastVideoRequestPop",${data.etc})`;
					break;
				}

				/**
				 * #6082 빠른대화 랭킹 순위 변동
				 */
				case '117': {
					// 백그라운드 노티에서 클릭 되었을때만 작동
					if (action === false) {
						linkScript = "window.location.href='/event/ranking'"; // 빠른 대화 랭킹 페이지로 이동
					}
					break;
				}

				/**
				 * #6562 빠른대화 랭킹 순위 1위 ~ 20위 까지 발송
				 */
				case '118': {
					// 백그라운드 노티에서 클릭 되었을때만 작동
					if (action === false) {
						linkScript = "window.location.href='/event/ranking'"; // 빠른 대화 랭킹 페이지로 이동
					}
					break;
				}

				/**
				 * 최근대화상대 접속알림
				 */
				case '401': {
					const decEtc = decodeURIComponent(data.etc);
					const etc = JSON.parse(decEtc);
					const param = { pmemId: data.ptrId };
					// if (etc.hasOwnProperty('pmemNo') && etc.pmemNo !== '0') {
					// 	param.pmemNo = etc.pmemNo;
					// }
					linkScript = `vueBus.$emit("fastVideoRecentPtrPop",${JSON.stringify(param)})`;
					break;
				}
				/**
				 * 퀸오브퀸 이벤트
				 */
				case '141': {
					linkScript = "window.location.href='/queen'";
					break;
				}
				default:
					break;
			}

			/** 앱이 실행중일때와 비실행(슬립)일때로 구분해서 처리 */
			if (action === true) {
				/** 앱이 실행 중 일때 */
				// 최근대화상대 접속알림 (푸시서버에서 푸시만 발송하기 때문에 세션처리 없음)
				if (data.type === '401') {
					// eval(linkScript);
				}
			} else {
				/** 앱이 슬립이나 비실행 중 일때(노티피케이션을 통한 요청) */
				// eval(linkScript);
			}
		},
	};
};
