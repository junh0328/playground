'use client';

import CodeBlock from './CodeBlock';
import ConsoleLog, { LogEntry } from './ConsoleLog';

interface ExplanationItem {
  title: string;
  description: string;
}

interface InteractiveExampleProps {
  code: string;
  language?: string;
  title?: string;
  highlight?: number[];
  children: React.ReactNode;
  description?: string;
  showConsole?: boolean;
  logs?: LogEntry[];
  onClearLogs?: () => void;
  explanation?: ExplanationItem[];
  resultTitle?: string;
}

export default function InteractiveExample({
  code,
  language = 'typescript',
  title,
  highlight,
  children,
  description,
  showConsole = false,
  logs = [],
  onClearLogs,
  explanation,
  resultTitle = '실행 결과',
}: InteractiveExampleProps) {
  return (
    <div className='space-y-4'>
      {/* 제목 + 설명 */}
      {(title || description) && (
        <div className='space-y-2'>
          {title && (
            <h3 className='text-lg font-semibold text-zinc-100'>{title}</h3>
          )}
          {description && (
            <p className='text-sm text-zinc-400'>{description}</p>
          )}
        </div>
      )}

      {/* 코드 + 뷰 분할 영역 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* 왼쪽: 코드 블록 */}
        <div className='min-w-0'>
          <CodeBlock
            code={code}
            language={language}
            title={title ? `${title} 코드` : undefined}
            highlight={highlight}
          />
        </div>

        {/* 오른쪽: 실행 결과 */}
        <div className='min-w-0'>
          <div className='rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden h-full'>
            {/* 결과 헤더 */}
            <div className='px-4 py-2 border-b border-zinc-700 bg-zinc-800'>
              <span className='text-sm font-medium text-zinc-400'>
                {resultTitle}
              </span>
            </div>

            {/* 결과 컨텐츠 */}
            <div className='p-4'>{children}</div>
          </div>
        </div>
      </div>

      {/* 콘솔 로그 (선택적) */}
      {showConsole && <ConsoleLog logs={logs} onClear={onClearLogs} />}

      {/* 동작 원리 설명 (선택적) */}
      {explanation && explanation.length > 0 && (
        <div className='rounded-lg border border-zinc-700 bg-zinc-800/50 p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-yellow-400'>💡</span>
            <span className='text-sm font-medium text-zinc-300'>동작 원리</span>
          </div>
          <ol className='space-y-2'>
            {explanation.map((item, index) => (
              <li key={index} className='flex gap-3 text-sm'>
                <span className='text-zinc-500 font-medium'>{index + 1}.</span>
                <div>
                  <span className='text-zinc-200 font-medium'>
                    {item.title}:
                  </span>{' '}
                  <span className='text-zinc-400'>{item.description}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
