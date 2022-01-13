### 역할
- IDE내에서 Type을 추가로 획득
- tsc나 lint를 수행하기 위해서 필요
- 해당 폴더내에 eslint 및 ts 오류가 나는 것은 그러려니 한다 (tsc와 lint에서 안걸리기만 하면 됨)

### files.d.ts
# namespace
- *.js 파일에서 jsdoc 안에서의 참조용으로 사용
- 해당 폴더의 이름으로 하되 PascalCase 로 한다
- class 파일은 import로 하고 module의 경우 typeof import 로 로드한다

# interface
- IoC 용으로 사용된다 (awilix.js)
- 의존성 주입용으로 사용되므로 camelCase로 한다

### index.d.ts
- declare로 Type을 추가로 획득하기 위해서 사용한다