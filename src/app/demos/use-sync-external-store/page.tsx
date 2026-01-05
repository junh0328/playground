'use client';

import Link from 'next/link';
import DemoSection from '@/components/common/DemoSection';
import InteractiveExample from '@/components/common/InteractiveExample';
import TabSwitcher from '@/components/common/TabSwitcher';
import CodeBlock from '@/components/common/CodeBlock';
import {
  TodoListDemo,
  problemCode,
  beforeCode,
  afterCode,
  todoStoreCode,
  useTodosCode,
} from '@/components/useSyncExternalStore';

export default function UseSyncExternalStoreDemoPage() {
  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-100'>
      {/* 헤더 */}
      <header className='border-b border-zinc-800'>
        <div className='max-w-6xl mx-auto px-6 py-8'>
          <Link
            href='/'
            className='text-sm text-zinc-500 hover:text-zinc-300 mb-4 inline-block'
          >
            ← 홈으로
          </Link>
          <h1 className='text-3xl font-bold text-zinc-100'>
            useSyncExternalStore
          </h1>
          <p className='mt-2 text-zinc-400'>
            React 19 + Compiler 환경에서 외부 상태를 안전하게 동기화하는 방법
          </p>
        </div>
      </header>

      {/* 네비게이션 */}
      <nav className='sticky top-0 z-10 bg-zinc-950/80 backdrop-blur border-b border-zinc-800'>
        <div className='max-w-6xl mx-auto px-6'>
          <ul className='flex gap-6 text-sm py-3 overflow-x-auto'>
            <li>
              <a href='#why' className='text-zinc-400 hover:text-zinc-100'>
                문제 상황
              </a>
            </li>
            <li>
              <a
                href='#before-after'
                className='text-zinc-400 hover:text-zinc-100'
              >
                Before/After
              </a>
            </li>
            <li>
              <a
                href='#parameters'
                className='text-zinc-400 hover:text-zinc-100'
              >
                매개변수
              </a>
            </li>
            <li>
              <a href='#advanced' className='text-zinc-400 hover:text-zinc-100'>
                심화 예제
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className='max-w-6xl mx-auto px-6 py-12 space-y-16'>
        {/* 섹션 1: 문제 상황 */}
        <DemoSection
          id='why'
          title='문제 상황: 흔히 사용하던 isMount 패턴'
          description={
            <p>
              마운트 여부를 확인하기 위해 다음과 같은 코드를 작성해본 적이
              있으신가요?
            </p>
          }
        >
          <div className='space-y-6'>
            {/* 문제 코드 */}
            <CodeBlock code={problemCode} language='typescript' />

            {/* 경고 메시지 */}
            <div className='p-4 bg-red-900/20 border border-red-800/50 rounded-lg'>
              <div className='flex items-start gap-3'>
                <span className='text-red-400 text-xl'>⚠️</span>
                <div className='space-y-3'>
                  <p className='text-red-200 font-medium'>
                    React 19 + Compiler 환경에서 발생하는 경고
                  </p>
                  <div className='text-sm text-red-100/80 bg-red-900/30 p-3 rounded font-mono overflow-x-auto'>
                    <p className='font-bold'>
                      Error: Calling setState synchronously within an effect can
                      trigger cascading renders
                    </p>
                    <p className='mt-2'>
                      Effects are intended to synchronize state between React
                      and external systems. Calling setState synchronously
                      within an effect body causes cascading renders that can
                      hurt performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 경고 해석 */}
            <div className='p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg'>
              <div className='flex items-start gap-3'>
                <span className='text-yellow-400 text-xl'>💡</span>
                <div className='space-y-3'>
                  <p className='text-yellow-200 font-medium'>경고 메시지 해석</p>
                  <ol className='text-sm text-yellow-100/80 space-y-2 list-decimal list-inside'>
                    <li>
                      <strong className='text-yellow-200'>Effect의 목적</strong>:
                      Effect는 React와{' '}
                      <strong className='text-yellow-200'>외부 시스템</strong>
                      (DOM, 상태 관리 라이브러리, 플랫폼 API 등) 간의 동기화를
                      위한 것입니다.
                    </li>
                    <li>
                      <strong className='text-yellow-200'>
                        Effect 내에서 해야 할 것
                      </strong>
                      : 외부 시스템을 React의 최신 상태로 업데이트하거나, 외부
                      시스템의 변경을 구독하고{' '}
                      <strong className='text-yellow-200'>
                        콜백 함수 내에서
                      </strong>{' '}
                      setState를 호출
                    </li>
                    <li>
                      <strong className='text-yellow-200'>문제점</strong>: Effect
                      본문에서{' '}
                      <strong className='text-yellow-200'>
                        동기적으로 setState를 호출
                      </strong>
                      하면 연쇄 렌더링(cascading renders)이 발생하여 성능이
                      저하됩니다.
                    </li>
                  </ol>
                  <p className='text-sm text-yellow-100/80 mt-2'>
                    즉, <code className='text-yellow-400'>useEffect</code>{' '}
                    내에서{' '}
                    <code className='text-yellow-400'>setIsMounted(true)</code>를{' '}
                    <strong className='text-yellow-200'>직접 호출</strong>하는
                    것은 Effect의 올바른 사용법이 아닙니다!
                  </p>
                </div>
              </div>
            </div>

            {/* 해결책 */}
            <div className='p-4 bg-green-900/20 border border-green-800/50 rounded-lg'>
              <div className='flex items-start gap-3'>
                <span className='text-green-400 text-xl'>✅</span>
                <div>
                  <p className='text-green-200 font-medium'>
                    해결책: useSyncExternalStore
                  </p>
                  <p className='text-sm text-green-100/80 mt-1'>
                    React는 이런 상황을 위해{' '}
                    <code className='text-green-400'>useSyncExternalStore</code>{' '}
                    훅을 제공합니다. 이 훅은{' '}
                    <strong className='text-green-200'>
                      외부 상태를 React 렌더링 사이클과 안전하게 동기화
                    </strong>
                    합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DemoSection>

        {/* 섹션 2: Before/After */}
        <DemoSection
          id='before-after'
          title='Before / After'
          subtitle='코드 비교'
          description={
            <p>
              <code className='text-yellow-400'>useEffect</code> 방식과{' '}
              <code className='text-blue-400'>useSyncExternalStore</code> 방식을
              비교해보세요. 실행 결과는 동일하지만, 구현 방식이 다릅니다.
            </p>
          }
        >
          <TabSwitcher
            tabs={[
              {
                id: 'before',
                label: 'Before',
                badge: '비권장',
                content: (
                  <CodeBlock
                    code={beforeCode}
                    language='typescript'
                    title='useEffect 방식'
                  />
                ),
              },
              {
                id: 'after',
                label: 'After',
                badge: '권장',
                content: (
                  <div className='space-y-4'>
                    <CodeBlock
                      code={afterCode}
                      language='typescript'
                      title='useSyncExternalStore 방식'
                    />
                    {/* 동작 원리 설명 */}
                    <div className='rounded-lg border border-zinc-700 bg-zinc-800/50 p-4'>
                      <div className='flex items-center gap-2 mb-3'>
                        <span className='text-yellow-400'>💡</span>
                        <span className='text-sm font-medium text-zinc-300'>
                          동작 원리
                        </span>
                      </div>
                      <ol className='space-y-2'>
                        <li className='flex gap-3 text-sm'>
                          <span className='text-zinc-500 font-medium'>1.</span>
                          <div>
                            <span className='text-zinc-200 font-medium'>
                              subscribe:
                            </span>{' '}
                            <span className='text-zinc-400'>
                              외부 스토어 변경을 구독합니다. isMount는 변하지
                              않으므로 빈 함수를 반환합니다.
                            </span>
                          </div>
                        </li>
                        <li className='flex gap-3 text-sm'>
                          <span className='text-zinc-500 font-medium'>2.</span>
                          <div>
                            <span className='text-zinc-200 font-medium'>
                              getSnapshot:
                            </span>{' '}
                            <span className='text-zinc-400'>
                              클라이언트에서 현재 스냅샷을 반환합니다.
                              브라우저에서는 항상 true입니다.
                            </span>
                          </div>
                        </li>
                        <li className='flex gap-3 text-sm'>
                          <span className='text-zinc-500 font-medium'>3.</span>
                          <div>
                            <span className='text-zinc-200 font-medium'>
                              getServerSnapshot:
                            </span>{' '}
                            <span className='text-zinc-400'>
                              SSR에서 스냅샷을 반환합니다. 서버에서는 항상
                              false입니다.
                            </span>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                ),
              },
            ]}
            defaultTab='after'
          />
        </DemoSection>

        {/* 섹션 3: 매개변수 설명 */}
        <DemoSection
          id='parameters'
          title='3가지 매개변수 이해하기'
          description={
            <p>
              <code className='text-blue-400'>useSyncExternalStore</code>는 세
              가지 매개변수를 받습니다.
            </p>
          }
        >
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='p-4 bg-zinc-900 border border-zinc-800 rounded-lg'>
              <div className='text-blue-400 font-mono text-sm mb-2'>
                subscribe
              </div>
              <p className='text-sm text-zinc-400'>
                외부 스토어의 변경을 구독하는 함수입니다. 콜백을 받아 변경 시
                호출하고, cleanup 함수를 반환해야 합니다.
              </p>
            </div>
            <div className='p-4 bg-zinc-900 border border-zinc-800 rounded-lg'>
              <div className='text-green-400 font-mono text-sm mb-2'>
                getSnapshot
              </div>
              <p className='text-sm text-zinc-400'>
                현재 스토어 상태의 스냅샷을 반환합니다.{' '}
                <strong className='text-zinc-200'>
                  매번 같은 참조를 반환
                </strong>
                해야 무한 루프를 방지할 수 있습니다.
              </p>
            </div>
            <div className='p-4 bg-zinc-900 border border-zinc-800 rounded-lg'>
              <div className='text-purple-400 font-mono text-sm mb-2'>
                getServerSnapshot
              </div>
              <p className='text-sm text-zinc-400'>
                SSR에서 사용할 스냅샷을 반환합니다.{' '}
                <strong className='text-zinc-200'>
                  객체 반환 시 캐시 필수
                </strong>
                . Next.js 등 서버 렌더링 환경에서 hydration 불일치를 방지합니다.
              </p>
            </div>
          </div>
        </DemoSection>

        {/* 섹션 4: 심화 예제 - LocalStorage TodoList */}
        <DemoSection
          id='advanced'
          title='심화: LocalStorage TodoList'
          description={
            <p>
              로컬 스토리지와 동기화되는 TodoList입니다.{' '}
              <strong className='text-zinc-200'>
                다른 탭에서도 실시간 동기화
              </strong>
              됩니다.
            </p>
          }
        >
          <div className='space-y-6'>
            {/* 데이터 흐름 다이어그램 */}
            <div className='rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden'>
              <div className='px-4 py-2 border-b border-zinc-700 bg-zinc-800'>
                <span className='text-sm font-medium text-zinc-400'>
                  데이터 흐름 다이어그램
                </span>
              </div>
              <div className='p-4'>
                <img
                  src='/assets/todoList_diagram.png'
                  alt='TodoList 데이터 흐름 다이어그램'
                  className='w-full rounded'
                />
              </div>
            </div>

            {/* 스토어 코드 */}
            <InteractiveExample
              code={todoStoreCode}
              language='typescript'
              title='1. 외부 스토어 정의'
              resultTitle='TodoList'
            >
              <TodoListDemo />
            </InteractiveExample>

            {/* 훅 코드 */}
            <InteractiveExample
              code={useTodosCode}
              language='typescript'
              title='2. 커스텀 훅으로 감싸기'
              resultTitle='사용법'
              explanation={[
                {
                  title: 'storage 이벤트',
                  description:
                    '다른 탭에서 localStorage가 변경되면 storage 이벤트가 발생합니다.',
                },
                {
                  title: '실시간 동기화',
                  description:
                    'subscribe에서 storage 이벤트를 구독하여 모든 탭에서 상태가 동기화됩니다.',
                },
                {
                  title: '참조 동일성',
                  description:
                    'getSnapshot은 메모리에 캐시된 todos 배열을 반환하여 무한 루프를 방지합니다.',
                },
              ]}
            >
              <div className='text-sm text-zinc-400 space-y-2'>
                <p>
                  <code className='text-blue-400'>useLocalStorageTodos()</code>
                  를 호출하면 todos와 액션들을 반환받습니다.
                </p>
                <p>
                  새 탭을 열어 같은 페이지에 접속하면 실시간으로 동기화되는 것을
                  확인할 수 있습니다.
                </p>
              </div>
            </InteractiveExample>
          </div>
        </DemoSection>

        {/* 주의사항 */}
        <DemoSection
          id='gotchas'
          title='주의사항 (Gotchas)'
          description={<p>useSyncExternalStore 사용 시 주의할 점들입니다.</p>}
        >
          <div className='space-y-4'>
            <div className='p-4 bg-red-900/20 border border-red-800/50 rounded-lg'>
              <div className='flex items-start gap-3'>
                <span className='text-red-400'>❌</span>
                <div>
                  <p className='text-red-200 font-medium'>
                    getSnapshot에서 매번 새 객체 반환 금지
                  </p>
                  <p className='text-sm text-red-100/70 mt-1'>
                    매 렌더링마다 새 객체를 반환하면 무한 루프가 발생합니다.
                    반드시 캐시된 값을 반환하세요.
                  </p>
                </div>
              </div>
            </div>

            <div className='p-4 bg-green-900/20 border border-green-800/50 rounded-lg'>
              <div className='flex items-start gap-3'>
                <span className='text-green-400'>✅</span>
                <div>
                  <p className='text-green-200 font-medium'>
                    getServerSnapshot 반드시 제공 + 캐싱
                  </p>
                  <p className='text-sm text-green-100/70 mt-1'>
                    Next.js 등 SSR 환경에서는 세 번째 인자를 반드시 제공해야
                    hydration 에러를 방지할 수 있습니다.{' '}
                    <strong className='text-green-200'>
                      객체 반환 시 getSnapshot과 동일하게 캐시 필수
                    </strong>
                    (무한 루프 방지).
                  </p>
                </div>
              </div>
            </div>

            <div className='p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg'>
              <div className='flex items-start gap-3'>
                <span className='text-blue-400'>💡</span>
                <div>
                  <p className='text-blue-200 font-medium'>
                    subscribe의 cleanup 함수 반환
                  </p>
                  <p className='text-sm text-blue-100/70 mt-1'>
                    이벤트 리스너를 등록한 경우 반드시 cleanup 함수에서 제거해야
                    메모리 누수를 방지할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DemoSection>
      </main>

      {/* 푸터 */}
      <footer className='border-t border-zinc-800 py-8'>
        <div className='max-w-6xl mx-auto px-6 text-center text-sm text-zinc-500'>
          <p>React 19.2.3 + Next.js 16 + React Compiler</p>
        </div>
      </footer>
    </div>
  );
}
