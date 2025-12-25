
## 📱 UI 미리보기

### 유저 – 스탬프 적립
![user-stamp](https://github.com/kimjeonghwa99/stamp_web/blob/main/src/docs/ui-user-stamp.png)

### 관리자 – 가맹점 관리
![admin-store](https://github.com/kimjeonghwa99/stamp_web/blob/main/src/docs/ui-admin-store.png)

### 직원 – 쿠폰 검증
![staff-coupon](https://github.com/kimjeonghwa99/stamp_web/blob/main/src/docs/ui-staff-coupon.png)


# QR 스탬프 투어 프로젝트 개요

## 1. 프로젝트 배경
지역 관광지·카페·맛집을 연계한  
**오프라인 방문 유도형 이벤트**를 웹으로 구현하고자 시작한 프로젝트이다.

백엔드/DB 없이도 동작 가능한 구조를 목표로 하여  
프론트엔드 중심 설계 역량을 보여주는 포트폴리오용 프로젝트로 제작했다.

---

## 2. 문제 정의
- 단순 QR 이벤트는 복제·공유가 쉬움
- 서버 없이 쿠폰 검증 로직 구현이 어려움
- 관리자 / 유저 / 직원 역할 분리가 필요

---

## 3. 해결 방식

### 역할 분리
| 역할 | 기능 |
|----|----|
| 관리자 | 이벤트/가맹점 등록 |
| 유저 | 스탬프 적립, 쿠폰 획득 |
| 직원 | 매장 인증 후 쿠폰 사용 처리 |

### QR 흐름
1. 유저 → 매장 QR 스캔 → 스탬프 적립
2. 목표 달성 → 쿠폰 QR 생성
3. 직원 → 매장 QR 스캔
4. 직원 → 쿠폰 QR 스캔 → 사용 처리

---

## 4. 기술적 특징

- LocalStorage 기반 상태 관리
- QR 코드 문자열 기반 검증 로직
- React Hook을 활용한 상태 파생(useMemo, useEffect)
- 모바일 환경 최적화 UI

---

## 5. 확장 가능성

- 서버 연동 시:
  - 로그인/회원 관리
  - 쿠폰 서버 검증
  - 통계 대시보드
- 지도 API 연동:
  - 관광지 위치 표시
  - 주변 가맹점 추천

---

## 6. 포트폴리오 포인트

- 단순 CRUD가 아닌 **실제 서비스 흐름 설계**
- DB 제약 상황에서의 대안적 설계
- QR 기반 오프라인-온라인 연결 경험
