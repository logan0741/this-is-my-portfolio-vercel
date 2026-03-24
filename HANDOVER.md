# 🤖 AI 에이전트 핸드오버 문서 (Context Handover)

> **To the New Agent Instance**: 
> 만약 새로운 대화 세션에서 이 문서를 읽고 있다면, 당신은 기존에 진행되던 "Apple 감성 포트폴리오 웹사이트" 프로젝트의 컨텍스트를 이어받은 것입니다. 아래의 전체 진행 상황과 아키텍처를 완벽히 숙지하고 User의 다음 지시를 대기하십시오.

---

## 1. 프로젝트 및 목표 구조 (3-Phase Architecture)
이 프로젝트는 단순한 정적 웹사이트가 아닌, 추후 스케줄러와 DB가 붙는 **풀스택 아키텍처**로 설계되었습니다.

*   **Phase 1 (Vercel 정적 프론트엔드 - 🟢 완료)**: 
    *   서버 없이 더미 JSON(`data.json`)으로 동작. (현재 User가 이 부분만 따로 떼어내어 새 GitHub Repo에 구축 중입니다.)
*   **Phase 2 (로컬 풀스택 - 🟢 완료 및 테스트 대기)**: 
    *   로컬 PC에서 FastAPI 백엔드 + MySQL 구동.
    *   프론트엔드의 `NEXT_PUBLIC_IS_VERCEL=false` 환경변수를 통해 Admin 페이지에서 실시간으로 DB에 활동 내용을 추가하고 이미지를 업로드.
*   **Phase 3 (오라클 실서버 배포 - 🟡 대기)**: 
    *   24시간 구동되는 Oracle Cloud Linux 서버에 백엔드 배포.
    *   `APScheduler`를 통해 매일 자정, 등록된 포트폴리오의 GitHub README.md를 크롤링하여 자동 업데이트.

## 2. 지금까지 달성한 핵심 작업 내역 (What we've done)

### Frontend (Next.js App Router)
*   **애플 감성 UI/UX**: Glassmorphism 디자인 적용 완료.
*   **사진 같은 물리 서류첩**: `/portfolio` 진입 시, 2개의 대규모 3D 물리적 서류첩("날짜별 보기", "목적성 위주 보기") 컴포넌트(`RealisticFolder`)에서 택 1 하는 UI 설계 완벽 적용 (Framer Motion).
*   **아코디언 뷰 & 모달**: 상세 내역은 아코디언처럼 펼쳐지고 썸네일 클릭 시 Quick Look 모달창이 뜨도록 구현.
*   **어드민 폼**: 멀티파트 이미지 업로드 및 태그 동적 생성이 가능한 다단계 위자드 폼(`/admin`) 완료.

### Backend (Python FastAPI)
*   **코드 작성 완료**: `main.py`, `models.py`, `database.py`, `schemas.py` 및 라우터 작성 완료.
*   **Python 3.8 호환성 패치**: `list[str]` 등 3.10 최신 문법을 `typing` 모듈 기반으로 다운그레이드하여 충돌 방지 완벽 처리.
*   **DB 초기화**: `MySQL`에 `portfolio` 데이터베이스 및 4개의 필수 테이블(`years`, `activities`, `activity_roles`, `activity_files`) 생성을 방금 마침.
*   **디렉토리 패치**: 서버 실행 시 빈 `uploads` 폴더가 없어 생기는 에러를 막기 위해 `main.py` 최상단에 자동 생성 로직 반영.

## 3. 현재의 분기점 (Current Status & User Action)
*   **User의 현재 행동**: User는 "프론트엔드 소스코드(Phase 1)" 부분만 `vercel-deploy` 폴더 형태로 완전히 잘라내어 **새로운 레포지토리**에 세팅 중입니다.
*   이는 Vercel에 프론트엔드 생태계를 독립적으로 배포하기 위함입니다.
*   원본 폴더(`this-is-my-portfolio`)에는 백엔드 코드와 기존 프론트 코드가 보존되어 있습니다.

## 4. Next Step (When the user provides the next task)
새로운 에이전트는 기동 즉시 아래를 파악하십시오:
1. User가 "새 레포지토리(Vercel 전용)"에서 프론트엔드 작업(디자인 수정 등)을 이어서 요구하는 것인지,
2. "기존 레포지토리"에서 백엔드 서버(Phase 2) 테스트 및 기능 추가를 요구하는 것인지 파악합니다.
3. 이 문서를 읽었다면 User에게 **"핸드오버 문서를 바탕으로 아키텍처와 분리된 Vercel 레포지토리 상황을 완벽히 인지했습니다. 다음 작업을 지시해 주십시오."** 라고 보고하십시오.
