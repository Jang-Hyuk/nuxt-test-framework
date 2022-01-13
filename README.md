<p align="left"><img width="128px" src="https://nuxtjs.org/logos/nuxt.svg"></p>


# Renewal TongTong


## Installation
```bash
이것은 TongTong 리뉴얼 프로젝트입니다.
node 및 yarn 설치가 되어 있지 않으면 먼저 설치를 진행해주시기 바랍니다.
리포지토리를 복제한 경우 아래 Command를 사용하여 종속성 설치 및 개발모드로 실행합니다.

1. nodejs 버젼은 v16 LTS 기준으로 설치 URL : https://nodejs.org/ko/download/
2. yarn 설치 : npm install -g yarn
3. 환경 설정 파일 생성
    -> .env.development 파일을 복사하여 동일 경로에 .env.dev 생성하고 DEV_ID를 본인 계정 입력
    -> 원격 서버에서는 .env.dev가 없어도 동일하게 수행되나 local에서 수행 시 동일한 포트로 구동시키기 위함
4. 모듈 설치: yarn install
5. Command로 종속성 설치 및 개발서버 실행.

```


## Commands
```bash
# 개발 서버 Hot-reloading 상태로 실행. 주소는 .env 또는 env.dev의 DEV_ID으로 지정된 포트
```

| Command | Description |
|---------|-------------|
| yarn | 종속성 설치 |
| yarn dev | 개발모드 -> 프론트엔드 & 백엔드 실행 [Read .env.development & .env.dev] |
| yarn dev:debug | 개발모드(백엔드 디버깅) -> 프론트엔드 & 백엔드 실행 [Read .env.development & .env.dev] |
| yarn staging | 스테이징모드 -> 프론트엔드 & 백엔드 실행 [Read .env.staging] |
| yarn prod | 서비스모드 -> 프론트엔드 & 백엔드 실행 [Read .env.production] |
| yarn devb | 개발모드 -> 백엔드 실행 |
| yarn devb:debug | 개발모드(백엔드 디버깅) -> 백엔드 실행 |
| yarn build | nuxt build |
| yarn build:a | nuxt build 시 analyze 모드로 빌드 |
| yarn generate | nuxt generate 정적 파일 생성 |
| yarn start | 빌드된 .nuxt와 백엔드를 바인딩하여 실행 (No HMR) |
| yarn lint | js, ts, vue 파일 소스코드 문법 오류 출력 |
| yarn lint:w | 파일 변경 시 lint를 지속적으로 수행하여 출력 |
| yarn lint:style | vue, css, scss 안에 존재하는 스타일 문법 오류 출력 |
| yarn test:all | Test 도구인 jest를 사용하여 frontend와 backend 모든 테스트코드 수행 |
| yarn test:be or fe or cm | Test 도구인 jest를 사용하여 각 package 테스트코드 수행 |
| yarn tsc | Typescript Compiler 실행. js, ts 파일을 컴파일하는 과정에서 발생하는 문제점 추적. 여기서는 실제로 컴파일하여 결과물을 생성하진 않고 타입 검증용으로 사용. workspace에서 실행하는 tsc는 test folder에서 감지되는 문제는 제외  |
| yarn pm2 | (.env.production) PM2 start. 사전에 온전한 nuxt build가 수행되어야 함 |
| yarn pm2:staging | (.env.staging) pm2 start |
| yarn pm2:dev | (.env.development & .env.dev) pm2 start |
| yarn pm2:local | (.env.development & .env.dev) nuxt build 후 pm2 start |
| yarn pm2:restart | pm2 restart |
| yarn pm2:stop | pm2 stop ecosystem.config.js 데몬 프로세스 서비스 중지 |
| yarn pm2:monit | pm2 monit |
| yarn pm2:log | pm2 logs |
| yarn pm2:kill | pm2 kill 모든 pm2 데몬 프로세스 종료 |


## Documentation
- [Project Document](https://www.notion.so/1d77924ba3db49a49c82ff88db122202?v=202e997fcf03485492a0aa80c1dca3a7)
- [ExpressJS](http://expressjs.com/en/guide/routing.html)
- [Nuxt.js](https://nuxtjs.org/guide/)
- [Vue.js](http://vuejs.org/guide/)



