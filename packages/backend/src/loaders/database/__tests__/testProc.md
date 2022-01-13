
# 빠른만남 리스트
call c_fast_conts.p_fast_meet_list_v5_201(
 slatitude   DECIMAL(10,6)		-- 검색자위도
 , slongitude  DECIMAL(10,6) 		-- 검색자경도
 , memNo INT				-- 회원번호
 , memLoc TEXT				-- 지역선택값(in쿼리[','구분])
 , memSex CHAR(1)			-- 성별[m:남성,f:여성,v:목소리회원]
 , ordSlct TINYINT 			-- 정렬 조건 [0:변경순,1:가까운거리]
 , photoYn CHAR(1)			-- 사진여부부 (y:사진존제회원만)   
 , chrgrYn CHAR(1)			-- 관리자여부 (y:관리자, n:회원)
 , pageNo INT 				-- 페이지 번호
 , pagePerCnt INT 			-- 페이지 당 노출 건수 (Limit)  
)
# 리턴은 현재 빠른만남과 동일합니다.



# 빠른만남 소개글만 변경
CALL c_fast_conts.p_fast_meet_201_cont_upd(
	memNo INT 			-- 회원번호(호출자)
	,meetConts TEXT		-- 내용
)
# RETURN 
s_return			INT			# 0:에러, 1:정상