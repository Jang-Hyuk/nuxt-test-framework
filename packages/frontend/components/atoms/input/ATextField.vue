<template>
	<v-text-field
		:value="value"
		:label="fieldLabel"
		:type="iconType.type"
		:rules="rules"
		:required="required"
		:autofocus="autofocus"
		:placeholder="placeholder"
		:disabled="disabled"
		:readonly="readonly"
		:autocomplete="autocomplete"
		:hide-details="hideDetails"
		:rounded="rounded"
		:clearable="clearable"
		:outlined="outlined"
		:filled="filled"
		:prepend-icon="prependIcon"
		:prepend-inner-icon="prependInnerIcon"
		:append-icon="iconType.icon"
		:validate-on-blur="validateOnBlur"
		:solo="solo"
		:dense="dense"
		@change="onChange"
		@input="onInput"
		@keydown="onKeyDown"
		@keypress="onKeyPress"
		@click="onClick"
		@click:append="show = !show"
	/>
</template>

<script>
export default {
	name: 'ATextField',
	props: {
		value: { type: [String, Number], default: '' },
		/** i18n (key값) form.???.??? || 일반 텍스트 */
		label: { type: String, default: '' },
		/** input Type */
		type: { type: [String, Object], default: '' },
		/** vaildation */
		rules: { type: Array, default: () => [] },
		placeholder: { type: String, default: '' },
		disabled: { type: Boolean, default: false },
		readonly: { type: Boolean, default: false },
		autocomplete: { type: String, default: 'off' },
		autofocus: { type: Boolean, default: false },
		required: { type: Boolean, default: false },
		hideDetails: { type: [Boolean, String], default: true },
		outlined: { type: Boolean, default: false },
		rounded: { type: Boolean, default: false },
		filled: { type: Boolean, default: false },
		clearable: { type: Boolean, default: false },
		prependIcon: { type: String, default: '' },
		prependInnerIcon: { type: String, default: '' },
		appendIcon: { type: [String, Object], default: '' },
		validateOnBlur: { type: Boolean, default: false },
		solo: { type: Boolean, default: false },
		dense: { type: Boolean, default: false },
	},
	data() {
		return {
			show: false,
		};
	},
	computed: {
		/** @returns { object } */
		iconType() {
			if (typeof this.appendIcon === 'string') {
				return {
					icon: this.appendIcon,
					type: this.type,
				};
			}
			return {
				icon: this.show ? this.appendIcon.on : this.appendIcon.off,
				type: this.show ? this.appendIcon.onType : this.appendIcon.offType,
			};
		},
		/** @returns {string} i18n 사용 또는 일반 텍스트  */
		fieldLabel() {
			const {
				$props: { label },
			} = this;
			const isLabel = this.$te(`form.${label}`);
			return isLabel ? this.$t(`form.${label}`) : label;
		},
	},
	methods: {
		onInput(event) {
			this.$emit('input', event);
		},
		onChange(event) {
			this.$emit('change', event);
		},
		onKeyDown(event) {
			this.$emit('keydown', event);
		},
		onKeyPress(event) {
			this.$emit('keypress', event);
		},
		onClick(event) {
			this.$emit('click', event);
		},
	},
};
</script>
