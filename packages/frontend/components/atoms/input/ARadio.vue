<template>
	<v-radio-group
		:value="model"
		:label="label"
		:ruels="rules"
		:row="row"
		@change="onChangeRadioGroup"
	>
		<v-radio
			v-for="(r, index) in items"
			:key="index"
			:label="r.text"
			:value="r.value"
			:class="r.class"
			@click="onRadio(r)"
		></v-radio>
	</v-radio-group>
</template>
<script>
export default {
	name: 'ARadio',
	model: {
		prop: 'model',
		event: 'updateModel',
	},
	props: {
		model: { type: [String, Number, Boolean], default: '' },
		items: { type: Array, default: () => [] },
		label: { type: String, default: '' },
		rules: { type: Array, default: () => [] },
		row: { type: Boolean, default: false },
		color: { type: String, default: '' },
	},
	data() {
		return {};
	},
	methods: {
		onChangeRadioGroup(event) {
			this.$emit('updateModel', event);
		},
		onRadio(event) {
			this.$emit('click', event);
		},
	},
};
</script>
