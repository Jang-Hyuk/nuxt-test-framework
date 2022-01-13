<template>
	<v-btn
		:type="type"
		:nuxt="nuxt"
		:to="to"
		:replace="replace"
		:block="block"
		:icon="icon"
		:width="width"
		:height="height"
		:large="large"
		:small="small"
		:x-large="xLarge"
		:x-small="xSmall"
		:outlined="outlined"
		:color="color"
		:loading="loading"
		:depressed="depressed"
		:disabled="disabled"
		:fixed="fixed"
		:fab="fab"
		:top="top"
		:right="right"
		:bottom="bottom"
		:left="left"
		:active-class="activeClass"
		elevation="0"
		@click="onButton"
	>
		<slot></slot>
		<template #loader>
			<slot name="loader"></slot>
		</template>
	</v-btn>
</template>

<script>
export default {
	name: 'AButton',
	props: {
		/**
		 * 버튼 레이블이며, common.btn.???
		 * ???은 i18n에 등록된 키값 사용.
		 */
		btnLabel: { type: String, default: '' },
		/** 버튼 유형의 속성 */
		type: { type: String, default: 'button' },
		/** 링크가 nuxt-링크임을 지정합니다. Nuxt 프레임워크와 함께 사용합니다. */
		nuxt: { type: Boolean, default: false },
		/** 링크의 대상 경로를 나타냅니다. Vue-router 문서에서 to prop에 대한 자세한 정보를 찾을 수 있습니다. */
		to: { type: String, default: '' },
		/** 링크가 history에 쌓이지 않고 이동 */
		replace: { type: Boolean, default: false },
		/** 버튼을 사용 가능한 공간의 100%까지 확장합니다. */
		block: { type: Boolean, default: false },
		/** 너비 설정 */
		width: { type: [String, Number], default: '' },
		/** 높이 설정 */
		height: { type: [String, Number], default: '' },
		/** 버큰 크기 조절 */
		large: { type: Boolean, default: false },
		/** 버큰 크기 조절 */
		small: { type: Boolean, default: false },
		/** 버큰 크기 조절 */
		xLarge: { type: Boolean, default: false },
		/** 버큰 크기 조절 */
		xSmall: { type: Boolean, default: false },
		/** 버큰 색깔 */
		color: { type: String, default: '' },
		/** 그림자 제거 */
		depressed: { type: Boolean, default: true },
		/** 배경을 투명하게 만들고 얇은 테두리를 적용합니다. */
		outlined: { type: Boolean, default: false },
		/** 로딩 아이콘 애니메이션을 추가합니다. */
		loading: { type: Boolean, default: false },
		/** 버튼을 비활성화 합니다. */
		disabled: { type: Boolean, default: false },
		/** 링크가 활성화될 때 적용되는 활성 CSS 클래스를 구성합니다. Vue-router 문서에서 활성 클래스 소품에 대한 자세한 정보를 찾을 수 있습니다. */
		activeClass: { type: String, default: '' },
		/** 버튼을 아이콘으로 지정, 버튼이 둥글게 되고 텍스트 소품이 적용 */
		icon: { type: Boolean, default: false },
		/** v-icon 사이즈 조절 */
		iconSize: { type: [String, Number], default: '' },
		fixed: { type: Boolean, default: false },
		fab: { type: Boolean, default: false },
		top: { type: Boolean, default: false },
		right: { type: Boolean, default: false },
		bottom: { type: Boolean, default: false },
		left: { type: Boolean, default: false },
		eventImage: { type: String, default: '' },
	},
	data() {
		return {};
	},
	computed: {},
	methods: {
		onButton(event) {
			this.$emit('click', event);
		},
	},
};
</script>
