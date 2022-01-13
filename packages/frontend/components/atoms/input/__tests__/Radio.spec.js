import Vuex from 'vuex';
import { localVue, vuetify, router, util } from '~/assets/js/jest/jest.init';
import Radio from '~/components/atoms/forms/Radio.vue';

localVue.use(Vuex);
let wrapper;
let store;
let actions;
let state;
const propsData = {
	label: 'tong',
	items: [
		{ text: 'tongtong', value: 'tong' },
		{ text: 'dev', value: 'dev' },
	],
};

describe('Radio', () => {
	beforeEach(() => {
		state = { data: {} };
		actions = {};
		store = new Vuex.Store({
			state,
			actions,
		});
		wrapper = util.mount(Radio, {
			localVue,
			vuetify,
			store,
			router,
			propsData,
		});
	});

	test('form radio test', async () => {
		const radioInput = wrapper.findAll('input[type="radio"]');
		expect(radioInput.length).toEqual(2);
		await radioInput.at(0).setChecked();
		await localVue.nextTick();
		expect(radioInput.at(0).element.checked).toBeTruthy();
		expect(radioInput.at(1).element.checked).toBeFalsy();
	});
});
