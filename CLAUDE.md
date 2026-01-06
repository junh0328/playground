# Playground - 기술 블로그 데모 프로젝트

## 프로젝트 개요
React/Next.js 기술 개념을 설명하는 **인터랙티브 데모 + 블로그 글**을 작성하는 플레이그라운드

- **기술 스택**: Next.js 16.1.1, React 19.2.3, React Compiler, TypeScript, Tailwind CSS
- **목적**: 기술 블로그 글 작성 시 함께 배포할 인터랙티브 데모 페이지 구현

---

## 디렉토리 구조

```
playground/
├── content/
│   ├── prompt/              # Phase 1: 계획 문서
│   │   └── [topic]-prompt.md
│   ├── blog/                # Phase 4: 블로그 마크다운
│   │   └── [topic]-tech-blog.md
│   └── assets/              # 원본 이미지, 다이어그램
├── public/
│   └── assets/              # 정적 에셋 (Next.js 접근용, content/assets에서 복사)
├── src/
│   ├── app/
│   │   ├── page.tsx         # 홈 (데모 목록)
│   │   └── demos/           # Phase 2: 데모 페이지
│   │       └── [topic]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── common/          # Phase 3: 공통 컴포넌트
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── ConsoleLog.tsx
│   │   │   ├── DemoSection.tsx
│   │   │   ├── InteractiveExample.tsx
│   │   │   └── TabSwitcher.tsx
│   │   └── [topic]/         # Phase 2: 주제별 컴포넌트
│   │       ├── index.ts          # 배럴 export
│   │       ├── codeSnippets.ts   # 코드 예제 문자열
│   │       └── *Demo.tsx         # 데모 컴포넌트
│   ├── hooks/
│   │   └── [topic]/         # Phase 2: 주제별 훅
│   └── stores/              # Phase 2: 외부 스토어 (필요시)
└── CLAUDE.md
```

---

## 블로그 작성 워크플로우

사용자가 "OO 개념에 대한 글을 작성하고 싶어"라고 요청하면 다음 4단계로 진행:

### Phase 1: 계획 문서 생성
**입력**: 사용자의 블로그 주제 요청
**출력**: `content/prompt/[topic]-prompt.md`

#### 체크리스트
- [ ] 사용자에게 목표 독자 수준 확인 (초급/중급/고급)
- [ ] 블로그 글 목차 구성 후 사용자 확인
- [ ] 예제 구성 방향 확인 (기본 → 심화)
- [ ] 계획 문서 작성

### Phase 2: 데모 페이지 및 컴포넌트 구현
**출력**:
- `src/app/demos/[topic]/page.tsx` - 데모 페이지
- `src/components/[topic]/*` - 주제별 컴포넌트
- `src/hooks/[topic]/*` - 주제별 훅
- `src/stores/*` - 외부 스토어 (필요시)

#### 체크리스트
- [ ] 데모 페이지 생성
- [ ] 주제별 컴포넌트 생성 (index.ts, codeSnippets.ts, *Demo.tsx)
- [ ] 필요한 훅 구현
- [ ] 필요한 스토어 구현
- [ ] `pnpm build` 성공 확인
- [ ] 홈 페이지(page.tsx)에 데모 링크 추가

### Phase 3: 리팩터링
- 재사용 가능한 컴포넌트 → `src/components/common/*`
- 2개 이상의 주제에서 사용되면 common으로 이동

#### 체크리스트
- [ ] 공통 컴포넌트 식별
- [ ] common 폴더로 이동
- [ ] import 경로 수정
- [ ] `pnpm build` 성공 확인

### Phase 4: 블로그 마크다운 생성
**출력**: `content/blog/[topic]-tech-blog.md`

> **⚠️ 이 Phase에서는 `my-skill-playground` skill을 반드시 활용합니다.**
>
> 블로그 글 작성 시작 전에 `/my-skill-playground` skill을 호출하여:
> - 글 유형에 맞는 템플릿 선택 (딥다이브, 튜토리얼, 트러블슈팅 등)
> - 한국어 기술 문서 스타일 가이드 준수
> - 코드 블록 작성 가이드 적용
> - 발행 전 체크리스트로 최종 검토

#### 글 유형 선택 기준
| 상황 | 권장 유형 |
|------|----------|
| 기술의 내부 동작을 깊이 분석 | **딥다이브** |
| 특정 기능 구현 방법 설명 | **튜토리얼** |
| 에러 해결 과정 공유 | **트러블슈팅** |
| 두 기술 비교 | **비교 분석** |

