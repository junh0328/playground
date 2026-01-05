'use client';

import { useState } from 'react';
import useLocalStorageTodos from '@/hooks/useSyncExternalStore/useLocalStorageTodos';

export default function TodoListDemo() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearAll } =
    useLocalStorageTodos();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className='space-y-4'>
      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='할 일을 입력하세요'
          className='flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-500'
        />
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors'
        >
          추가
        </button>
      </form>

      {/* Todo 목록 */}
      <div className='space-y-2 max-h-48 overflow-y-auto'>
        {todos.length === 0 ? (
          <div className='text-zinc-500 text-sm text-center py-4'>
            아직 할 일이 없습니다
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className='flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg'
            >
              <input
                type='checkbox'
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className='w-4 h-4 accent-blue-500'
              />
              <span
                className={`flex-1 text-sm ${
                  todo.completed
                    ? 'text-zinc-500 line-through'
                    : 'text-zinc-200'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className='text-zinc-500 hover:text-red-400 text-sm'
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>

      {/* 하단 정보 */}
      {todos.length > 0 && (
        <div className='flex justify-between items-center text-xs text-zinc-500'>
          <span>총 {todos.length}개</span>
          <button
            onClick={clearAll}
            className='text-red-400 hover:text-red-300'
          >
            전체 삭제
          </button>
        </div>
      )}

      <p className='text-xs text-zinc-500'>
        다른 탭에서도 열어보세요. 실시간으로 동기화됩니다.
      </p>
    </div>
  );
}
