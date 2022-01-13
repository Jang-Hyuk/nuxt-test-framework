<template>
	<div>
		<!-- /** 고가형 아이템 재생영역 || 요청 || 영역 확인하고, style은 display:none만 남기고 빼주세요. */ -->
		<div
			class="item_playing__area"
			style="display: none; border: 3px solid #ff4358; background: rgb(255 77 88 / 0.1)"
		></div>

		<!-- /** 저가형 아이템 재생영역 || 요청 || 영역 확인하고,  style은 display:none만 남기고 빼주세요. */ -->
		<div
			class="item_playing__side_area"
			style="display: none; border: 3px solid #ff4358; background: rgb(255 77 88 / 0.1)"
		></div>
	</div>
</template>

<script>
export default {
	name: 'AItemArea',
	components: {},
	props: {},
	data() {
		return {};
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
.item_playing__area {
	@include flex_box(center, center);
	position: absolute;
	bottom: 50px;
	width: 100%;
	height: calc(100vh - 136px);
}
.item_playing__side_area {
	position: absolute;
	bottom: 50px;
	right: 0;
	width: 80px;
	height: calc(100vh - 136px);
}
</style>
