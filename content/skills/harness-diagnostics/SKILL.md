---
name: harness-diagnostics
description: |
  코드베이스와 Claude Code skill의 "에이전트 친화도(harness)"를 진단하고 개선안을 제안합니다.
  이 스킬은 다음 상황에서 사용하세요:
  - 새 프로젝트에서 에이전트 협업 환경을 처음 구축할 때 (Setup)
  - 기존 프로젝트의 에이전트 친화도를 평가하고 싶을 때 (Audit)
  - 시간이 지난 프로젝트의 drift/stale 상태를 점검할 때 (Maintenance)
  - Claude Code skill 자체의 품질을 진단하고 싶을 때
  - "harness 진단", "에이전트 환경 점검", "skill 품질 검사" 등의 표현 사용 시
version: 1.2.0
---

# Harness Diagnostics

에이전트가 효과적으로 일할 수 있는 환경(harness)의 성숙도를 12개 원칙으로 평가하고 개선안을 제안합니다.

## 핵심 원칙

1. **Read-only**: 진단과 제안만 수행. 코드/설정을 직접 수정하지 않음
2. **제안 기반**: 모든 출력은 리포트 형태. 사람이 판단 후 적용
3. **원칙 기반**: 12개 harness 원칙에 따른 체계적 평가
4. **자기 참조**: 이 skill 자체에도 동일한 진단 기준 적용 가능

---

## 모드 선택

| 모드 | 트리거 | 목적 | 상세 워크플로우 |
|------|--------|------|----------------|
| **Setup** | 새 프로젝트, "환경 구축" | 에이전트 협업 환경 초기 구성 제안 | `references/setup-workflow.md` |
| **Audit** | "진단해줘", "점검" | 현재 상태 평가 + 점수화 + 개선 로드맵 | `references/audit-workflow.md` |
| **Maintenance** | "drift 확인", "정리" | 변경 감지 + GC 대상 + 델타 리포트 | `references/maintenance-workflow.md` |

모드 판별이 어려우면 사용자에게 질문한다.

---

## 진단 대상

| 대상 | 판별 기준 | 체크리스트 |
|------|----------|-----------|
| **코드베이스** | git repo, 소스코드 존재 | `references/codebase-checklist.md` |
| **Skill** | `SKILL.md` 존재, `.claude/skills/` 하위 | `references/skill-checklist.md` |
| **Self** | 이 skill 자체를 대상으로 지정 | `references/skill-checklist.md` |

하나의 세션에서 코드베이스 + Skill 동시 진단 가능.

---

## 12 Harness Principles

| # | 원칙 | 핵심 질문 |
|---|------|----------|
| 1 | Agent Entry Point | AGENTS.md/CLAUDE.md가 명확한 진입점인가? |
| 2 | Map, Not Manual | 문서가 지도(map)인가, 매뉴얼인가? |
| 3 | Invariant Enforcement | 실수를 도구가 자동으로 잡는가? |
| 4 | Convention Over Configuration | 암묵적 규칙이 아닌 명시적 규칙이 있는가? |
| 5 | Progressive Disclosure | 정보가 필요할 때 찾을 수 있는가? |
| 6 | Layered Architecture | 의존성 방향이 명확한가? |
| 7 | Garbage Collection | stale 코드/문서를 주기적으로 정리하는가? |
| 8 | Observability | 에이전트가 자신의 작업 결과를 검증할 수 있는가? |
| 9 | Knowledge in Repo | 지식이 사람 머리가 아닌 레포에 있는가? |
| 10 | Reproducibility | 동일 입력 → 동일 결과가 보장되는가? |
| 11 | Modularity | 변경 영향 범위가 예측 가능한가? |
| 12 | Self-Documentation | 코드 자체가 의도를 설명하는가? |

> 상세 판단 기준 및 점수 체계: `references/principles.md`

---

## 성숙도 등급

| 등급 | 이름 | 종합 점수 | 특징 |
|------|------|----------|------|
| L1 | None | 0-19 | 에이전트 협업 고려 없음 |
| L2 | Basic | 20-39 | 최소한의 문서화 |
| L3 | Structured | 40-59 | 체계적 구조, 부분 자동화 |
| L4 | Optimized | 60-79 | 높은 자동화, 낮은 drift |
| L5 | Autonomous | 80-100 | 에이전트가 독립적으로 작업 가능 |

> 점수 계산 및 차원별 가중치: `references/maturity-framework.md`

---

## 워크플로우

1. **모드 결정**: 사용자 의도 → Setup / Audit / Maintenance
2. **대상 판별**: 코드베이스 / Skill / Self
3. **해당 워크플로우 실행**: `references/{mode}-workflow.md` 참조
4. **리포트 생성**: `references/report-template.md` 형식으로 출력

## 파일 의존성 구조

```
SKILL.md (진입점)
├── references/principles.md ─────────── 12원칙 정의 + 점수 기준
├── references/maturity-framework.md ─── 차원/등급 (← principles.md 참조)
├── references/codebase-checklist.md ─── 코드베이스 체크리스트
├── references/skill-checklist.md ────── Skill 체크리스트 + Self-Maintenance
├── references/setup-workflow.md ─────── Setup 워크플로우 (← report-template.md)
├── references/audit-workflow.md ─────── Audit 워크플로우 (← principles, maturity, checklists, report-template)
├── references/maintenance-workflow.md ─ Maintenance 워크플로우 (← report-template.md)
├── references/report-template.md ────── 리포트 출력 형식
├── examples/sample-agents-md.md ─────── 예시 (leaf)
├── examples/sample-report.md ────────── 예시 (leaf)
└── examples/sample-docs-structure.md ── 예시 (leaf)
```

**의존 방향**: SKILL.md → workflows → {principles, maturity, checklists, report-template}. examples는 leaf 노드(의존 없음). 순환 의존성 zero.

---

## References

| 파일 | 역할 |
|------|------|
| `references/principles.md` | 12원칙 상세 판단 기준 + 점수 체계 |
| `references/maturity-framework.md` | 5등급 성숙도 프레임워크 + 점수 계산 |
| `references/codebase-checklist.md` | 코드베이스 진단 체크리스트 (80+ 항목) |
| `references/skill-checklist.md` | Claude Code skill 진단 체크리스트 |
| `references/setup-workflow.md` | Setup 모드 상세 워크플로우 |
| `references/audit-workflow.md` | Audit 모드 상세 워크플로우 |
| `references/maintenance-workflow.md` | Maintenance 모드 상세 워크플로우 |
| `references/report-template.md` | 모드별 리포트 출력 템플릿 |

## Examples

| 파일 | 내용 |
|------|------|
| `examples/sample-agents-md.md` | 모범 AGENTS.md 예시 |
| `examples/sample-report.md` | Audit 리포트 예시 |
| `examples/sample-docs-structure.md` | 권장 docs/ 디렉토리 구조 |
