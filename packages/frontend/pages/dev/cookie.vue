<template>
	<div>
		<dl>
			<dt>쿠키 등록</dt>
			<dd>
				쿠키 이름
				<input
					v-model="cookieName"
					type="text"
					value="이름"
					placeholder="쿠키 명을 입력하세요"
				/>
				쿠키 값
				<input
					v-model="cookieValue"
					type="text"
					value="이름"
					placeholder="쿠키 값을 입력하세요"
				/>
				<button @click="handleClickAddCookie">등록</button>
			</dd>
			<br />
			<dt>쿠키 삭제</dt>
			<dd>
				쿠키 이름
				<input
					v-model="deleteCookieName"
					type="text"
					value="이름"
					placeholder="쿠키 명을 입력하세요"
				/>
				<button @click="handleClickDelete">삭제</button>
				<button @click="handleClickRemoveAll">모든 쿠키 삭제</button>
			</dd>
			<dt>쿠키 현황</dt>
			<dd>{{ cookieInfo }}</dd>
		</dl>
	</div>
</template>
<script>
export default {
	name: 'LoginPage',
	async asyncData({ $utils }) {
		const cookieInfo = await $utils.cookie.getAll();

		return { cookieInfo };
	},
	data() {
		return {
			cookieInfo: {},
			cookieName: '',
			cookieValue: '',
			deleteCookieName: '',
		};
	},
	mounted() {},
	methods: {
		async handleClickAddCookie() {
			await this.$utils.cookie.set(this.cookieName, this.cookieValue);
			this.cookieInfo = this.$utils.cookie.getAll();
		},
		async handleClickRemoveAll() {
			await this.$utils.cookie.removeAll();
			this.cookieInfo = this.$utils.cookie.getAll();
		},
		async handleClickDelete() {
			await this.$utils.cookie.remove(this.deleteCookieName);
			this.cookieInfo = this.$utils.cookie.getAll();
		},
	},
};
</script>
