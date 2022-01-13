<template>
	<div>
		{{ error.statusCode }}
		<h1 v-if="error.statusCode === 404">Page not found</h1>
		<h1 v-else>{{ error }}</h1>
		<v-btn nuxt to="/">Home</v-btn>
	</div>
</template>

<script>
export default {
	props: {
		error: {
			type: Object,
			default: () => {},
		},
	},
	// layout: 'errors', // 오류 페이지에 대한 사용자 정의 레이아웃을 설정할 수 있습니다
};
</script>
