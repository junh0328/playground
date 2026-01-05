'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  data?: unknown;
}

interface ConsoleLogProps {
  logs: LogEntry[];
  maxHeight?: number;
  onClear?: () => void;
}

const typeColors = {
  log: 'text-zinc-300',
  info: 'text-blue-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
};

const typeBgColors = {
  log: 'bg-transparent',
  info: 'bg-blue-900/20',
  warn: 'bg-yellow-900/20',
  error: 'bg-red-900/20',
};

export default function ConsoleLog({
  logs,
  maxHeight = 200,
  onClear,
}: ConsoleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 새 로그 추가 시 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  const formatData = (data: unknown): string => {
    if (data === undefined) return '';
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className='rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden'>
      {/* 헤더 */}
      <div className='flex items-center justify-between px-3 py-2 border-b border-zinc-700 bg-zinc-800'>
        <span className='text-xs font-medium text-zinc-400'>Console</span>
        {onClear && (
          <button
            onClick={onClear}
            className='text-xs text-zinc-500 hover:text-zinc-300 transition-colors'
          >
            Clear
          </button>
        )}
      </div>

      {/* 로그 영역 */}
      <div
        ref={scrollRef}
        className='overflow-y-auto p-2 font-mono text-xs'
        style={{ maxHeight }}
      >
        {logs.length === 0 ? (
          <div className='text-zinc-600 italic py-2 text-center'>
            No logs yet
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`flex gap-2 py-1 px-2 rounded ${typeBgColors[log.type]}`}
            >
              {/* 타임스탬프 */}
              <span className='text-zinc-500 shrink-0'>
                {formatTime(log.timestamp)}
              </span>

              {/* 타입 뱃지 */}
              <span
                className={`shrink-0 uppercase text-[10px] font-semibold ${typeColors[log.type]}`}
              >
                [{log.type}]
              </span>

              {/* 메시지 */}
              <span className={typeColors[log.type]}>{log.message}</span>

              {/* 데이터 */}
              {log.data !== undefined && (
                <pre className='text-zinc-400 whitespace-pre-wrap break-all'>
                  {formatData(log.data)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// useConsoleLog 훅 - 로그 상태 관리
export function useConsoleLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const createLog = useCallback(
    (type: LogEntry['type'], message: string, data?: unknown) => {
      const entry: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type,
        message,
        data,
      };
      setLogs((prev) => [...prev, entry]);
    },
    []
  );

  const log = useCallback(
    (message: string, data?: unknown) => createLog('log', message, data),
    [createLog]
  );

  const info = useCallback(
    (message: string, data?: unknown) => createLog('info', message, data),
    [createLog]
  );

  const warn = useCallback(
    (message: string, data?: unknown) => createLog('warn', message, data),
    [createLog]
  );

  const error = useCallback(
    (message: string, data?: unknown) => createLog('error', message, data),
    [createLog]
  );

  const clear = useCallback(() => setLogs([]), []);

  return { logs, log, info, warn, error, clear };
}
