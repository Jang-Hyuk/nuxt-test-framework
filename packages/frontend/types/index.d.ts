/* eslint-disable no-var */
/* eslint-disable vars-on-top */

import Vue from 'vue';
import dayjs from 'dayjs';

// Customize Module
import code from 'cm/code';

import conversionUtil from 'cm/utils/conversion';
import validationUtil from 'cm/utils/validation';
import NuxtHistoryStateInstance from './nuxt-history-state';

import vuetfiyDialog from '~/types/vuetify-dialog';

import VueJsBridge from './bridge';
import { config, validRules } from './custom';

import repositories from '~/repositories';
import NuxtClient from '~/plugins/utils/Client';
import NuxtCookie from '~/plugins/utils/Cookie';
import NuxtDevice from '~/plugins/utils/Device';

export type directNuxtUtil = {
	// 생성자 있는 유틸
	$client: NuxtClient;
	$cookie: NuxtCookie;
	$device: NuxtDevice;
	// 생성자 없는 유틸
	$conversion: typeof conversionUtil;
	$valid: typeof validationUtil;
};

export type nuxtUtil = {
	// 생성자 있는 유틸
	client: NuxtClient;
	cookie: NuxtCookie;
	device: NuxtDevice;
	// 생성자 없는 유틸
	conversion: typeof conversionUtil;
	valid: typeof validationUtil;
};

declare module 'vuex/types/index' {
	interface Store<S> extends directNuxtUtil {
		/* nuxt.config.js */
		$config: config;
		/* Plugins */
		// ↓↓↓ module
		$dayjs: typeof dayjs;
		$historyState: NuxtHistoryStateInstance;
		// ↓↓↓ custom
		$bridge: VueJsBridge;
		$repo: ReturnType<typeof repositories>;
		$utils: nuxtUtil;

		$code: typeof code;
		$dialog: vuetfiyDialog;
	}
}

declare module 'vue/types/vue' {
	interface Vue extends directNuxtUtil {
		/* nuxt.config.js */
		$config: config;
		/* Plugins */
		// ↓↓↓ module
		$dayjs: typeof dayjs;
		$historyState: NuxtHistoryStateInstance;
		// ↓↓↓ custom
		$bridge: VueJsBridge;
		$repo: ReturnType<typeof repositories>;
		$utils: nuxtUtil;

		$notification: any;
		$rules: validRules;

		$code: typeof code;
		$dialog: vuetfiyDialog;
	}
}
