# Repository Pattern?



Repository(리포지토리) 패턴은 디자인 패턴 중 하나로, 데이터가 있는 여러 저장소(Local, Remote)를 추상화하여 중앙 집중처리 방식을 구성하고, 데이터를 사용하는 로직을 분리시키기 위한 디자인 패턴입니다.

## 왜 쓰는가?

- 데이터 로직을 분리시킬 수 있습니다.

- 중앙 집중처리 방식으로, 언제나 일관된 인터페이스로 데이터를 요청할 수 있습니다.

- 그렇기 때문에, 클라이언트가 어떤 데이터를 사용할지 선택할 필요 없이 어떤 데이터를 가져올지는 Repository에서 결정하여 적절한 데이터를 제공합니다.

- 단위 테스트를 통해 검증이 가능합니다.

- 새로운 데이터 로직 코드를 쉽게 추가할 수 있습니다.

## 이해하기

- Repository가 추상화되어 있기 때문에 ViewModel에서의 코드 수정 없이도 언제나 같은 인터페이스로 요청할 수 있으며 다양한 환경에 맞는 데이터를 사용할 수 있습니다.

- Repository는 데이터 저장소에 있는 데이터 객체를 캡슐화하고 더 객체지향적인 구조를 제공합니다.

- 모델과 비즈니스 로직을 깔끔하게 분리하며 ViewModel -> Model 간의 단방향 의존성 구조를 구현합니다.

- 수많은 ViewModel에서의 호출 또는 복잡한 쿼리를 사용하는 경우 더욱 효과적입니다.

- 특히 위와 같은 경우, 같은 로직의 중복을 최소화하는데 큰 이점이 됩니다.

## 사용법

- testRepository.js를 복사/붙여넣기 하고 첫번째 줄의 resource변수를 REST API에 맞게 변경한다.
	``` js
	// 수정 전
	const resource = '/api/dev';

	// 수정 후
	const resource = '/api/service/fast-meet';
	```

- 각 all, read, create 등의 함수들은 axios 결과값을 반환하는 것으로 한다.

- 페이지 주소의 깊이가 깊어질 때마다 각 폴더의 index.js에서 추가적으로 작성해야 this.$repo.service.fastMeet 과 같은 계층적 구조를 가지게 된다.

1. 다음 주소에 해당하는 파일을 import한다.

2. export default 부분에 선언해준다.

- 예시
	``` js
	import fastMeetRepository from './fastMeet';

	export default $axios => ({
		fastMeet: fastMeetRepository($axios),
	});
	```

## jsDoc

- 사용하는 이유로 비지니스 로직에서 Repository를 사용해서 데이터를 가져올 때 해당 데이터의 목록을 보여주기 위함.

- jsDoc부분을 알맞게 변경하되 returns 부분은 아래와 같이 작성한다.

- 기본 틀
  ``` bash 
	@returns {Promise<ifBase.AxiosReponse<response 데이터의 타입>>} 설명
	```

- 예시 : jsdoc의 returns은 axios의 response를 반환한다는 뜻이고 response안에 HistoryList가 담겨있다는 뜻이다.
	``` js
	//repository.js jsdoc
	@returns {Promise<ifBase.AxiosReponse<ifRepository.Service.Wallet.HistoryList>>} 설명11!!
	
	//actions.js
	response.data.map(data => console.log(data.hostId))
	```

- response 데이터타입을 정의할 양이 많을 경우 ifRepository 폴더 안의 typescript파일안에서 선언 후 불러서 사용한다.

- 예시 : ifRepository.Service.Wallet에서 HistoryList 타입을 정의하고 jsdoc에서 불러서 사용
	``` js
	@returns {Promise<ifBase.AxiosReponse<ifRepository.Service.Wallet.HistoryList>>}
	```

- 폴더 구조의 경우 ifStore와 같은 구조를 가진다.

## Documentation
- [APIs in Nuxt Using The Repository Pattern](https://medium.com/js-dojo/consuming-apis-in-nuxt-using-the-repository-pattern-8a13ea57d520)