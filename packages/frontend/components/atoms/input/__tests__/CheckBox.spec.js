import Vuex from 'vuex';
import { localVue, vuetify, router, util } from '@/assets/js/jest/jest.init';
import CheckBox from '~/components/atoms/forms/ACheckBox.vue';

localVue.use(Vuex);
let wrapper;
let store;
let actions;
let state;
const propsData = {
	value: 'test',
	label: 'test',
};
describe('CheckBox', () => {
	beforeEach(() => {
		state = { data: {} };
		actions = {};
		store = new Vuex.Store({
			state,
			actions,
		});
		wrapper = util.mount(CheckBox, {
			localVue,
			vuetify,
			store,
			router,
			propsData,
		});
	});

	test('form checkbox test', async () => {
		// console.log(wrapper.props('value')); props data
		const checkboxInput = wrapper.find('input[type="checkbox"]');
		await checkboxInput.setChecked();
		checkboxInput.trigger('click');
		expect(checkboxInput.element.checked).toBeTruthy();
		// wrapper.vm.updateInput();
		// console.log(wrapper.emitted());
	});
});
