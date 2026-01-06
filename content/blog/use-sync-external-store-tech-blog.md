# 목차

1.  들어가며
2.  useEffect 기반 isMount 패턴의 문제점
3.  useSyncExternalStore 소개
4.  Before/After: 코드 비교
5.  기본 예제: isMounted 구현
6.  3가지 매개변수 완전 정복
7.  주의사항과 모범 사례
8.  심화: 로컬 스토리지 연동 TodoList
9.  마무리

## 들어가며

React 19와 함께 등장한 **React Compiler**는 자동 메모이제이션을 제공하며 개발자의 부담을 줄여줍니다. 하지만 이로 인해 기존의 일부 패턴이 예상대로 동작하지 않을 수 있습니다.

특히 `useEffect`를 활용한 **isMount 패턴**이 비권장되면서, React 공식 문서에서는 `useSyncExternalStore`를 권장하고 있습니다.

이 글에서는 `useSyncExternalStore`가 무엇인지, 왜 필요한지, 그리고 실제로 어떻게 활용하는지 알아보겠습니다.

## useEffect 문제점

### 문제 상황: 흔히 사용하던 isMount 패턴

마운트 여부를 확인하기 위해 다음과 같은 코드를 작성해본 적이 있으신가요?

```
import { useState, useEffect } from 'react';

const Playground = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  return <div>{isMounted ? '마운트 됨' : '마운트 되기 전'}</div>;
};
```

React 19 + React Compiler 환경에서 이 코드를 실행하면 다음과 같은 **경고 메시지**가 나타납니다:

### 경고 메시지

> Error: Calling setState synchronously within an effect can trigger cascading renders
>
> Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
>
> - Update external systems with the latest state from React.
> - Subscribe for updates from some external system, calling setState in a callback function when external state changes.
>
> Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended.

### 경고 메시지 해석

이 메시지는 다음을 말하고 있습니다:

1.  **Effect의 목적**: Effect는 React와 **외부 시스템**(DOM, 상태 관리 라이브러리, 플랫폼 API 등) 간의 동기화를 위한 것입니다.
2.  **Effect 내에서 해야 할 것**:
    - 외부 시스템을 React의 최신 상태로 업데이트하거나
    - 외부 시스템의 변경을 구독하고, **콜백 함수 내에서** setState를 호출
3.  **문제점**: Effect 본문에서 **동기적으로 setState를 호출**하면 연쇄 렌더링(cascading renders)이 발생하여 성능이 저하됩니다.

즉, `useEffect` 내에서 `setIsMounted(true)`를 **직접 호출**하는 것은 Effect의 올바른 사용법이 아닙니다!

### 왜 문제인가?

#### 외부 시스템이란?

먼저 "외부 시스템"이 무엇인지 이해해야 합니다. React 관점에서 **외부 시스템**이란 **React가 관리하지 않는 모든 것**입니다:

| React가 관리 | 외부 시스템 |
|-------------|-----------|
| `useState`, `useReducer` | 브라우저 API (DOM, localStorage, navigator) |
| props, Context | 네트워크 (fetch, WebSocket) |
| 컴포넌트 트리 | 타이머 (setTimeout, setInterval) |
| 렌더링 사이클 | 브라우저 이벤트 (scroll, resize, online/offline) |

핵심 구분법: **"이 값이 React의 렌더링 사이클과 독립적으로 변할 수 있는가?"**
- Yes → 외부 시스템
- No → React 내부 상태

#### Effect 내에서 setState가 적절한 경우 vs 부적절한 경우

```typescript
// ✅ 콜백 내에서 setState (올바름) - 외부 이벤트에 반응
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);

  window.addEventListener('resize', handleResize);  // 외부 시스템 구독
  return () => window.removeEventListener('resize', handleResize);
}, []);

// ❌ 본문에서 직접 setState (문제) - Effect 실행과 동시에 호출
useEffect(() => {
  setIsMounted(true);  // 이벤트 없이 바로 호출
}, []);
```

**차이점:**
- 콜백 내: 외부 이벤트에 **반응**하여 상태 변경
- 본문 내: Effect 실행과 **동시에** 상태 변경 → 즉시 리렌더링 유발

#### 연쇄 렌더링 (Cascading Renders)

Effect 본문에서 직접 setState를 호출하면 다음과 같은 연쇄 렌더링이 발생합니다:

```
[1] 첫 번째 렌더링: isMounted = false
        ↓
[2] DOM에 커밋
        ↓
[3] useEffect 실행: setIsMounted(true) ← 상태 변경!
        ↓
[4] 두 번째 렌더링: isMounted = true (불필요한 추가 렌더링)
        ↓
[5] DOM 다시 커밋

→ 사용자는 false → true 전환을 볼 수 있음 (깜빡임)
```

