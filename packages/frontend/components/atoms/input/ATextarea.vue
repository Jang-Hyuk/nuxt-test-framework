<template>
	<v-textarea
		:value="value"
		:name="name"
		:label="label"
		:rules="rules"
		:hint="hint"
		:placeholder="placeholder"
		:counter="counter"
		:rows="rows"
		:row-height="rowHeight"
		:no-resize="noResize"
		:auto-grow="autoGrow"
		:outlined="outlined"
		:filled="filled"
		:solo="solo"
		:clearable="clearable"
		:hide-details="hideDetails"
		@input="onInput"
	/>
</template>

<script>
export default {
	name: 'ATextarea',
	components: {},
	props: {
		value: { type: String, default: '' },
		name: { type: String, default: '' },
		label: { type: String, default: '' },
		rules: { type: Array, default: () => [] },
		rows: { type: Number, default: 0 },
		rowHeight: { type: Number, default: 0 },
		placeholder: { type: [String], default: '' },
		hint: { type: String, default: '' },
		autoGrow: { type: Boolean, default: false },
		counter: { type: Boolean, default: false },
		noResize: { type: Boolean, default: false },
		clearable: { type: Boolean, default: false },
		hideDetails: { type: [Boolean, String], default: false },
		outlined: { type: Boolean, default: false },
		filled: { type: Boolean, default: false },
		solo: { type: Boolean, default: false },
	},
	data() {
		return {};
	},
	methods: {
		onInput(event) {
			this.$emit('input', event);
		},
	},
};
</script>
