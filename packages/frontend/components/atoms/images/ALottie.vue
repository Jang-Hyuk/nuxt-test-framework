<template>
	<div :ref="lottieOption.ref" :class="lottieOption.vclass" :style="style"></div>
</template>

<script>
// https://github.com/airbnb/lottie-web
import lottie from 'lottie-web';
import { reactive, toRefs, onMounted } from '@vue/composition-api';

/* 
	ref,
	reactive,
	computed,
	toRefs,
	watch,
	getCurrentInstance,
	useRoute,
	useFetch,
	useContext,
	onBeforeMount,
	onMounted,
	onBeforeUpdate,
	onUpdated,
	onBeforeUnmount,
	onUnmounted, 
*/

export default {
	name: 'ALottie',
	components: {},
	props: {
		lottieOption: {
			type: Object,
			default: () => ({
				ref: '', // refs
				dataUrl: '', // json 주소
				width: '', // 너비
				height: '', // 높이
				vclass: '', // 클래스
			}),
		},
		renderer: { type: String, default: 'svg' }, // lottie-web render type
		loop: { type: Boolean, default: true }, // lottie-web 반복
		autoplay: { type: Boolean, default: true }, // lottie-web 자동 플레이
	},
	setup(props, context) {
		// const vm = getCurrentInstance();
		const {
			lottieOption: { dataUrl },
		} = props;
		const data = reactive({
			anim: null,
			style: {
				width: props.lottieOption.width ? `${props.lottieOption.width}px` : '100%',
				height: props.lottieOption.height ? `${props.lottieOption.height}px` : '100%',
			},
		});
		let animationData = null;
		onMounted(async () => {
			const getAniStorage = JSON.parse(sessionStorage.getItem('aniStorage'));
			const findAniStorage = getAniStorage
				? getAniStorage.find(v => v.url === dataUrl)
				: null;
			try {
				let result = null;
				if (!findAniStorage) {
					//  ${context.root.$config.API_IMAGE}
					result = await context.root.$axios.get(
						`https://image.club5678.com/imgs/club_lottie_interaction/${props.lottieOption.dataUrl}`,
					);
					animationData = result.data;
					const aniList = [];
					const aniInfo = {
						url: dataUrl,
						data: result.data,
					};
					if (getAniStorage) {
						aniList.concat(getAniStorage);
					}
					aniList.push(aniInfo);

					sessionStorage.setItem('aniStorage', JSON.stringify(aniList));
				}
				// data.anim = lottie.loadAnimation({
				// 	container: context.refs[props.lottieOption.ref],
				// 	renderer: props.renderer,
				// 	loop: props.loop,
				// 	autoplay: props.autoplay,
				// 	animationData: result.data,
				// 	rendererSettings: props.lottieOption.rendererSettings,
				// });
				// context.emit('animCreated', data.anim);
			} catch (err) {
				console.error(err);
			}
			data.anim = lottie.loadAnimation({
				container: context.refs[props.lottieOption.ref],
				renderer: props.renderer,
				loop: props.loop,
				autoplay: props.autoplay,
				animationData: findAniStorage?.data || animationData,
				rendererSettings: props.lottieOption.rendererSettings,
			});
		});

		return {
			...toRefs(data),
		};
	},
	// data() {
	// 	return {
	// 		anim: null,
	// 		style: {
	// 			width: this.lottieOption.width ? `${this.lottieOption.width}px` : '100%',
	// 			height: this.lottieOption.height ? `${this.lottieOption.height}px` : '100%',
	// 		},
	// 	};
	// },
	// async mounted() {
	// 	try {
	// 		const result = await this.$axios.get(
	// 			`https://image.club5678.com/imgs/club_lottie_interaction/${this.lottieOption.dataUrl}`,
	// 		);
	// 		this.anim = lottie.loadAnimation({
	// 			container: this.$refs[this.lottieOption.ref],
	// 			renderer: this.renderer,
	// 			loop: this.loop,
	// 			autoplay: this.autoplay,
	// 			animationData: result.data,
	// 			rendererSettings: this.lottieOption.rendererSettings,
	// 		});
	// 		this.$emit('animCreated', this.anim);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// },
	// destroyed() {},
	// methods: {},
};
</script>