#### 그래서 isMounted는 외부 시스템인가?

`isMounted`는 사실 **"클라이언트 환경인가?"**를 묻는 것이고, 이는 `typeof window !== 'undefined'`와 본질적으로 같습니다.

이것은 **React 외부의 런타임 환경 정보**이므로 외부 시스템입니다. React가 관리하는 상태가 아니라, 실행 환경이 서버인지 브라우저인지에 대한 정보입니다.

#### 기타 문제점

**1\. Strict Mode에서 두 번 실행**

React 18부터 Strict Mode에서 컴포넌트가 두 번 마운트됩니다. 이로 인해 `useEffect`가 예상치 못하게 두 번 실행될 수 있습니다.

**2\. React Compiler 최적화와 충돌**

React Compiler는 자동으로 컴포넌트를 최적화합니다. `useEffect` 내에서 상태를 변경하는 패턴은 이 최적화와 충돌할 수 있습니다.

**3\. SSR/Hydration 불일치**

서버에서는 `useEffect`가 실행되지 않으므로, 서버와 클라이언트의 렌더링 결과가 달라 hydration 에러가 발생할 수 있습니다.

### 해결책: useSyncExternalStore

React는 이런 상황을 위해 `useSyncExternalStore` 훅을 제공합니다. 이 훅은 **외부 상태를 React 렌더링 사이클과 안전하게 동기화**합니다.

## useSyncExternalStore 소개

`useSyncExternalStore`는 React 18에서 도입된 훅으로, **외부 스토어를 React 렌더링 사이클과 안전하게 동기화**합니다.

```
const snapshot = useSyncExternalStore(
  subscribe,        // 스토어 구독 함수
  getSnapshot,      // 현재 스냅샷 반환
  getServerSnapshot // SSR용 스냅샷 (선택)
);
```

### 주요 특징

- **Concurrent Mode 안전**: Tearing(찢어짐) 현상 방지
- **SSR 지원**: 서버 렌더링 시 별도 스냅샷 제공 가능
- **React Compiler 호환**: 최적화와 충돌 없음

## Before/After

### Before: useEffect 방식 (비권장)

```
function useIsMountBad() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
```

### After: useSyncExternalStore 방식 (권장)

```
import { useSyncExternalStore } from 'react';

// 빈 구독 함수 (상태 변화 없음)
const subscribe = () => () => {};

// 클라이언트: 항상 true
const getSnapshot = () => true;

// SSR: 항상 false
const getServerSnapshot = () => false;

function useIsMount() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}

// 사용 예시
function MyComponent() {
  const isMounted = useIsMount();
  return <div>{isMounted ? '마운트 됨' : '마운트 되기 전'}</div>;
}
```

## 매개변수

`useSyncExternalStore`는 세 가지 매개변수를 받습니다.

### 1\. subscribe (필수)

외부 스토어의 변경을 구독하는 함수입니다.

```
const subscribe = (callback: () => void) => {
  // 이벤트 리스너 등록
  window.addEventListener('storage', callback);

  // cleanup 함수 반환
  return () => {
    window.removeEventListener('storage', callback);
  };
};
```

**핵심 포인트:**

- `callback`은 스토어가 변경될 때 호출해야 합니다
- cleanup 함수를 반환해야 메모리 누수를 방지할 수 있습니다

### 2\. getSnapshot (필수)

현재 스토어 상태의 스냅샷을 반환합니다.

```
const getSnapshot = () => store.getState();
```

**핵심 포인트:**

- **매번 같은 참조를 반환**해야 무한 루프를 방지할 수 있습니다
- 객체를 반환할 경우 메모리에 캐시하여 동일 참조 유지

### 3\. getServerSnapshot (선택, SSR 시 필수)

SSR에서 사용할 스냅샷을 반환합니다.

```
// 원시값은 그대로 반환 가능
const getServerSnapshot = () => true; // SSR 기본값

// 객체를 반환할 경우 반드시 캐시!
const serverSnapshot = { count: 0 }; // 모듈 레벨에서 캐시
const getServerSnapshot = () => serverSnapshot;
```

**핵심 포인트:**

- Next.js 등 서버 렌더링 환경에서 필수
- 서버와 클라이언트 초기값이 다를 경우 hydration 불일치 발생 가능
- **getSnapshot과 동일하게 객체 반환 시 캐시 필수** (무한 루프 방지)

## 주의사항

### 1\. getSnapshot에서 매번 새 객체 반환 금지

