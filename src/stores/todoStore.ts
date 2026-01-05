/**
 * todoStore - 로컬 스토리지 기반 Todo 외부 스토어
 *
 * useSyncExternalStore와 함께 사용하기 위한 외부 스토어 패턴입니다.
 * 다른 탭에서 변경 시 storage 이벤트로 자동 동기화됩니다.
 */

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'playground-todos';

// 구독자(리스너) 목록
const listeners: Set<() => void> = new Set();

// 현재 todos 상태 (메모리 캐시)
let todos: Todo[] = [];

// 초기화 플래그
let isInitialized = false;

// SSR용 캐시된 빈 배열 (getServerSnapshot에서 매번 같은 참조 반환)
const emptyTodos: Todo[] = [];

/**
 * 로컬 스토리지에서 todos 로드
 */
function loadFromStorage(): Todo[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * 로컬 스토리지에 todos 저장 및 리스너 알림
 */
function saveToStorage(newTodos: Todo[]) {
  todos = newTodos;

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  // 모든 구독자에게 변경 알림
  emitChange();
}

/**
 * 모든 리스너에게 변경 알림
 */
function emitChange() {
  listeners.forEach((listener) => listener());
}

/**
 * 스토어 초기화 (클라이언트 사이드에서만)
 */
function initialize() {
  if (isInitialized || typeof window === 'undefined') return;

  todos = loadFromStorage();
  isInitialized = true;
}

export const todoStore = {
  /**
   * subscribe: 스토어 변경 구독
   * useSyncExternalStore의 첫 번째 인자로 사용
   */
  subscribe: (callback: () => void) => {
    // 초기화
    initialize();

    // 리스너 등록
    listeners.add(callback);

    // 다른 탭에서 localStorage 변경 시 동기화
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        todos = loadFromStorage();
        callback();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
    }

    // cleanup 함수 반환
    return () => {
      listeners.delete(callback);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
      }
    };
  },

  /**
   * getSnapshot: 현재 스냅샷 반환
   * useSyncExternalStore의 두 번째 인자로 사용
   *
   * 중요: 매번 같은 참조를 반환해야 무한 루프 방지
   */
  getSnapshot: (): Todo[] => {
    initialize();
    return todos;
  },

  /**
   * getServerSnapshot: SSR용 스냅샷 반환
   * useSyncExternalStore의 세 번째 인자로 사용
   *
   * 중요: 캐시된 빈 배열을 반환해야 무한 루프 방지
   */
  getServerSnapshot: (): Todo[] => {
    return emptyTodos;
  },

  // === 액션 메서드 ===

  /**
   * Todo 추가
   */
  addTodo: (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    saveToStorage([...todos, newTodo]);
  },

  /**
   * Todo 완료 상태 토글
   */
  toggleTodo: (id: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveToStorage(newTodos);
  },

  /**
   * Todo 삭제
   */
  deleteTodo: (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    saveToStorage(newTodos);
  },

  /**
   * 모든 Todo 삭제
   */
  clearAll: () => {
    saveToStorage([]);
  },

  /**
   * Todo 텍스트 수정
   */
  updateTodo: (id: string, text: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: text.trim() } : todo
    );
    saveToStorage(newTodos);
  },
};

export default todoStore;
