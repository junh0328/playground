import { useSyncExternalStore } from 'react';

/**
 * useIsMount - useSyncExternalStore를 활용한 마운트 상태 확인 훅
 *
 * React 19 Compiler 환경에서 useEffect 기반 isMount 패턴 대신
 * 권장되는 방식입니다.
 *
 * @returns {boolean} 클라이언트에서 true, SSR에서 false
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMounted = useIsMount();
 *
 *   if (!isMounted) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return <div>Client-side content</div>;
 * }
 * ```
 */

// subscribe: 외부 스토어 구독 함수
// 마운트 상태는 변하지 않으므로 빈 구독 함수 반환
const subscribe = () => {
  // cleanup 함수 반환 (아무것도 안 함)
  return () => {};
};

// getSnapshot: 클라이언트에서 현재 상태 반환
// 브라우저에서는 항상 true (마운트됨)
const getSnapshot = () => true;

// getServerSnapshot: SSR에서 상태 반환
// 서버에서는 항상 false (아직 마운트 안 됨)
const getServerSnapshot = () => false;

export function useIsMount(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// 기본 내보내기
export default useIsMount;
