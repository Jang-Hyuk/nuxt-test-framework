/* CSR 플러그인 - 전역 사용가능 예제  */
/*
  ex) inject 첫번째 인자 'emailRules'를 전역으로 $emailRules로 사용 가능.
  아래처럼 'emailRules'와 같이 $ 기호를 생략하고 등록하면 $emailRules로 변형되어 바인딩 된다.
  이를 통해 context, Vue 인스턴스 내에서의 this 등 어디에서는 이곳에 접근할 수 있게 된다.
*/
/**
 * @type {import('@nuxt/types').Plugin}
 */
export default (ctx, inject) => {
	const { i18n } = ctx;
	const rules = {
		length: len => v =>
			(v || '').length <= len || `Invalid character length, required ${len}`,
		required: fields => v => !!v || i18n.t('form.required', { fields }),
		nickName: [
			v => !!v || i18n.t('form.nickName.required'),
			v =>
				ctx.$valid.isValidate(v, ctx.$valid.isNickName) || i18n.t('form.nickName.vaild'),
		],
		id: [
			v => !!v || i18n.t('form.id.required'),
			v => ctx.$valid.isValidate(v, ctx.$valid.isMemberId) || i18n.t('form.id.vaild'),
		],
		email: [
			v => !!v || i18n.t('form.email.required'),
			v => ctx.$valid.isValidate(v, ctx.$valid.isEmail) || i18n.t('form.email.vaild'),
		],
		password: [
			v => !!v || i18n.t('form.password.required'),
			v =>
				ctx.$valid.isValidate(v, ctx.$valid.isPassword) || i18n.t('form.password.vaild'),
		],
		passwordCheck: password => v => {
			console.log('a', v);
			return false;
		},
		area: [v => !!v || i18n.t('form.locaInfo.required')],
	};

	inject('rules', rules);
};
