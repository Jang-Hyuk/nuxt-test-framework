# STATIC
## 1. 사용 목적
- 해당 디렉터리는 정적인 파일들을 포함한다. 구성에 따라서 html, Javascript 파일도 포함시킬 수 있다. 해당 디렉터리는 이름을 변경할 수 없다.
- 프로젝트 루트 디렉터리에 직접적으로 bundled 됨
- /filename으로 접근 가능
- full url로 접근하면 static file을 assets file과 똑같이 취급할 수 있음. 그 말은 이 static file을 url loader가 핸들링한다는 것임
따라서 항상 static file은 /filename으로 접근해야 함.



## 2. 디렉토리 설명
```
이 디렉토리에는 정적 파일이 포함되어 있습니다.
이 디렉토리 내의 각 파일은 `/`에 매핑됩니다.
따라서 프로덕션에 배포하기 전에 이 README.md를 삭제하려고 합니다.

예: `/static/robots.txt`는 `/robots.txt`로 매핑됩니다.

이 디렉토리의 사용에 대한 자세한 정보는 [문서](https://nuxtjs.org/guide/assets#static).

```



