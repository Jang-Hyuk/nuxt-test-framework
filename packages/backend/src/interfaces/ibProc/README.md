# 프로시저 정의
- 프로시저를 인터페이스로 변환하는 과정은 반자동으로 이루어진다.
- 자동으로 이루어지는 부분은 프로시저 Param에 관한것이며 procedureInterfaceMaker.js에서 처리한다.
- 수동으로 이루어지는 부분은 프로시저를 요청하고 난 후 결과값에 대한 타입 지정이다.

# 프로시저 Param & ParamTuple
- procedureInterfaceMaker.js 에서 interface/ibProc/procedures/*.js 분석 후 자동 생성
- 생성된 파일명은 {filename}.param.ts이다.
- formatting이 완벽하지 않으므로 eslint --fix를 수행할 수 있는 task를 등록하여 교정한다

# 프로시저 Returns
- 프로시저 질의 결과로 인한 데이터 반환은 프로토콜이 명확히 정의되지 않았고 참조할 수 있 수 없음
- 따라서 수동으로 실제 db에 완성된 프로시저로 요청 후 반환되는 데이터를 기록하여 타입을 정의함
- 파일명은 {filename}.ts 에 기록한다.

```ts
namespace ibProc {
	export namespace DbName {
    /** Select or Insert or Update or Delete  */
		export namespace ProcedureName {
      // ↓↓↓ procedureInterfaceMaker 생성 결과물 cp
      /** 프로시저 파라메터 객체 타입 */
			export type Param = {}
      /** 프로시저 파라메터 key 값을 추출하여 생성한 튜플 */
      export type ParamTuple = []

			// ↓↓↓ 실제 db에 요청하고 난 후 데이터를 cp
			/** 요청 실패 */
			const firstFailInfo = {};
			/** 요청 성공 */
			const firstSuccessInfo = { /** cnt: 1 성공 */ cnt: 0 };
			const secondSuccessInfo = {
				/** 회원 번호 */
				mem_no: 1,
				/** 만남 메시지 */
				meet_conts: '123',
				/** 입력 일시 */
				ins_date: '12312312',
			};

			export type firstFailType = typeof firstFailInfo;

			export type firstSuccessType = typeof firstSuccessInfo;
			export type secondSuccessType = typeof secondSuccessInfo;

			export type Returns = [
        /** 프로시저 질의 결과 색인 0 */
        [
          firstSuccessType & firstFailType
        ],
        /** 프로시저 질의 결과 색인 1 */
        secondSuccessType[]
      ];
		}
	}
}
```