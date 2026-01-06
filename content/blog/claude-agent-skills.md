# Claude Agent Skills 톺아보기

## 들어가며

Claude Code를 사용하다 보면 반복적인 작업이나 특정 도메인에 특화된 지식이 필요한 상황을 자주 마주하게 됩니다. 매번 같은 맥락을 설명하거나 동일한 지침을 반복하는 것은 비효율적입니다. **Agent Skills**는 이러한 문제를 해결하기 위해 탄생한 모듈식 확장 기능입니다.

이 글에서는 **티스토리 기술 블로그 글쓰기 도우미** Skill을 직접 만들어보면서 Agent Skills의 핵심 개념과 작성법을 배워봅니다.

## Agent Skills란?

Agent Skills는 Claude의 기능을 확장하는 **구성된 폴더** 형태의 모듈입니다. 지침, 스크립트, 리소스를 포함할 수 있으며, 세 가지 핵심 특징을 가집니다:

| 특징 | 설명 |
| --- | --- |
| **자율적 호출** | Claude가 사용자 요청과 Skill 설명을 기반으로 언제 사용할지 스스로 결정 |
| **자동 발견** | Personal, Project, Plugin 세 가지 소스에서 자동으로 검색됨 |
| **점진적 로딩** | 필요할 때만 추가 파일을 로드하여 컨텍스트 효율성 유지 |

## Skill의 세 가지 유형

### 1\. Personal Skills (개인용)

```
~/.claude/skills/my-skill-name/
```

-   모든 프로젝트에서 사용 가능
-   개인 워크플로우나 실험적 Skill에 적합
-   Git에 포함되지 않아 개인적으로만 유지

### 2\. Project Skills (팀 공유)

```
.claude/skills/my-skill-name/
```

-   해당 프로젝트 내에서만 작동
-   Git 커밋으로 팀 전체에 자동 공유
-   팀 워크플로우, 프로젝트별 전문 지식에 활용

### 3\. Plugin Skills

-   Claude Code 플러그인에서 제공
-   플러그인 설치 시 자동 활성화

## SKILL.md 작성법

모든 Skill의 핵심은 `SKILL.md` 파일입니다.

### 기본 구조

```
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
Provide clear, step-by-step guidance for Claude.

## Examples
Show concrete examples of using this Skill.
```

### 프론트매터란?

**프론트매터(Frontmatter)**는 마크다운 파일 맨 앞에 위치하는 메타데이터 블록입니다. `---`로 시작하고 `---`로 끝나며, YAML 형식으로 작성합니다. 반드시 파일의 **1번째 줄**에서 시작해야 합니다.

```
---
name: my-skill
description: 이 Skill의 설명
---

# 여기서부터 본문 시작
```

Claude는 이 프론트매터의 `description`을 먼저 읽고 해당 Skill을 호출할지 결정합니다.

### 프론트매터 필드

| 필드 | 요구사항 | 설명 |
| --- | --- | --- |
| `name` | 필수 | 소문자, 숫자, 하이픈만 (최대 64자) |
| `description` | 필수 | Skill의 기능과 **사용 시기** 명시 (최대 1024자) |
| `allowed-tools` | 선택 | Claude가 사용할 수 있는 도구 제한 |

> **핵심 포인트**: `description`이 가장 중요합니다. Claude는 이 설명을 보고 Skill 사용 여부를 결정합니다.

## 실전 예제: 블로그 글쓰기 도우미 만들기

이제 실제로 Skill을 만들어봅시다. 티스토리 기술 블로그 작성을 도와주는 Skill을 예제로 사용합니다. 이 Skill은 실제로 이 글을 작성하면서 사용했습니다.

### 폴더 구조

```
tistory-tech-blog/
├── SKILL.md                    # 메인 Skill 파일
├── assets/
│   └── post-checklist.md       # 발행 전 체크리스트
└── references/
    ├── code-blocks.md          # 티스토리 코드 블록 가이드
    ├── style-guide.md          # 한국어 기술 문서 스타일
    └── templates.md            # 글 유형별 템플릿
```

### SKILL.md 작성

핵심은 `SKILL.md` 파일입니다. description에 사용 시기를 명확히 명시하고, 본문에는 Claude가 따라야 할 지침을 작성합니다.

```
---
name: tistory-tech-blog
description: |
  티스토리 기술 블로그 글쓰기 도우미. 한국어 기술 문서 작성과 티스토리 플랫폼 최적화를 지원합니다.
  이 스킬은 다음 상황에서 사용하세요:
  - 기술 블로그 글 구조를 잡고 싶을 때
  - 코드 설명 글을 작성할 때
  - 한국어 기술 문서 작성 시 표현 교정이 필요할 때
  - 티스토리에 최적화된 마크다운/HTML 형식이 필요할 때
  - TIL, 튜토리얼, 트러블슈팅, 딥다이브 글을 작성할 때
---

# 티스토리 기술 블로그 작성 도우미

## 핵심 원칙: 3C

1. **Correct (정확)**: 기술적으로 틀린 내용이 없어야 함
2. **Clear (명료)**: 독자가 쉽게 이해할 수 있어야 함
3. **Concise (간결)**: 불필요한 내용을 제거하고 핵심만 전달

## 워크플로우

### 1단계: 기획 (Planning)
- 글의 유형 파악 (TIL / 튜토리얼 / 트러블슈팅 / 딥다이브 / 회고)
- 대상 독자 정의
- 핵심 키워드 추출 (SEO용)

### 2단계: 초안 작성 (Drafting)
- 한국어 기술 문서 스타일 가이드 준수 (references/style-guide.md 참조)
- 적절한 템플릿 사용 (references/templates.md 참조)

### 3단계: 교정 (Editing)
- 문체 일관성 검토, 기술 용어 표기 통일

### 4단계: 최적화 (Optimization)
- SEO 메타 정보 생성 (제목, 설명, 태그)

### 5단계: 자체 평가 (Review)
글 작성 완료 후, 다음 항목을 스스로 평가하고 결과를 표로 제시:
- 제목-내용 일치 / 논리적 흐름 / 예제 일관성 / 누락·중복 / 3C 원칙 준수

## 참조 문서

상세 가이드가 필요할 때 다음 파일들을 참조하세요:
- `references/templates.md`: 글 유형별 상세 템플릿
- `references/style-guide.md`: 한국어 기술 문서 스타일 가이드
- `references/code-blocks.md`: 티스토리 코드 블록 작성 가이드
```

