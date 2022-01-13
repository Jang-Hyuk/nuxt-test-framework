# STORE


## 1. 사용 목적
- nuxt는 classic mode, module mode 두가지가 있다.
- classic mode는 Vuex.store 객체를 인스턴스로 만드는 방식이지만, nuxt3 버전에서부터는 classic mode를 지원하지 않는다고 한다.
- module mode로 사용한다.
- 애플리케이션에서 사용될 vuex store 파일들을 포함한다. 기본적으로 비활성화 상태이고 store 디렉터리에 index.js 파일을 작성하면 store가 활성화된다. 구성에 따라서 모듈 형태의 store를 형성할 수 있다. 해당 디렉터리는 이름을 변경할 수 없다.


## 2. 디렉토리 설명
```
이 디렉토리에는 Vuex Store 파일이 포함되어 있습니다.
Vuex Store 옵션은 Nuxt.js 프레임워크에서 구현됩니다.

이 디렉토리에 파일을 생성하면 프레임워크의 옵션이 자동으로 활성화됩니다.
이 디렉토리의 사용에 대한 자세한 정보는 [문서](https://nuxtjs.org/guide/vuex-store).

```


