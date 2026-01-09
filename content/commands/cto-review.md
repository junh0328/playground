# CTO 과제 평가

프론트엔드 채용 과제를 CTO 관점에서 평가합니다.

## 사용법

```
/cto-review [제한시간] [포지션]
```

**예시:**

- `/cto-review 2일 주니어`
- `/cto-review 7일 시니어`

---

## 평가 실행

**입력 파라미터**: $ARGUMENTS (예: "2일 주니어")

### 실행 절차

1. **스킬 문서 읽기**: `.claude/skills/cto-assignment-reviewer/SKILL.md` 파일을 읽어 평가 기준과 워크플로우를 확인하세요.

2. **참조 문서 확인**:

   - 상세 체크리스트: `.claude/skills/cto-assignment-reviewer/references/checklist.md`
   - 리포트 템플릿: `.claude/skills/cto-assignment-reviewer/references/report-template.md`
   - 면접 질문: `.claude/skills/cto-assignment-reviewer/references/interview-questions.md`

3. **현재 프로젝트 평가**: SKILL.md의 워크플로우에 따라 현재 디렉토리의 프로젝트를 평가하세요.

4. **리포트 생성**: report-template.md 형식에 맞춰 평가 리포트를 출력하세요.

### 주의사항

- 제한시간(2일/7일)에 따라 가중치가 다릅니다 (SKILL.md 참조)
- 포지션(주니어/미드/시니어)에 따라 기대 수준이 다릅니다
- Quick Check → 상세 평가 → 레드플래그 체크 → 리포트 순서로 진행하세요
