import 'nuxt-i18n';

import dayjs from 'dayjs';

import code from 'cm/code';
import Logger from 'cm/loggers/Logger';
import NuxtHistoryStateInstance from '~/types/nuxt-history-state';
import vuetfiyDialog from '~/types/vuetify-dialog';

import repositoies from '~/repositories';

import { nuxtUtil, directNuxtUtil } from '~/types';
import VueJsBridge from '~/types/bridge';
import { config } from '~/types/custom';

declare module '@nuxt/types' {
	interface TongTong extends directNuxtUtil {
		/* nuxt.config.js */
		$config: config;
		/* Plugins */
		// ↓↓↓ module
		$dayjs: typeof dayjs;
		$historyState: NuxtHistoryStateInstance;
		// SSR only
		$logger: Logger;

		// ↓↓↓ custom
		$bridge: VueJsBridge;
		$repo: ReturnType<typeof repositoies>;
		$utils: nuxtUtil;

		$code: typeof code;
		$dialog: vuetfiyDialog;
	}

	interface Context extends TongTong {}
	interface NuxtAppOptions extends TongTong {}
}

declare module '@nuxt/vue-app' {
	interface Context extends TongTong {}
	interface NuxtAppOptions extends TongTong {}
}