```
// BAD: 무한 루프 발생!
const getSnapshot = () => ({ count: store.count });

// GOOD: 캐시된 객체 반환
let cachedSnapshot = { count: 0 };
const getSnapshot = () => {
  const newCount = store.count;
  if (cachedSnapshot.count !== newCount) {
    cachedSnapshot = { count: newCount };
  }
  return cachedSnapshot;
};
```

### 2\. getServerSnapshot 반드시 제공 + 캐싱

Next.js 등 SSR 환경에서는 세 번째 인자를 반드시 제공해야 합니다.

```
// BAD: SSR에서 에러 발생
const value = useSyncExternalStore(subscribe, getSnapshot);

// GOOD: SSR 대응
const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

**getServerSnapshot도 캐싱이 필요합니다:**

```
// BAD: 객체를 매번 새로 생성 -> 무한 루프!
const getServerSnapshot = () => ({ items: [] });

// GOOD: 캐시된 객체 반환
const emptyArray: Item[] = []; // 모듈 레벨에서 캐시
const getServerSnapshot = () => emptyArray;
```

### 3\. subscribe의 cleanup 함수 반환

이벤트 리스너를 등록한 경우 반드시 cleanup 함수에서 제거해야 합니다.

```
const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback);

  // cleanup 필수!
  return () => window.removeEventListener('resize', callback);
};
```

## 심화 예제

로컬 스토리지와 연동되는 TodoList를 만들어 봅시다. **다른 탭에서도 실시간 동기화**됩니다.

### 데이터 흐름

아래 다이어그램은 사용자가 할 일을 추가할 때의 전체 데이터 흐름을 보여줍니다:

![TodoList 데이터 흐름 다이어그램](/content/assets/todoList_diagram.png)

### 1\. 외부 스토어 정의

```
// stores/todoStore.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'playground-todos';
let listeners: Set<() => void> = new Set();
let todos: Todo[] = [];

function loadFromStorage(): Todo[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveToStorage(newTodos: Todo[]) {
  todos = newTodos;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  listeners.forEach(listener => listener());
}

export const todoStore = {
  subscribe: (callback: () => void) => {
    listeners.add(callback);

    // 다른 탭에서 변경 시 동기화
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        todos = loadFromStorage();
        callback();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      listeners.delete(callback);
      window.removeEventListener('storage', handleStorage);
    };
  },

  getSnapshot: () => todos,
  getServerSnapshot: () => [],

  addTodo: (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    saveToStorage([...todos, newTodo]);
  },

  toggleTodo: (id: string) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveToStorage(newTodos);
  },

  deleteTodo: (id: string) => {
    saveToStorage(todos.filter(todo => todo.id !== id));
  },
};
```

### 2\. 커스텀 훅 생성

```
// hooks/useLocalStorageTodos.ts
import { useSyncExternalStore } from 'react';
import { todoStore } from '@/stores/todoStore';

export function useLocalStorageTodos() {
  const todos = useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapshot,
    todoStore.getServerSnapshot
  );

  return {
    todos,
    addTodo: todoStore.addTodo,
    toggleTodo: todoStore.toggleTodo,
    deleteTodo: todoStore.deleteTodo,
  };
}
```

### 3\. 컴포넌트에서 사용

```
function TodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useLocalStorageTodos();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button type="submit">추가</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 핵심 포인트

1.  **storage 이벤트**: 다른 탭에서 localStorage가 변경되면 `storage` 이벤트가 발생합니다.
2.  **실시간 동기화**: subscribe에서 storage 이벤트를 구독하여 모든 탭에서 상태가 동기화됩니다.
3.  **참조 동일성**: getSnapshot은 메모리에 캐시된 todos 배열을 반환하여 무한 루프를 방지합니다.

## 마무리

`useSyncExternalStore`는 React 18에서 도입되었지만, React 19와 React Compiler 시대에 더욱 중요해졌습니다.

### 언제 사용해야 할까?

- 브라우저 API 구독 (online/offline, resize, media query 등)
- 외부 상태 관리 라이브러리 연동
- localStorage/sessionStorage 동기화
- WebSocket 등 실시간 데이터 구독

### 핵심 기억 사항

1.  **subscribe**: 구독과 cleanup을 담당
2.  **getSnapshot**: 동일 참조 유지 필수
3.  **getServerSnapshot**: SSR 환경에서 필수

React Compiler와 함께 더 안전하고 최적화된 코드를 작성해 보세요!

## 참고 자료

- [React 공식 문서 - useSyncExternalStore](https://ko.react.dev/reference/react/useSyncExternalStore)
- [React 18 Working Group - useSyncExternalStore](https://github.com/reactwg/react-18/discussions/86)
- [React Compiler 소개](https://react.dev/learn/react-compiler)
