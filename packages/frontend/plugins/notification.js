export default ({ store }, inject) => {
	inject('notification', {
		showMessages({ content = '', color = '' }) {
			store.commit('snack/showMessages', { content, color });
		},
	});
};
