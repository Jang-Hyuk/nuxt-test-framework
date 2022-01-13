<template>
	<v-container class="text-center">
		<h2>시스템 점검</h2>
		<v-card>
			{{ startTime }} ~ {{ endTime }}
			<br />
			{{ serverMsg }}
		</v-card>
		<v-btn nuxt to="/s2-module/vuetify/auth/login">영상통통 접속 재시도</v-btn>
	</v-container>
</template>
<script>
import { mapState } from 'vuex';

export default {
	name: 'CheckServer',
	middleware: 'authentication',
	components: {},
	layout: 'auth/noAuthentication',
	data() {
		return {};
	},
	computed: {
		...mapState('server', {
			startTime: state => state.startTime,
			endTime: state => state.endTime,
			serverMsg: state => state.serverMsg,
		}),
	},
	methods: {},
};
</script>
