---
name: harness-diagnostics
description: |
  코드베이스와 Codex skill의 에이전트 친화도(harness)를 12개 원칙으로 진단하고 개선안을 제안합니다.
  사용 상황: 신규 환경 구축(Setup), 현 상태 점검(Audit), drift 정리(Maintenance), skill 품질 검사(Self).
version: 1.3.0
---

# Harness Diagnostics

에이전트 협업 환경의 성숙도를 평가하고 실행 가능한 리포트를 생성합니다.

## 핵심 원칙

1. **Read-only**: 기본 동작은 진단/제안만 수행
2. **Evidence-first**: 모든 판단은 파일 경로 근거 포함
3. **Principle-driven**: 12원칙 + 성숙도 프레임워크 기반 채점
4. **Self-referential**: 이 skill 자체도 동일 기준으로 진단 가능

## 모드 선택

| 모드 | 트리거 | 목적 | 워크플로우 |
|------|--------|------|-----------|
| **Setup** | 새 프로젝트, "환경 구축" | 초기 harness 구성 제안 | `references/setup-workflow.md` |
| **Audit** | "진단", "점검" | 점수화 + 개선 로드맵 | `references/audit-workflow.md` |
| **Maintenance** | "drift", "정리" | 변경 감지 + GC 제안 | `references/maintenance-workflow.md` |

모드가 애매하면 사용자에게 확인한다.

## 진단 대상

| 대상 | 판별 기준 | 체크리스트 |
|------|----------|-----------|
| **코드베이스** | git repo + 소스 존재 | `references/codebase-checklist.md` |
| **Skill** | `.codex/skills/*/SKILL.md` | `references/skill-checklist.md` |
| **Self** | 본 skill 자체 | `references/skill-checklist.md` |

## 12 Harness Principles

`references/principles.md`를 기준으로 P1~P12를 0-10점으로 평가한다.
P1 Agent Entry Point, P2 Map, P3 Invariant, P4 Convention, P5 Progressive Disclosure,
P6 Layered, P7 Garbage Collection, P8 Observability, P9 Knowledge, P10 Reproducibility, P11 Modularity, P12 Self-Documentation.

## 성숙도 등급

| 등급 | 점수 | 의미 |
|------|------|------|
| L1 | 0-19 | None |
| L2 | 20-39 | Basic |
| L3 | 40-59 | Structured |
| L4 | 60-79 | Optimized |
| L5 | 80-100 | Autonomous |

가중치/산식은 `references/maturity-framework.md`를 따른다.

## 실행 절차

1. 모드 결정
2. 대상 판별 (코드베이스/Skill/Self)
3. 해당 워크플로우 실행
4. `references/report-template.md` 형식으로 리포트 출력

## 자동화 도구

- Self 진단 스모크 테스트: `scripts/self-audit.sh`
- 점수 계산 MD 템플릿: `references/score-template.md`
- 점수 계산 JSON 템플릿: `references/score-template.json`
- 분기 점검 로그: `logs/self-audit-log.md`

## 파일 구조

```
SKILL.md
├── references/
│   ├── principles.md
│   ├── maturity-framework.md
│   ├── codebase-checklist.md
│   ├── skill-checklist.md
│   ├── setup-workflow.md
│   ├── audit-workflow.md
│   ├── maintenance-workflow.md
│   ├── report-template.md
│   ├── score-template.md
│   └── score-template.json
├── examples/
│   ├── sample-agents-md.md
│   ├── sample-report.md
│   └── sample-docs-structure.md
├── scripts/self-audit.sh
└── logs/self-audit-log.md
```

## References

| 파일 | 역할 |
|------|------|
| `references/principles.md` | 12원칙 판단 기준 |
| `references/maturity-framework.md` | 차원/가중치/점수 산식 |
| `references/codebase-checklist.md` | 코드베이스 체크리스트 (84항목) |
| `references/skill-checklist.md` | Skill 체크리스트 (40항목) |
| `references/setup-workflow.md` | Setup 워크플로우 |
| `references/audit-workflow.md` | Audit 워크플로우 |
| `references/maintenance-workflow.md` | Maintenance 워크플로우 |
| `references/report-template.md` | 리포트 출력 형식 |
| `references/score-template.md` | 차원/종합 점수 계산 표 |
| `references/score-template.json` | 자동 계산 입력 스키마 |

## Examples

| 파일 | 내용 |
|------|------|
| `examples/sample-agents-md.md` | AGENTS.md 예시 |
| `examples/sample-report.md` | Audit 리포트 예시 |
| `examples/sample-docs-structure.md` | 권장 docs 구조 |
