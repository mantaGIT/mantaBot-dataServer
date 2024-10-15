# mantaBot-dataServer
스플래툰3 스케줄 데이터 처리 서버

## Intro
[기존의 봇 프로젝트](https://github.com/mantaGIT/mantaBot)에서의 문제점을 해결하기 위해 서버를 분리하여 구축합니다.

- 파일 시스템을 사용한 데이터 관리
- 새로운 데이터 구조 추가 시 의존성 문제
- 관심사 분리 (봇 명령어 처리 / 데이터 처리)
- 성능 추적
- 에러 상황 모니터링

<img width="1200" alt="image" src="https://github.com/user-attachments/assets/0dc6cf4c-fc03-4964-a7e4-262c0332d9f3">


## Description
데이터 처리 부분을 담당합니다.

- 외부 API 요청
- 데이터 파싱
- 파싱한 데이터 데이터베이스에 저장
- 봇 서버의 API 요청 처리

새로운 데이터 구조 추가 등의 확장성을 고려하여 각 데이터 처리를 모듈로 생성하고 관리합니다.

<img width="1200" alt="image" src="https://github.com/user-attachments/assets/83a464c9-41fa-4f28-a888-78342ef657fd">


## 진행 상황

- 개발 진행 브랜치 : [develop](https://github.com/mantaGIT/mantaBot-dataServer/tree/develop)
- 프로젝트 진행 상황 : [봇 데이터 서버 분리 및 API 구축](https://github.com/users/mantaGIT/projects/3)
