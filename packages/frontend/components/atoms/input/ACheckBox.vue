<template>
	<v-checkbox
		:input-value="model"
		:value="value"
		:label="label"
		:rules="rules"
		:color="color"
		:indeterminate="indeterminate"
		:indeterminate-icon="indeterminateIcon"
		:on-icon="onIcon"
		:off-icon="offIcon"
		:hide-details="hideDetails"
		:disabled="disabled"
		:readonly="readonly"
		@change="onChange($event)"
	/>
</template>
<script>
export default {
	name: 'ACheckBox',
	model: {
		prop: 'model',
		event: 'change',
	},
	props: {
		/** v-model: value */
		model: { type: [String, Array, Object, Boolean], default: '' },
		/** 체크박스 값 */
		value: { type: [String, Number, Array, Object, Boolean], default: '' },
		/** 체크박스 레이블 */
		label: { type: String, default: '' },
		/**  유효성 및 오류 메세지 */
		rules: { type: Array, default: () => [] },
		/**  체크박스 컬러 */
		color: { type: String, default: '' },
		/**  체크박스 불확실한 상태를 설정합니다. */
		indeterminate: { type: Boolean, default: false },
		/** 체크박스 불확실한 상태일 때 사용하는 아이콘 */
		indeterminateIcon: { type: String, default: '' },
		/** 힌트 및 유효성 검사 오류를 숨깁니다. 자동으로 설정하면 표시할 메시지(힌트, 오류 메시지, 카운터 값 등)가 있는 경우에만 렌더링됩니다. */
		hideDetails: { type: [Boolean, String], default: true },
		/** 활성화 시 사용되는 아이콘 */
		onIcon: { type: String, default: '' },
		/** 비활성 상태일 때 사용되는 아이콘 */
		offIcon: { type: String, default: '' },
		/** 체크박스 비활성화 */
		disabled: { type: Boolean, default: false },
		/** 체크박스 읽기 전용 상태 */
		readonly: { type: Boolean, default: false },
	},
	data() {
		return {};
	},
	methods: {
		onChange(event) {
			this.$emit('input', event);
			this.$emit('change', event);
		},
	},
};
</script>
