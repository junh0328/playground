# useSyncExternalStore 기술 블로그 구현 계획

## 개요
React 19 + Compiler 환경에서 `useSyncExternalStore` 훅을 소개하는 기술 블로그 글과 인터랙티브 데모 페이지 구현

## 산출물
1. **Tistory용 마크다운 블로그 글** (`/src/content/blog/use-sync-external-store.md`)
2. **인터랙티브 데모 페이지** (`/src/app/demos/use-sync-external-store/page.tsx`)

---

## 블로그 글 목차

### 1. 들어가며
- React 19 Compiler 등장 배경
- useEffect 기반 isMount 패턴이 비권장된 이유

### 2. Before/After 비교
- useEffect 방식 vs useSyncExternalStore 방식 코드 비교
- 각 방식의 문제점/장점

### 3. 기본 예제: isMount 구현
- 3가지 매개변수 (subscribe, getSnapshot, getServerSnapshot) 상세 설명
- 각 매개변수가 언제 호출되는지 설명

### 4. 주의사항 (Gotchas)
- getSnapshot 참조 동일성 유지
- SSR/Hydration 불일치 방지
- 무한 루프 방지

### 5. 심화: 로컬 스토리지 TodoList
- 외부 스토어 패턴
- 탭 간 동기화

### 6. 마무리

---

## 디렉토리 구조

```
src/
├── app/
│   └── demos/
│       └── use-sync-external-store/
│           └── page.tsx              # 데모 페이지
├── components/
│   ├── common/                       # 공통 컴포넌트
│   │   ├── CodeBlock.tsx             # 코드 하이라이팅
│   │   ├── InteractiveExample.tsx    # 코드+뷰 분할 레이아웃
│   │   ├── ConsoleLog.tsx            # 실시간 로그 패널
│   │   ├── DemoSection.tsx           # 섹션 래퍼
│   │   └── TabSwitcher.tsx           # Before/After 탭
│   └── useSyncExternalStore/         # 페이지별 컴포넌트 (camelCase)
│       ├── index.ts                  # 배럴 export
│       ├── codeSnippets.ts           # 코드 예제 문자열
│       ├── IsMountBefore.tsx
│       ├── IsMountAfter.tsx
│       ├── OnlineStatusDemo.tsx
│       └── TodoListDemo.tsx
├── hooks/
│   └── useSyncExternalStore/
│       ├── useIsMount.ts             # 기본 예제
│       ├── useOnlineStatus.ts        # 온라인 상태 예제
│       └── useLocalStorageTodos.ts   # 심화 예제
├── stores/
│   └── todoStore.ts                  # 로컬 스토리지 Todo 스토어
└── content/
    └── blog/
        └── use-sync-external-store.md # Tistory용 마크다운
```

### 컨벤션
- **common/**: 여러 페이지에서 재사용되는 공통 컴포넌트
- **페이지별 폴더**: camelCase (예: `useSyncExternalStore/`)
- **배럴 export**: `index.ts`로 한번에 import 가능

---

## 주요 컴포넌트 설계

### InteractiveExample.tsx
참고 이미지 기반 레이아웃:
```
+----------------------------------+
|          [제목 + 설명]            |
+----------------+-----------------+
|   CodeBlock    |   실행 결과      |
|   (왼쪽)        |   (오른쪽)       |
+----------------+-----------------+
|        ConsoleLog (하단)          |
+----------------------------------+
|        동작 원리 설명 (하단)        |
+----------------------------------+
```

Props:
- `code`: 표시할 코드
- `title`: 섹션 제목
- `children`: 실행 결과 뷰
- `showConsole`: 로그 패널 표시 여부
- `explanation`: 동작 원리 설명 (번호 목록)

### ConsoleLog.tsx
- 실시간 로그 스크롤
- 로그 타입별 색상 (log, info, warn, error)
- 타임스탬프 표시
- Clear 버튼

---

## 훅 구현

### useIsMount.ts (기본)
```typescript
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useIsMount() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

### useLocalStorageTodos.ts (심화)
- localStorage와 동기화
- storage 이벤트로 탭 간 동기화
- CRUD 액션 제공

---

## 구현 순서

### Phase 1: 기반 컴포넌트 ✅
- [x] `ConsoleLog.tsx` 생성
- [x] `InteractiveExample.tsx` 생성
- [x] `DemoSection.tsx` 생성
- [x] `TabSwitcher.tsx` 생성

### Phase 2: 훅 구현 ✅
- [x] `useIsMount.ts`
- [x] `useOnlineStatus.ts`
- [x] `todoStore.ts` + `useLocalStorageTodos.ts`

### Phase 3: 데모 페이지 ✅
- [x] 페이지 레이아웃 구성
- [x] 각 섹션별 예제 연결
- [x] 반응형 스타일링

### Phase 4: 블로그 글 ✅
- [x] 마크다운 파일 작성
- [x] 코드 예제 삽입

---

## 수정/생성할 파일 목록

| 파일 | 작업 |
|------|------|
| `src/components/demo/ConsoleLog.tsx` | 생성 |
| `src/components/demo/InteractiveExample.tsx` | 생성 |
| `src/components/demo/DemoSection.tsx` | 생성 |
| `src/components/demo/TabSwitcher.tsx` | 생성 |
| `src/hooks/useSyncExternalStore/useIsMount.ts` | 생성 |
| `src/hooks/useSyncExternalStore/useOnlineStatus.ts` | 생성 |
| `src/stores/todoStore.ts` | 생성 |
| `src/hooks/useSyncExternalStore/useLocalStorageTodos.ts` | 생성 |
| `src/app/demos/use-sync-external-store/page.tsx` | 생성 |
| `src/content/blog/use-sync-external-store.md` | 생성 |

---

## 참고
- 기존 CodeBlock.tsx 재사용 (수정 불필요)
- 레이아웃 참고: my-tanstack-query-strategy 프로젝트
- React 19.2.3 + babel-plugin-react-compiler 환경
