import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
// import custom style
import 'swiper/css/swiper.css';
// import custom component
import videoCallDialog from '~/components/layers/dialog/VideoCallDialog.vue';

Vue.use(VueAwesomeSwiper);

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default (ctx, inject) => {
	// $dialog custom component 등록
	ctx.$dialog.component('videoCall', videoCallDialog);
	inject('dialog', ctx.$dialog);
};