#### 블로그 글 구성 (기본 - 딥다이브 기준)
1. 들어가며 (문제 상황 + 경고/에러 메시지)
2. 경고 메시지 해석
3. 해결책 소개
4. Before/After 코드 비교
5. 기본 예제
6. 심화 예제 (다이어그램 포함)
7. 주의사항 (Gotchas)
8. 마무리

#### 체크리스트
- [ ] `my-skill-playground` skill 호출
- [ ] 글 유형에 맞는 템플릿 선택
- [ ] 스타일 가이드 준수 (종결어미, 용어 표기 등)
- [ ] 마크다운 파일 작성
- [ ] 코드 예제 삽입 (코드 블록 가이드 준수)
- [ ] 다이어그램/이미지 삽입
- [ ] 이미지를 public/assets로 복사
- [ ] 발행 전 체크리스트로 최종 검토
- [ ] SEO 최적화 (제목, 메타 설명, 태그)

---

## 계획 문서 템플릿 (prompt)

`content/prompt/[topic]-prompt.md` 작성 시 다음 템플릿 사용:

```markdown
# [topic] 기술 블로그 구현 계획

## 개요
- **주제**:
- **목표 독자**: (초급/중급/고급)
- **핵심 개념**:

## 블로그 글 목차
1. 들어가며
2. ...

## 예제 구성
- **기본 예제**:
- **심화 예제**:

## 디렉토리 구조
```
src/
├── app/demos/[topic]/
├── components/[topic]/
├── hooks/[topic]/
└── stores/
```

## 생성할 파일
| 파일 | 용도 |
|------|------|
| `src/app/demos/[topic]/page.tsx` | 데모 페이지 |
| ... | ... |

## 구현 순서
### Phase 1: 기반 컴포넌트
- [ ] ...

### Phase 2: 훅/스토어 구현
- [ ] ...

### Phase 3: 데모 페이지
- [ ] ...

### Phase 4: 블로그 글
- [ ] ...
```

---

## Assets 관리

### 이미지/다이어그램 저장 규칙

1. **원본 저장**: `content/assets/[이미지명].png`
2. **Next.js용 복사**: `public/assets/[이미지명].png`

```bash
# 이미지 복사 명령어
cp content/assets/[이미지명].png public/assets/
```

### 사용 위치별 경로

| 사용 위치 | 경로 |
|----------|------|
| 블로그 마크다운 (Tistory용) | `![설명](/content/assets/이미지.png)` |
| 데모 페이지 (Next.js) | `src="/assets/이미지.png"` |

### 왜 두 곳에 저장하나요?
- `content/assets/`: 블로그 글 원본과 함께 관리 (Git 추적)
- `public/assets/`: Next.js에서 정적 파일로 접근 가능

---

## codeSnippets 패턴

### 왜 코드를 문자열로 분리하나요?

1. **CodeBlock 컴포넌트에 전달**: 실제 실행 코드와 표시용 코드 분리
2. **하이라이팅 제어**: 필요한 부분만 강조 가능
3. **재사용성**: 여러 곳에서 같은 코드 예제 사용

### codeSnippets.ts 구조

```typescript
// src/components/[topic]/codeSnippets.ts

// 문제 상황 코드
export const problemCode = `// 비권장 패턴
const [state, setState] = useState(false);
useEffect(() => {
  setState(true);
}, []);`;

// 해결책 코드
export const solutionCode = `// 권장 패턴
const state = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot
);`;

// 심화 예제 코드
export const advancedCode = `// 외부 스토어 패턴
export const store = {
  subscribe: (callback) => { ... },
  getSnapshot: () => state,
};`;
```

### 사용 예시

```tsx
import { problemCode, solutionCode } from './codeSnippets';

<TabSwitcher
  tabs={[
    { id: 'before', label: 'Before', content: <CodeBlock code={problemCode} /> },
    { id: 'after', label: 'After', content: <CodeBlock code={solutionCode} /> },
  ]}
/>
```

---

## 홈 페이지 데모 추가

새 데모 추가 시 `src/app/page.tsx`의 `demos` 배열에 추가:

