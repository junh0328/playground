import { useSyncExternalStore } from 'react';
import { todoStore, Todo } from '@/stores/todoStore';

/**
 * useLocalStorageTodos - 로컬 스토리지 기반 Todo 관리 훅
 *
 * useSyncExternalStore를 활용하여 로컬 스토리지와 React 상태를
 * 안전하게 동기화합니다. 다른 탭에서 변경 시 자동으로 동기화됩니다.
 *
 * @returns {Object} todos 배열과 CRUD 액션들
 *
 * @example
 * ```tsx
 * function TodoApp() {
 *   const { todos, addTodo, toggleTodo, deleteTodo } = useLocalStorageTodos();
 *
 *   return (
 *     <div>
 *       <button onClick={() => addTodo('새 할일')}>추가</button>
 *       {todos.map(todo => (
 *         <div key={todo.id}>
 *           <input
 *             type="checkbox"
 *             checked={todo.completed}
 *             onChange={() => toggleTodo(todo.id)}
 *           />
 *           {todo.text}
 *           <button onClick={() => deleteTodo(todo.id)}>삭제</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
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
    updateTodo: todoStore.updateTodo,
    clearAll: todoStore.clearAll,
  };
}

// 타입 재내보내기
export type { Todo };

// 기본 내보내기
export default useLocalStorageTodos;
