# 티스토리 코드 블록 작성 가이드

티스토리에서 코드를 효과적으로 표시하기 위한 가이드입니다.

---

## 티스토리 에디터 유형

### 1. 새 에디터 (권장)
- 마크다운 공식 지원
- 코드 블록 기능 내장
- ``` 문법 사용 가능

### 2. 기본 에디터
- HTML 모드로 작성 필요
- `<pre><code>` 태그 사용
- Syntax Highlight 플러그인 필요

---

## 마크다운 코드 블록 (새 에디터)

### 기본 문법

````markdown
```언어명
코드 내용
```
````

### 지원 언어 목록

| 언어 | 식별자 | 예시 |
|------|--------|------|
| JavaScript | `javascript` 또는 `js` | ```javascript |
| TypeScript | `typescript` 또는 `ts` | ```typescript |
| Python | `python` 또는 `py` | ```python |
| HTML | `html` | ```html |
| CSS | `css` | ```css |
| SCSS/SASS | `scss` | ```scss |
| JSON | `json` | ```json |
| YAML | `yaml` 또는 `yml` | ```yaml |
| Bash/Shell | `bash` 또는 `shell` | ```bash |
| SQL | `sql` | ```sql |
| Go | `go` | ```go |
| Rust | `rust` | ```rust |
| Java | `java` | ```java |
| Kotlin | `kotlin` | ```kotlin |
| Swift | `swift` | ```swift |
| C | `c` | ```c |
| C++ | `cpp` 또는 `c++` | ```cpp |
| C# | `csharp` 또는 `cs` | ```csharp |
| PHP | `php` | ```php |
| Ruby | `ruby` | ```ruby |
| Dockerfile | `dockerfile` | ```dockerfile |
| Markdown | `markdown` 또는 `md` | ```markdown |
| Plain text | `text` 또는 `plaintext` | ```text |

---

## 인라인 코드

변수명, 함수명, 짧은 코드는 인라인으로:

```markdown
`useState` 훅을 사용하여 상태를 관리합니다.
```

결과: `useState` 훅을 사용하여 상태를 관리합니다.

---

## HTML 모드 코드 블록 (기본 에디터)

마크다운이 지원되지 않는 경우:

```html
<pre><code class="language-javascript">
function hello() {
  console.log('Hello, World!');
}
</code></pre>
```

### Syntax Highlighting 설정

#### 방법 1: 티스토리 플러그인
1. 티스토리 관리자 > 플러그인
2. "Syntax Highlight" 검색
3. 활성화

#### 방법 2: highlight.js 직접 적용
HTML 편집에서 `</head>` 위에 추가:

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>hljs.highlightAll();</script>
```

### 인기 테마 목록
| 테마명 | 스타일 |
|--------|--------|
| github | 밝은 테마, GitHub 스타일 |
| github-dark | 어두운 테마, GitHub 스타일 |
| monokai | 어두운 테마, 인기 에디터 스타일 |
| atom-one-dark | 어두운 테마, Atom 스타일 |
| vs2015 | 어두운 테마, Visual Studio 스타일 |
| androidstudio | 어두운 테마, Android Studio 스타일 |

---

## 코드 블록 작성 팁

### 1. 실행 결과 표시

````markdown
```javascript
console.log('Hello, World!');
```

**실행 결과:**
```
Hello, World!
```
````

### 2. 코드 변경 강조 (diff)

````markdown
```diff
- const oldValue = 'old';
+ const newValue = 'new';
```
````

### 3. 파일명 표시

````markdown
`src/components/Button.tsx`
```typescript
export const Button = () => {
  return <button>Click me</button>;
};
```
````

### 4. 터미널 명령어

````markdown
```bash
# 패키지 설치
npm install axios

# 개발 서버 실행
npm run dev
```
````

### 5. 긴 코드 처리

긴 코드는 핵심 부분만 표시하고 전체 코드 링크 제공:

````markdown
```javascript
// ... 생략 ...

// 핵심 로직
function processData(data) {
  return data.map(item => item.value * 2);
}

// ... 생략 ...
```

> **팁**: 전체 코드는 [GitHub](링크)에서 확인할 수 있습니다.
````

---

## 코드 설명 패턴

### 패턴 1: 코드 후 설명

````markdown
```javascript
const [count, setCount] = useState(0);
```

- `count`: 현재 상태 값
- `setCount`: 상태를 업데이트하는 함수
- `0`: 초기값
````

### 패턴 2: 주석으로 설명

````markdown
```javascript
// 1. 상태 선언
const [count, setCount] = useState(0);

// 2. 이벤트 핸들러
const handleClick = () => {
  setCount(prev => prev + 1); // 이전 값 기반으로 업데이트
};

// 3. UI 렌더링
return <button onClick={handleClick}>{count}</button>;
```
````

### 패턴 3: 단계별 설명

````markdown
### 1단계: 상태 선언

```javascript
const [count, setCount] = useState(0);
```

`useState`는 React의 상태 관리 훅입니다. 배열 구조 분해를 통해 상태 값과 setter 함수를 받습니다.

### 2단계: 이벤트 핸들러 작성

```javascript
const handleClick = () => {
  setCount(prev => prev + 1);
};
```

콜백 형태로 이전 상태(`prev`)를 받아 새 값을 계산합니다.
````

---

## 프레임워크별 코드 블록 예시

### React (JSX/TSX)

````markdown
```tsx
import { useState } from 'react';

interface Props {
  initialCount: number;
}

export const Counter = ({ initialCount }: Props) => {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
};
```
````

### Vue

````markdown
```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const increment = () => count.value++;
</script>
```
````

### Docker

````markdown
```dockerfile
# Node.js 베이스 이미지
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 앱 실행
CMD ["node", "server.js"]
```
````

### Kubernetes YAML

````markdown
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:latest
          ports:
            - containerPort: 3000
```
````

### GitHub Actions

````markdown
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build
```
````

---

## 체크리스트

코드 블록 작성 시 확인사항:

- [ ] 언어 식별자가 올바른가?
- [ ] 코드가 문법적으로 올바른가?
- [ ] 불필요한 코드는 제거했는가?
- [ ] 핵심 부분에 주석이 있는가?
- [ ] 실행 결과가 필요한 경우 포함했는가?
- [ ] 들여쓰기가 일관적인가?
