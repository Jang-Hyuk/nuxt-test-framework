<template>
	<v-img
		:src="fetchSrc"
		:lazy-src="fetchLazySrc"
		:width="width"
		:height="height"
		:max-width="maxWidth"
		:max-height="maxHeight"
		:min-width="minWidth"
		:min-height="minHeight"
		:alt="alt"
		:aspect-ratio="aspectRatio"
		:contain="contain"
		:position="position"
		@error="onErrorImg"
		@click="onImg"
	>
		<template v-if="lazySrc" #placeholder>
			<slot name="placeholder">
				<v-row
					v-if="!isDefaultLazySrc"
					:class="lazyAreaClass"
					:align="lazyAreaAlign"
					:justify="lazyAreaJustify"
				>
					<v-progress-circular
						:indeterminate="isLazyProgressIndeterminate"
						:color="lazyProgressColor"
						:class="lazyProgressClass"
					/>
				</v-row>
			</slot>
		</template>
	</v-img>
</template>

<script>
export default {
	name: 'AImage',
	components: {},
	props: {
		/** 이미지 URL입니다. 이 소품은 필수입니다 */
		src: { type: String, required: true },
		/** 기본 이미지가 로드되기를 기다리는 동안 표시할 항목으로 일반적으로 base64로 인코딩된 작은 축소판입니다. 약간의 흐림 필터가 적용되었습니다. */
		lazySrc: { type: String, default: '' },
		/** club default 주소 사용 여부 */
		isDefaultSrc: { type: Boolean, default: false },
		/** 기본 로딩 사용 여부 */
		isDefaultLazySrc: { type: Boolean, default: false },
		/** lazy 영역 클래스 */
		lazyAreaClass: { type: [String, Array, Object], default: 'fill-height ma-0' },
		/**
		 * lazy 영역 align-items CSS 속성을 적용
		 *  start, center, end, baseline and stretch
		 * */
		lazyAreaAlign: { type: String, default: 'center' },
		/**
		 * lazy 영역 justify-content CSS 속성을 적용
		 * option: start, center, end, space-between and space-around
		 */
		lazyAreaJustify: { type: String, default: 'center' },
		/** lazy progress 지속적으로 애니메이션 사용 여부 */
		isLazyProgressIndeterminate: { type: Boolean, default: true },
		/** lazy progress color 지정 */
		lazyProgressColor: { type: String, default: 'grey lighten-5' },
		/** lazy progress class 사용 */
		lazyProgressClass: { type: [String, Array, Object], default: '' },
		/** 너비/높이로 계산되므로 1920x1080px 이미지의 경우 1.7778이 됩니다. 생략하면 자동으로 계산됨 */
		aspectRatio: { type: [String, Number], default: '' },
		/** 너비 */
		width: { type: [Number, String], default: '' },
		/** 높이 */
		height: { type: [Number, String], default: '' },
		/** 최대 너비 */
		maxWidth: { type: [Number, String], default: '' },
		/** 최대 높이 */
		maxHeight: { type: [Number, String], default: '' },
		/** 최소 너비 */
		minWidth: { type: [String, Number], default: '' },
		/** 최소 높이 */
		minHeight: { type: [String, Number], default: '' },
		/** 이미지가 맞지 않을 경우 이미지가 잘리는 것을 방지합니다.  */
		contain: { type: Boolean, default: false },
		/** 잘릴 부분을 변경하려면 기본값을 재정의합니다. Background-position과 동일한 구문을 사용합니다. */
		position: { type: String, default: '' },
		/** 스크린 리더를 위한 대체 텍스트. 장식 이미지의 경우 비워 둡니다. */
		alt: { type: String, default: '' },
	},
	data() {
		return {
			isErrorImg: false,
		};
	},
	computed: {
		fetchSrc() {
			let img = this.isDefaultSrc ? `${this.$config.PROXY.image}${this.src}` : this.src;
			if (this.isErrorImg) {
				img = 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E';
			}
			return img;
		},
		fetchLazySrc() {
			return this.isDefaultSrc
				? `${this.$config.PROXY.image}${this.lazySrc}`
				: this.lazySrc;
		},
	},
	methods: {
		onImg() {
			this.$emit('click');
		},
		/** 이미지 주소가 맞지 않아 오류가 발생할때 대체 이미지 사용 여부 */
		onErrorImg() {
			this.isErrorImg = true;
		},
	},
};
</script>
