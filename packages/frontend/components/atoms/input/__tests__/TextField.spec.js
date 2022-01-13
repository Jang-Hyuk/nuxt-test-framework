import Vuex from 'vuex';
import { localVue, vuetify, router, util } from '@/assets/js/jest/jest.init';
import TextField from '~/components/atoms/forms/TextField.vue';

localVue.use(Vuex);
let store;
let actions;
let state;

describe('TextField', () => {
	beforeEach(() => {
		state = { data: {} };
		actions = {};
		store = new Vuex.Store({
			state,
			actions,
		});
	});

	const factory = propsData => {
		return util.mount(TextField, {
			localVue,
			vuetify,
			store,
			router,
			propsData: {
				value: 'test',
				label: 'test',
				type: 'text',
				...propsData,
			},
		});
	};

	test('form input test', async () => {
		const wrapper = factory();
		const input = wrapper.find('input');
		input.setValue('dev');
		input.trigger('input');
		await wrapper.vm.$nextTick();
		expect(input.element.value).toBe('dev');

		// wrapper.vm.updateInput();
		// console.log(wrapper.emitted());
	});

	test('form input iconType String', () => {
		const wrapper = factory({ appendIcon: 'mdi-eye' });
		const localThis = { appendIcon: 'mdi-eye', type: 'text' };

		expect(typeof wrapper.vm.appendIcon).toBe('string');
		TextField.computed.iconType.call(localThis);
		expect(wrapper.vm.iconType.type).toBe('text');
	});

	test('form input iconType Object', () => {
		const wrapper = factory({
			appendIcon: {
				onType: 'text',
				offType: 'password',
				on: 'mdi-eye',
				off: 'mdi-eye-off',
			},
		});
		const localThis = { show: true, appendIcon: { on: 'mdi-eye', off: 'mdi-eye-off' } };

		TextField.computed.iconType.call(localThis);
		expect(wrapper.vm.iconType).toStrictEqual({
			icon: 'mdi-eye-off',
			type: 'password',
		});
	});
});
