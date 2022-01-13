<template>
	<div :class="classType">
		<slot>
			<span v-if="text">{{ text }}</span>
		</slot>
	</div>
</template>

<script>
export default {
	name: 'ABadge',
	components: {},
	props: {
		/** option: border, bg, bgImg,  */
		classElement: { type: String, default: '' },
		/** option: m, f, like, loca, dis, location, newcomer 등등등.... */
		classModifier: { type: String, default: '' },
		/** 내용 */
		text: { type: String, default: '' },
	},
	data() {
		return {};
	},
	computed: {
		/** 클래스 명명 */
		classType() {
			return [
				'badge',
				this.classElement ? `badge__${this.classElement}` : '',
				this.classModifier ? `badge__${this.classElement}--${this.classModifier}` : '',
			];
		},
	},
	methods: {},
};
</script>
