<template>
	<v-switch
		:input-value="value"
		:label="label"
		:rules="rules"
		:color="color"
		:disabled="disabled"
		:readonly="readonly"
		@change="onChange($event)"
	>
	</v-switch>
</template>

<script>
export default {
	name: 'ASwitch',
	props: {
		/** v-model 값 */
		value: { type: Boolean, required: true },
		/** 스위치 레이블 */
		label: { type: String, default: '' },
		/** vaildation 검사 */
		rules: { type: Array, default: () => [] },
		/** 색깔 설정 */
		color: { type: String, default: '' },
		/** 비활성화 상태 */
		disabled: { type: Boolean, default: false },
		/** 읽기 상태  */
		readonly: { type: Boolean, default: false },
	},
	data() {
		return {};
	},
	methods: {
		onChange(event) {
			this.$emit('change', event);
		},
	},
};
</script>
