<template>
	<v-select
		:value="value"
		:items="items"
		:label="label"
		:item-text="itemText"
		:item-value="itemValue"
		:full-width="fullWidth"
		:single-line="singleLine"
		:autofocus="autofocus"
		:readonly="readonly"
		:height="height"
		:rules="rules"
		:placeholder="placeholder"
		:hide-details="hideDetails"
		:return-object="returnObject"
		:hide-selected="hideSelected"
		:clearable="clearable"
		:solo="solo"
		:dense="dense"
		:outlined="outlined"
		@change="onChange"
	>
	</v-select>
	<!--  menu-props="auto"  -->
</template>

<script>
export default {
	name: 'ASelectBox',
	props: {
		/** 입력 값 */
		value: { type: [String, Number, Boolean], default: '' },
		/** 셀렉트 리스트 */
		items: { type: Array, default: () => [] },
		/** 셀렉트 레이블 */
		label: { type: String, default: '' },
		/** 항목의 텍스트 값 속성 설정 */
		itemText: { type: String, default: 'text' },
		/** 항목 값의 속성을 설정합니다. */
		itemValue: { type: String, default: 'value' },
		/** 레이블이 포커스/더러움에서 움직이지 않음 */
		singleLine: { type: Boolean, default: false },
		/** 입력 유형을 전각으로 지정 */
		fullWidth: { type: Boolean, default: false },
		/** 자동 초점 활성화 */
		autofocus: { type: Boolean, default: false },
		/** 높이 설정 */
		height: { type: [String, Number], default: '' },
		/** 셀렉트 유효성 및 에러 문구 */
		rules: { type: Array, default: () => [] },
		/** 입력의 자리 표시자 텍스트를 설정합니다. */
		placeholder: { type: String, default: '' },
		/** 힌트 및 유효성 검사 오류를 숨깁니다. auto 설정하면 표시할 메시지(힌트, 오류 메시지, 카운터 값 등)가 있는 경우에만 렌더링됩니다. */
		hideDetails: { type: [Boolean, String], default: true },
		/** 이미 선택된 선택 메뉴 항목에 표시하지 않음 */
		hideSelected: { type: Boolean, default: false },
		/** 입력 지우기 기능 추가 */
		clearable: { type: Boolean, default: false },
		/** Item-value로 지정된 값이 아닌 객체를 직접 반환하도록 선택 동작을 변경합니다. */
		returnObject: { type: Boolean, default: false },
		/** 입력을 읽기 전용 상태 */
		readonly: { type: Boolean, default: false },
		/** 입력을 비활성화 상태 */
		disabled: { type: Boolean, default: false },
		/** */
		solo: { type: Boolean, default: false },
		/** 입력 높이 감소 */
		dense: { type: Boolean, default: false },
		/** 개요 스타일을 입력에 적용합니다. */
		outlined: { type: Boolean, default: true },
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