```typescript
const demos: Demo[] = [
  // 기존 데모들...

  // 새 데모 추가
  {
    id: 'new-topic',
    title: '새 주제',
    description: '새 주제에 대한 설명',
    path: '/demos/new-topic',
    tags: ['React', 'Hooks'],
    status: 'stable',  // 'stable' | 'beta' | 'experimental'
  },
];
```

### Demo 타입
```typescript
interface Demo {
  id: string;          // 고유 식별자 (kebab-case)
  title: string;       // 표시 제목
  description: string; // 설명 (3줄 이내)
  path: string;        // 데모 페이지 경로
  tags: string[];      // 태그 목록
  status: 'stable' | 'beta' | 'experimental';
}
```

---

## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 계획 문서 | `[topic]-prompt.md` | `use-sync-external-store-prompt.md` |
| 블로그 글 | `[topic]-tech-blog.md` | `use-sync-external-store-tech-blog.md` |
| 데모 페이지 폴더 | kebab-case | `demos/use-sync-external-store/` |
| 컴포넌트 폴더 | camelCase | `components/useSyncExternalStore/` |
| 훅 폴더 | camelCase | `hooks/useSyncExternalStore/` |
| 컴포넌트 파일 | PascalCase | `TodoListDemo.tsx` |
| 훅 파일 | camelCase | `useIsMount.ts` |
| 이미지 파일 | snake_case | `todoList_diagram.png` |

---

## 공통 컴포넌트 사용법

### CodeBlock
```tsx
<CodeBlock
  code={codeString}
  language="typescript"
  title="파일명 또는 설명"
  highlight={[1, 2, 3]}  // 하이라이트할 줄 번호
/>
```

### InteractiveExample
```tsx
<InteractiveExample
  code={codeString}
  language="typescript"
  title="예제 제목"
  resultTitle="실행 결과"
  explanation={[
    { title: '단계1', description: '설명1' },
    { title: '단계2', description: '설명2' },
  ]}
>
  <DemoComponent />
</InteractiveExample>
```

### DemoSection
```tsx
<DemoSection
  id="section-id"
  title="섹션 제목"
  subtitle="부제목"
  description={<p>섹션 설명</p>}
>
  {children}
</DemoSection>
```

### TabSwitcher
```tsx
<TabSwitcher
  tabs={[
    { id: 'before', label: 'Before', badge: '비권장', content: <Before /> },
    { id: 'after', label: 'After', badge: '권장', content: <After /> },
  ]}
  defaultTab="after"
/>
```

---

## 빌드 & 실행

```bash
pnpm install    # 의존성 설치
pnpm dev        # 개발 서버 (http://localhost:3000)
pnpm build      # 프로덕션 빌드 (Phase 완료 시마다 실행)
```

---

## Skill 활용 가이드

### my-skill-playground 스킬

Phase 4 (블로그 마크다운 생성) 단계에서 `my-skill-playground` skill을 활용합니다.

#### 스킬이 제공하는 기능
| 파일 | 용도 |
|------|------|
| `SKILL.md` | 티스토리 기술 블로그 작성 워크플로우 (기획→초안→교정→최적화) |
| `references/templates.md` | 글 유형별 템플릿 (TIL, 튜토리얼, 트러블슈팅, 딥다이브, 회고, 비교 분석, 시리즈) |
| `references/style-guide.md` | 한국어 기술 문서 스타일 가이드 (문체, 용어 표기, 문장 구조) |
| `references/code-blocks.md` | 티스토리 코드 블록 작성 가이드 |
| `assets/post-checklist.md` | 발행 전 체크리스트 |

#### 스킬 활용 시점
```
Phase 1 → Phase 2 → Phase 3 → [my-skill-playground 호출] → Phase 4
```

#### 핵심 원칙 (3C)
1. **Correct (정확)**: 기술적으로 틀린 내용이 없어야 함
2. **Clear (명료)**: 독자가 쉽게 이해할 수 있어야 함
3. **Concise (간결)**: 불필요한 내용을 제거하고 핵심만 전달

#### 블로그 글 출력 형식
```markdown
---
title: "제목"
category: 카테고리
tags: 태그1, 태그2, 태그3
description: 메타 설명 (150자 이내)
---

# 제목

(본문 내용)
```

#### SEO 최적화 가이드
- **제목**: 핵심 키워드 앞쪽 배치, 30-50자
- **메타 설명**: 150자 이내, 핵심 내용 요약
- **태그**: 5-10개, 대분류 + 소분류 조합
