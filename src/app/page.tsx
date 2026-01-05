import Link from 'next/link';

// 데모 목록 타입 정의
interface Demo {
  id: string;
  title: string;
  description: string;
  path: string;
  tags: string[];
  status: 'stable' | 'beta' | 'experimental';
  isExternal?: boolean; // 외부 링크 여부
}

// 데모 목록 - 새 데모 추가 시 여기에 추가
const demos: Demo[] = [
  {
    id: 'use-sync-external-store',
    title: 'useSyncExternalStore',
    description:
      'React 19 + Compiler 환경에서 외부 상태를 안전하게 동기화하는 방법. isMount, LocalStorage TodoList 예제 포함.',
    path: '/demos/use-sync-external-store',
    tags: ['React 19', 'Hooks', 'SSR'],
    status: 'stable',
  },
  {
    id: 'tanstack-query',
    title: 'TanStack Query 전략',
    description:
      'CSR, SSR, Streaming 렌더링 전략 비교 및 TanStack Query 활용법. Prefetch, Hydration 예제 포함.',
    path: 'https://my-tanstack-query-strategy.vercel.app',
    tags: ['React', 'TanStack Query', 'Data Fetching'],
    status: 'stable',
    isExternal: true,
  },
  {
    id: 'restore-infinite-scroll',
    title: '무한 스크롤 복원',
    description:
      '뒤로가기 시 스크롤 위치와 데이터를 복원하는 무한 스크롤 구현. TanStack Query + Virtualization 활용.',
    path: 'https://my-restore-infinite-scroll.vercel.app',
    tags: ['React', 'Infinite Scroll', 'UX'],
    status: 'stable',
    isExternal: true,
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    description:
      'AI 에이전트 기반 애플리케이션 구현. LLM과 도구 사용을 통한 자율적 작업 수행.',
    path: 'https://my-agentic-ai-murex.vercel.app',
    tags: ['AI', 'LLM', 'Agent'],
    status: 'stable',
    isExternal: true,
  },
];

// 상태 뱃지 색상
const statusColors = {
  stable: 'bg-green-900/50 text-green-300 border-green-700',
  beta: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  experimental: 'bg-red-900/50 text-red-300 border-red-700',
};

export default function Home() {
  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-100'>
      {/* 헤더 */}
      <header className='border-b border-zinc-800'>
        <div className='max-w-6xl mx-auto px-6 py-12'>
          <h1 className='text-4xl font-bold text-zinc-100'>Playground</h1>
          <p className='mt-3 text-lg text-zinc-400'>준희의 끄적끄적 놀이터</p>
          <div className='mt-4 flex gap-4 text-sm'>
            <span className='text-zinc-500'>React 19.2.3 ~</span>
            <span className='text-zinc-600'>•</span>
            <span className='text-zinc-500'>Next.js 16 ~</span>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className='max-w-6xl mx-auto px-6 py-12'>
        <h2 className='text-xl font-semibold text-zinc-200 mb-6'>데모 목록</h2>

        {/* 데모 카드 그리드 */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {demos.map((demo) => {
            const CardContent = (
              <>
                {/* 상단: 제목 + 상태 + 외부 링크 아이콘 */}
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors'>
                      {demo.title}
                    </h3>
                    {demo.isExternal && (
                      <svg
                        className='w-4 h-4 text-zinc-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${
                      statusColors[demo.status]
                    }`}
                  >
                    {demo.status}
                  </span>
                </div>

                {/* 설명 */}
                <p className='mt-3 text-sm text-zinc-400 line-clamp-3'>
                  {demo.description}
                </p>

                {/* 태그 */}
                <div className='mt-4 flex flex-wrap gap-2'>
                  {demo.tags.map((tag) => (
                    <span
                      key={tag}
                      className='text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded'
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 화살표 */}
                <div className='mt-4 text-sm text-zinc-500 group-hover:text-blue-400 transition-colors'>
                  {demo.isExternal ? '외부 링크로 이동 ↗' : '자세히 보기 →'}
                </div>
              </>
            );

            const cardClassName =
              'group block p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all';

            // 외부 링크는 <a> 태그, 내부 링크는 <Link> 사용
            return demo.isExternal ? (
              <a
                key={demo.id}
                href={demo.path}
                target='_blank'
                rel='noopener noreferrer'
                className={cardClassName}
              >
                {CardContent}
              </a>
            ) : (
              <Link key={demo.id} href={demo.path} className={cardClassName}>
                {CardContent}
              </Link>
            );
          })}

          {/* 빈 카드 - 새 데모 추가 유도 */}
          <div className='p-6 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center min-h-[200px]'>
            <div className='text-zinc-600 text-4xl mb-3'>+</div>
            <p className='text-sm text-zinc-500'>
              새 데모를 추가하려면
              <br />
              <code className='text-zinc-400'>page.tsx</code>의 demos 배열에
              추가
            </p>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className='border-t border-zinc-800 mt-12'>
        <div className='max-w-6xl mx-auto px-6 py-8 text-center text-sm text-zinc-500'>
          <p>기술 블로그 작성을 위한 인터랙티브 데모 플레이그라운드</p>
        </div>
      </footer>
    </div>
  );
}
