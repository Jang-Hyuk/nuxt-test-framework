<template>
	<div>
		<dl>
			<!-- <dt>
				<v-btn @click="callNative">callNative</v-btn>
			</dt>
			<dd>
				{{ step1 }}
			</dd> -->
			<dt>
				<v-btn @click="handleWebLogin"> 콜백 사전 정의 </v-btn>
			</dt>
			<dd>
				{{ step2 }}
			</dd>
			<dt>
				<v-btn @click="handleGetGPS"> 리턴 값 확인 </v-btn>
			</dt>
			<dd>
				{{ step3 }}
			</dd>
			<dt>
				<v-btn @click="handleOpenWin"> handler 연동 </v-btn>
			</dt>
			<dd>
				{{ step4 }}
			</dd>
		</dl>
		<hr />
		<div>
			{{ code }}
		</div>
		<hr />
		<!-- <section class="main_content__wrap">
			<TFastContentGrid />
		</section> -->
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Index',
	data() {
		return {
			code: '',
			step1: 'empty',
			step2: 'empty',
			step3: 'empty',
			step4: 'empty',
		};
	},
	computed: {
		...mapState('fastList', {
			isFastLoading: state => state.isFastLoading,
		}),
	},
	created() {
		// console.log(this.$route)
		// process.env.NUXT_LOCALE
	},
	mounted() {
		// Step 2: 콜백 사전 정의 (jQuery )
		this.$bridge.registerHandler('setGeoLoc', (latitude, longtitue, location) => {
			this.step2 = `latitude: ${latitude}, longtitue: ${longtitue}, location: ${location}`;
		});
	},
	beforeDestroy() {},
	methods: {
		async callNative() {
			const res = await this.$bridge.callHandler({
				cmd: 'openAppNotiSetting',
			});
			this.step1 = res;
		},

		/**
		 * Step 1: 콜백 사전 정의 (jQuery)
		 * webLogin -> $setGeoLoc
		 */
		handleVoiceRecord() {
			this.$bridge.callHandler({
				cmd: 'voiceRecord',
				data: {
					memNo: '21546392',
					// uploadPath: 'ht://aksdjhaskjdh.com',
					// uploadPath: 'http://photo.club5678.com/prg/club_paper/paper_voiceUpload.php',
					path: 'http://photo.club5678.com/prg/club_qmedia/upload_partner.php',
					minSec: 1,
					maxSec: 10,
					// funcName: 'voiceRecordResult',
				},
			});
		},

		/**
		 * Step 2: 콜백 사전 정의 (jQuery)
		 * webLogin -> $setGeoLoc
		 */
		handleWebLogin() {
			this.$bridge.callHandler({
				cmd: 'webLogin',
			});
		},

		/** Step 3: return 값 확인  */
		async handleGetGPS() {
			const response = await this.$bridge.callHandler(
				{
					cmd: 'getGPS',
				},
				// gpsinfo => {
				// 	alert(JSON.stringify(gpsinfo));
				// },
			);

			this.step3 = response;
		},

		/** Step 4: handler  */
		handleOpenWin() {
			this.$bridge.callHandler({
				cmd: 'openWin',
				data: {
					url: `${window.location.origin}/api/dev`,
				},
				handler: {
					cmd: 'closeWin',
				},
			});
		},
	},
};
</script>
