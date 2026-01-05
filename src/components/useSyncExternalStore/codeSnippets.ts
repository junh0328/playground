export const problemCode = `// 흔히 사용하던 isMount 패턴
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
};`;

export const beforeCode = `// BAD: useEffect 기반 isMount (비권장)
function useIsMountBad() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

// 문제점:
// 1. Strict Mode에서 두 번 실행
// 2. React Compiler 최적화와 충돌 가능
// 3. SSR hydration 불일치`;

export const afterCode = `// GOOD: useSyncExternalStore 사용 (권장)
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
}`;

export const todoStoreCode = `// stores/todoStore.ts
const STORAGE_KEY = 'playground-todos';
let listeners = new Set<() => void>();
let todos: Todo[] = [];

export const todoStore = {
  // 구독: localStorage + storage 이벤트
  subscribe: (callback: () => void) => {
    listeners.add(callback);

    // 다른 탭 동기화
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

  // 액션들
  addTodo: (text: string) => { /* ... */ },
  toggleTodo: (id: string) => { /* ... */ },
  deleteTodo: (id: string) => { /* ... */ },
};`;

export const useTodosCode = `// hooks/useLocalStorageTodos.ts
import { useSyncExternalStore } from 'react';
import { todoStore } from '@/stores/todoStore';

function useLocalStorageTodos() {
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
}`;
