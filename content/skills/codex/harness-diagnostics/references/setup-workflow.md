# Setup Mode Workflow

> 새로운 프로젝트에서 에이전트 협업 환경을 초기화하기 위한 워크플로우.

---

## Phase 1: 현황 스캔

프로젝트의 현재 상태를 파악한다.

### Tech Stack 감지

- `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml` 등 의존성 파일 탐색
- 사용 중인 언어, 프레임워크, 빌드 도구 식별
- 프로젝트 유형 분류: web app / library / CLI / monorepo / 기타

### 기존 문서 스캔

- `README.md`, `docs/`, `AGENTS.md`, `CLAUDE.md` 존재 여부 확인
- 문서의 최신성 및 완성도 파악

### 기존 도구 확인

- Linter 설정 (ESLint, Pylint, golangci-lint 등)
- Formatter 설정 (Prettier, Black, gofmt 등)
- CI/CD 파이프라인 (GitHub Actions, GitLab CI 등)
- Pre-commit hooks, type checking 설정

---

## Phase 2: Gap 분석

현재 상태를 12원칙 기준으로 비교 평가한다.

- 각 원칙별 충족 여부 판단
- 누락 요소를 구체적으로 식별
- Impact가 높은 항목부터 우선순위 정렬
- 구현 난이도 대비 효과 평가

---

## Phase 3: 제안 생성

Tech stack에 맞는 구체적 개선안을 생성한다.

### AGENTS.md / CLAUDE.md 템플릿 생성

- Tech stack 기반 맞춤형 템플릿 제공
- 프로젝트 컨벤션, 빌드 명령어, 테스트 방법 포함

### docs/ 구조 제안

- ADR 디렉토리, API 문서, 가이드 등 권장 구조
- `examples/sample-docs-structure.md` 참조

### 우선순위별 실행 계획

| 시간대 | 작업 | 예시 |
|--------|------|------|
| **Immediate** (< 1시간) | 에이전트 진입점 + 기본 도구 | AGENTS.md 작성, linting 설정 |
| **Short-term** (< 1일) | 문서 구조 + CI | docs/ 구축, CI 설정 |
| **Medium-term** (< 1주) | 프로세스 + 테스트 | ADR 도입, 포괄적 테스트 환경 |

---

## Phase 4: 리포트 출력

`references/report-template.md`의 Setup 리포트 형식으로 출력한다.

### 리포트 형식 검증

리포트 생성 후 출력 전 다음 사항을 검증한다:

- [ ] 공통 헤더(진단 대상, 모드, 날짜, 기술 스택, 진단 범위)가 포함되어 있는가
- [ ] 현황 요약 테이블(기술 스택, 문서, 도구/설정)이 빠짐없이 작성되어 있는가
- [ ] Gap 분석이 12원칙 모두를 커버하는가
- [ ] 실행 계획이 시간대별(Immediate/Short-term/Medium-term)로 분류되어 있는가
- [ ] 생성 제안 파일 목록에 우선순위가 부여되어 있는가
- [ ] Self-Assessment 부록이 포함되어 있는가

---

## Tech Stack별 권장 사항

### Node.js / TypeScript

- `AGENTS.md`에 `npm`/`yarn`/`pnpm` 명령어 명시
- ESLint + Prettier 설정 확인 및 권장
- `tsconfig.json` strict 모드 권장
- Jest 또는 Vitest 테스트 프레임워크 설정
- `.nvmrc` 또는 `engines` 필드로 Node 버전 고정

### Python

- `AGENTS.md`에 가상환경 활성화 방법 명시
- Ruff 또는 Pylint + Black 설정 권장
- `pyproject.toml` 기반 프로젝트 구성 권장
- pytest 설정, mypy type hints 권장

### Go

- `AGENTS.md`에 `go build`, `go test` 명령어 명시
- golangci-lint 설정 권장
- 테이블 기반 테스트 패턴 권장
- 모듈 구조 및 패키지 레이아웃 가이드 포함

### General / 기타

- 언어별 표준 linter 및 formatter 설정
- 빌드/실행 방법을 AGENTS.md에 명확히 기술
- CI 파이프라인 최소 구성 (lint, test, build)
