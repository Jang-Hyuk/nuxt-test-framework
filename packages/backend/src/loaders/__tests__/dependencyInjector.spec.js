const awilix = require('awilix');

const { createContainer, asFunction, asValue, asClass } = awilix;

const mysqlLoader = require('be/loaders/database/mysql');
const dependencyInjector = require('be/loaders/dependencyInjector');

describe('awilix 의존성 주입 테스트', () => {
	/** @type {import('awilix').AwilixContainer}  */
	let container;

	beforeEach(() => {
		container = createContainer();
	});

	test('createScope 독립 개체 테스트', () => {
		const dbStorage = mysqlLoader();

		// 의존성 주입
		// @ts-ignore
		const container = dependencyInjector.injectBase({ dbStorage });

		// loginUser 없이 authService를 사용하고자 할 경우 에러
		// @ts-ignore
		expect(() => container.cradle.authService.signin()).toThrowError();

		/** @type {iUser.UserLoginForm }  */
		const userInfo = {
			memId: '',
			passWd: '',
			gpsCoord: '',
			memSlct: '',
		};

		// 유저 등록
		container.register({
			userLoginForm: asValue(userInfo),
			// loginUser: asValue(loginUser),
		});
		// 사용자 정보가 없으므로 다음과 같이 반환
		// expect(container.cradle.authService.userLoginForm.id).toEqual('');

		// // 스코프 컨테이너 등록
		// const containerScoped = container.createScope();

		// // 생성된 스코프에 새로운 유저 등록
		// const newUserInfo = { ...userInfo };
		// newUserInfo.id = '1';
		// containerScoped.register({
		// 	userLoginForm: asValue(newUserInfo),
		// });

		// // createScope 컨테이너 id 확인
		// expect(containerScoped.cradle.authService.userLoginForm.id).toEqual('1');
		// // 컨테이너 값에 직접 접근하여 수정
		// containerScoped.cradle.authService.userLoginForm.id = '2';
		// // 수정한 값으로 변경되는 것을 확인
		// expect(containerScoped.cradle.authService.userLoginForm.id).toEqual('2');
		// // 기존 컨테이너는 변화가 없어야한다.
		// expect(container.cradle.authService.userLoginForm.id).toEqual('');
	});

	test('feature test', () => {
		// Increments the counter every time it is resolved.
		let counter = 1;
		let subCounter = 1;
		container.register({
			// @ts-ignore
			counterValue: asFunction(() => counter++).scoped(),
			counterValueSub: asFunction(() => subCounter++),
		});
		const scope1 = container.createScope();
		const scope2 = container.createScope();

		const scope1Child = scope1.createScope();

		// The root container is also a scope.
		expect(container.resolve('counterValue')).toBe(1);
		// The root container is also a scope.
		expect(scope1.resolve('counterValue')).toBe(2);
		expect(scope1.resolve('counterValue')).toBe(2);
		expect(scope1.resolve('counterValueSub')).toBe(1);
		expect(scope1.resolve('counterValueSub')).toBe(2);
		// This scope resolves and caches it's own.
		expect(scope2.resolve('counterValue')).toBe(3);
		expect(scope2.resolve('counterValue')).toBe(3);
		expect(scope1Child.resolve('counterValue')).toBe(4);
	});

	test('scoped life time', () => {
		class User {
			constructor({ name }) {
				this.name = name;
			}

			getName() {
				return this.name;
			}
		}

		/**
		 *
		 * @param {import('awilix').AwilixContainer} rContainer
		 */
		function resolveContainer(rContainer) {
			const user1 = rContainer.resolve('user');

			rContainer.register('name', asValue('admin'));

			const user2 = rContainer.resolve('user');

			return {
				user1: user1.name,
				user2: user2.name,
			};
		}

		// TEST 컨테이너를 생성하고 class 개체를 resolve 한 후 di를 수정 후 다시 resolve 할 경우
		// 개체가 가지는 값이 달라져야 한다
		const container = awilix.createContainer();

		const userName = 'tester';

		container.register('name', asValue(userName));
		container.register('user', asClass(User));

		const { user1, user2 } = resolveContainer(container);

		expect(user1).not.toBe(user2);

		// TEST 컨테이너를 생성하고 class 개체를 resolve 한 후 di를 수정 후 다시 resolve 할 경우
		// 개체가 가지는 값이 같아야 한다
		const containerScope = container.createScope();
		containerScope.register('name', asValue(userName));
		containerScope.register('user', asClass(User).singleton());

		const { user1: sUser1, user2: sUser2 } = resolveContainer(containerScope);

		expect(sUser1).toBe(sUser2);
	});
});