### 이 Skill의 특징

| 특징 | 설명 |
| --- | --- |
| **다중 파일 구조** | 메인 SKILL.md는 간결하게, 상세 내용은 references 폴더에 분리 |
| **구체적인 description** | "이 스킬은 다음 상황에서 사용하세요" 패턴으로 사용 시기를 명확히 명시 |
| **점진적 로딩 활용** | 템플릿이나 스타일 가이드는 필요할 때만 로드 |
| **5단계 워크플로우** | 기획 → 초안 → 교정 → 최적화 → **자체 평가** 단계별 가이드 제공 |
| **자체 평가 기능** | 글 작성 후 제목-내용 일치, 예제 일관성 등을 스스로 점검 |

> 전체 코드는 [GitHub 저장소](https://github.com/dnsever/my-skill-playground)에서 확인할 수 있습니다.

## 모범 사례

### 1\. 좁은 범위에서 요청하기

| 좋은 예 | 나쁜 예 |
| --- | --- |
| 티스토리 기술 블로그 글쓰기 | 문서 작성 도우미 |
| Git commit messages | General utilities |
| PDF form filling | Document processing |

하나의 Skill이 너무 많은 일을 하면 Claude가 적절한 시점에 호출하기 어렵습니다. 위 예제의 블로그 글쓰기 도우미도 "티스토리 기술 블로그"로 범위를 좁혀서 Claude가 정확한 시점에 호출할 수 있도록 했습니다.

### 2\. 명확한 설명 작성하기

```
# 모호함 (피해야 함)
description: 블로그 글 작성을 도와줍니다

# 구체적 (권장)
description: |
  티스토리 기술 블로그 글쓰기 도우미.
  이 스킬은 다음 상황에서 사용하세요:
  - 기술 블로그 글 구조를 잡고 싶을 때
  - TIL, 튜토리얼, 트러블슈팅 글을 작성할 때
  - 한국어 기술 문서 표현 교정이 필요할 때
```

**"이 스킬은 다음 상황에서 사용하세요"** 구문으로 사용 시기를 명시하는 것이 핵심입니다. Claude는 이 설명을 보고 Skill 호출 여부를 결정합니다.

### 3\. 버전 문서화

```
## Version History
- v2.0.0 (2025-10-01): Breaking changes to API
- v1.1.0 (2025-09-15): Added new features
- v1.0.0 (2025-09-01): Initial release
```

## 트러블슈팅

### Claude가 Skill을 사용하지 않을 때

우리가 claude skill을 열심히 만들었음에도 불구하고, claude가 우리의 스킬을 사용하지 않을 수 있습니다. 그럴 경우 아래와 같은 체크리스트를 통해 점검해볼 수 있습니다:

1.  **설명이 구체적인가?**
    -   사용자가 언급할 주요 용어가 포함되어 있는지 확인
2.  **YAML 구문이 유효한가?**
    -   1번 줄에 `---` 시작
    -   Markdown 콘텐츠 전에 `---` 종료
    -   탭 없이 올바른 들여쓰기
3.  `cat .claude/skills/my-skill/SKILL.md | head -n 15`
4.  **파일 위치가 올바른가?**
5.  `ls ~/.claude/skills/*/SKILL.md # Personal ls .claude/skills/*/SKILL.md # Project`

### 디버그 모드 실행

```
claude --debug
```

## Skill 관리 명령어

```
# 사용 가능한 Skills 확인
ls ~/.claude/skills/
ls .claude/skills/

# Claude에게 직접 질문
"What Skills are available?"

# Skill 제거
rm -rf ~/.claude/skills/my-skill      # Personal
rm -rf .claude/skills/my-skill        # Project
```

## 마치며

Agent Skills는 Claude Code의 능력을 도메인별로 확장하는 강력한 방법입니다. 핵심은 **명확한 설명**과 **집중된 범위**입니다. 잘 설계된 Skill 하나가 수십 번의 반복 설명을 대체할 수 있습니다.

시작은 간단합니다. `~/.claude/skills/` 아래에 폴더 하나 만들고, claude를 통해 나만의 skill 만들기를 요청해보세요.

## 참고 자료

-   [공식 문서: Agent Skills](https://code.claude.com/docs/ko/skills)
-   [Anthropic 엔지니어링 블로그: Equipping agents for the real world](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
-   [예제 Skill 저장소 (GitHub)](https://github.com/dnsever/my-skill-playground) - 이 글에서 소개한 블로그 글쓰기 도우미 Skill
