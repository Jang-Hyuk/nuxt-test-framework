<template>
	<div class="vscroller">
		<div v-if="scrollerTitle" class="vscroller__head">{{ scrollerTitle }}</div>
		<div class="vscroller__body">
			<ul ref="ul" :style="pickerStyle">
				<li
					v-for="item in scrollList"
					:key="item.id"
					:data-val="item.value"
					:class="model === item.value ? 'vselected' : ''"
				>
					{{ item.text }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { isEmpty } from 'lodash';

export default {
	name: 'Scroller',
	model: {
		prop: 'model',
		event: 'upateModel',
	},
	props: {
		model: { type: [String, Number, Object], default: '' },
		scrollerTitle: { type: String, default: '' },
		itemList: { type: Array, default: () => [] },
	},
	data() {
		return {
			selectedIndex: 0,
			selectedValue: 1,
			startPosY: 0,
			currentPosY: 0,
			startTime: 0,
			endTime: 0,
			lastTime: new Date().getTime(),
			transitionDuration: 0,
			lastPosY: 0,
			lastV: 0,
			startTranslatedY: 80,
			currentTranslatedY: 80,
			haveClicked: false,
			isMouseDown: false,
			totalHeight: 40,
			scrollList: [],
		};
	},
	computed: {
		pickerStyle() {
			return {
				webkitTransition: `-webkit-transform ${this.transitionDuration / 1000}s ease-out`,
				transition: `transform ${this.transitionDuration / 1000}s ease-out`,
				webkitTransform: `translate3d(0px, ${this.currentTranslatedY}px, 0px)`,
				transform: `translate3d(0px, ${this.currentTranslatedY}px, 0px)`,
			};
		},
	},
	watch: {
		model(newVal) {
			if (newVal === '') {
				this.$emit('upateModel', this.scrollList[0]?.value);
				this.selectedIndex = 0;
			}
		},
		itemList(newVal) {
			this.scrollList = newVal;
			this.totalHeight = this.itemList.length * 40;
		},
		selectedValue(newVal) {
			this.$emit('upateModel', newVal);
		},
	},
	created() {
		this.scrollList = this.itemList;
	},
	mounted() {
		let supportedTouch = false;
		this.initData();
		if ('ontouchstart' in window) {
			supportedTouch = true;
		}
		if (supportedTouch) {
			this.bindTouchEvents();
		} else {
			this.bindMouseEvents();
		}
		this.bindClickEvent();
	},
	methods: {
		initData() {
			if (this.scrollList.length > 0) {
				this.scrollList.forEach((item, index) => {
					if (isEmpty(this.model) && index === 0) {
						this.selectedValue = item.value;
						this.selectedIndex = 0;
						return false;
					}
					if (this.model === item.value) {
						this.selectedValue = item.value;
						this.selectedIndex = index;
						return false;
					}
					return true;
				});
				this.startTranslatedY = 80 - this.selectedIndex * 40;
				this.currentTranslatedY = this.startTranslatedY;
			} else {
				this.scrollList = [{ value: 1, text: 'Please select..', selected: true }];
			}
			this.totalHeight = this.scrollList.length * 40;
		},
		bindTouchEvents() {
			const el = this.$refs.ul;
			// bind events
			el.addEventListener(
				'touchstart',
				e => {
					this.startPosY = e.changedTouches[0].pageY;
					this.currentPosY = this.startPosY;
					this.startTime = new Date().getTime();
					this.startTranslatedY = this.currentTranslatedY;
					this.lastV = 0;
					// console.log('touchstart!');
				},
				false,
			);
			el.addEventListener(
				'touchmove',
				e => {
					e.preventDefault(); // prevent default scrolling event when touch moving
					this.lastV =
						(e.changedTouches[0].pageY - this.lastPosY) /
						(new Date().getTime() - this.lastTime);
					this.currentPosY = e.changedTouches[0].pageY;
					this.currentTranslatedY =
						this.startTranslatedY + this.currentPosY - this.startPosY;
					this.lastPosY = this.currentPosY;
					this.lastTime = new Date().getTime();
				},
				false,
			);
			el.addEventListener(
				'touchend',
				() => {
					this.endTime = new Date().getTime();
					if (
						Math.abs(this.currentPosY - this.startPosY) > 5 &&
						this.endTime - this.startTime > 50
					) {
						const v = this.lastV;
						const s = v > 0 ? (0.5 * v ** 2) / 0.001 : (-0.5 * v ** 2) / 0.001;
						const t = Math.abs(v) / 0.001;
						let { currentTranslatedY } = this;
						currentTranslatedY += s;
						const residue = currentTranslatedY % 40;
						if (Math.abs(residue) >= 20) {
							if (residue < 0) {
								currentTranslatedY += (40 + residue) * -1;
							} else {
								currentTranslatedY += 40 - residue;
							}
						} else {
							currentTranslatedY -= residue;
						}
						if (currentTranslatedY > 80) {
							currentTranslatedY = 80;
						} else if (currentTranslatedY < (this.totalHeight - 120) * -1) {
							currentTranslatedY = (this.totalHeight - 120) * -1;
						}
						const selectedIndex = Math.abs((currentTranslatedY - 80) / -40);
						this.transitionDuration = t;
						this.currentTranslatedY = currentTranslatedY;
						setTimeout(() => {
							this.scrollList[this.selectedIndex].selected = false;
							this.selectedIndex = selectedIndex;
							this.scrollList[this.selectedIndex].selected = true;
							this.selectedValue = this.scrollList[this.selectedIndex].value;
							this.haveClicked = false;
						}, t);
					} else {
						this.haveClicked = true;
					}
					this.startPosY = 0;
					this.currentPosY = 0;
					this.startTranslatedY = 0;
					this.startTime = 0;
					this.endTime = 0;
					this.lastPosY = 0;
					this.lastV = 0;
				},
				false,
			);
		},
		bindMouseEvents() {
			const el = this.$refs.ul;
			let mouseDown = null;
			let mouseMove = null;
			let mouseUp = null;
			let mouseLeave = null;
			let mouseWheel = null;
			mouseDown = e => {
				// mouse down event
				this.isMouseDown = true;
				this.startPosY = e.pageY;
				this.currentPosY = this.startPosY;
				this.startTime = new Date().getTime();
				this.startTranslatedY = this.currentTranslatedY;
				el.addEventListener('mousemove', mouseMove);
				el.addEventListener('mouseup', mouseUp);
				el.addEventListener('mouseleave', mouseLeave);
				// console.log('mouseDown!');
			};
			mouseMove = e => {
				// mouse move event
				if (this.isMouseDown) {
					e.preventDefault(); // prevent default selecting event when mouse moving
					this.lastV = (e.pageY - this.lastPosY) / (new Date().getTime() - this.lastTime);
					this.currentPosY = e.pageY;
					this.currentTranslatedY =
						this.startTranslatedY + this.currentPosY - this.startPosY;
					this.lastPosY = this.currentPosY;
					this.lastTime = new Date().getTime();
					this.haveClicked = false;
				}
			};
			mouseUp = () => {
				// mouse up event
				this.endTime = new Date().getTime();
				if (
					Math.abs(this.currentPosY - this.startPosY) > 5 &&
					this.endTime - this.startTime > 20
				) {
					const v = this.lastV;
					const s = v > 0 ? (0.5 * v ** 2) / 0.001 : (-0.5 * v ** 2) / 0.001;
					const t = Math.abs(v) / 0.001;
					let { currentTranslatedY } = this;
					currentTranslatedY += s;
					const residue = currentTranslatedY % 40;
					if (Math.abs(residue) >= 20) {
						if (residue < 0) {
							currentTranslatedY += (40 + residue) * -1;
						} else {
							currentTranslatedY += 40 - residue;
						}
					} else {
						currentTranslatedY -= residue;
					}
					if (currentTranslatedY > 80) {
						currentTranslatedY = 80;
					} else if (currentTranslatedY < (this.totalHeight - 120) * -1) {
						currentTranslatedY = (this.totalHeight - 120) * -1;
					}
					const selectedIndex = Math.abs((currentTranslatedY - 80) / -40);
					this.transitionDuration = t;
					this.currentTranslatedY = currentTranslatedY;
					setTimeout(() => {
						this.scrollList[this.selectedIndex].selected = false;
						this.selectedIndex = selectedIndex;
						this.scrollList[this.selectedIndex].selected = true;
						this.selectedValue = this.scrollList[this.selectedIndex].value;
						this.haveClicked = false;
					}, t);
				} else {
					this.haveClicked = true;
				}
				this.startPosY = 0;
				this.currentPosY = 0;
				this.startTranslatedY = 0;
				this.startTime = 0;
				this.endTime = 0;
				this.lastPosY = 0;
				this.lastV = 0;
				this.isMouseDown = false;
				el.removeEventListener('mousemove', mouseMove);
				el.removeEventListener('mouseup', mouseUp);
				el.removeEventListener('mouseleave', mouseLeave);
				// console.log('mouseUp!');
			};
			mouseLeave = () => {
				// mouse leave event
				if (this.isMouseDown) {
					mouseUp();
					// console.log('mouseLeave!');
				}
			};
			mouseWheel = e => {
				// mouse wheel event
				this.startTranslatedY = this.currentTranslatedY;
				let currentTranslatedY = this.startTranslatedY + e.deltaY * 0.5;
				const residue = currentTranslatedY % 40;
				if (Math.abs(residue) >= 20) {
					if (residue < 0) {
						currentTranslatedY += (40 + residue) * -1;
					} else {
						currentTranslatedY += 40 - residue;
					}
				} else {
					currentTranslatedY -= residue;
				}
				if (currentTranslatedY > 80) {
					currentTranslatedY = 80;
				} else if (currentTranslatedY < (this.totalHeight - 120) * -1) {
					currentTranslatedY = (this.totalHeight - 120) * -1;
				}
				this.transitionDuration = 0.2;
				this.currentTranslatedY = currentTranslatedY;
				const selectedIndex = Math.abs((currentTranslatedY - 80) / -40);
				setTimeout(() => {
					this.scrollList[this.selectedIndex].selected = false;
					this.selectedIndex = selectedIndex;
					this.scrollList[this.selectedIndex].selected = true;
					this.selectedValue = this.scrollList[this.selectedIndex].value;
				}, this.transitionDuration);
				this.startTranslatedY = 0;
			};
			// bind events
			el.addEventListener('mousedown', mouseDown);
			el.addEventListener('wheel', mouseWheel);
		},
		bindClickEvent() {
			const el = this.$refs.ul;
			el.querySelectorAll('li').forEach(($li, index) => {
				$li.addEventListener('click', () => {
					if (this.haveClicked) {
						const itemPositionY = $li.offsetTop;
						const currentTranslatedY = 80 - itemPositionY;
						this.transitionDuration = 0;
						this.currentTranslatedY = currentTranslatedY;
						this.scrollList[this.selectedIndex].selected = false;
						this.selectedIndex = index;
						this.scrollList[this.selectedIndex].selected = true;
						this.selectedValue = this.scrollList[this.selectedIndex].value;
						this.haveClicked = false;
					}
				});
				return true;
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~/components/atoms/input/style/AScrollPicker.scss';
</style>
