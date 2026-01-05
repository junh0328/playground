'use client';

import { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/vs2015.css';

// 필요한 언어만 등록 (번들 최적화)
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('jsx', javascript);

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  highlight?: number[];
}

export default function CodeBlock({
  code,
  language = 'typescript',
  title,
  highlight = [],
}: CodeBlockProps) {
  const highlightedLines = useMemo(() => {
    // highlight.js로 코드 하이라이팅
    const highlighted = hljs.highlight(code, {
      language:
        language === 'tsx'
          ? 'typescript'
          : language === 'jsx'
          ? 'javascript'
          : language,
    });

    // HTML 문자열을 라인별로 분리
    // 하이라이팅된 HTML에서 라인을 추출하기 위해 임시 처리
    const htmlLines = highlighted.value.split('\n');

    return htmlLines;
  }, [code, language]);

  return (
    <div className='rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800'>
      {title && (
        <div className='bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800'>
          {title}
        </div>
      )}
      <pre className='bg-[#1e1e1e] p-4 overflow-x-auto text-sm'>
        <code className={`language-${language}`}>
          {highlightedLines.map((lineHtml, index) => (
            <div
              key={index}
              className={`${
                highlight.includes(index + 1)
                  ? 'bg-yellow-900/30 -mx-4 px-4'
                  : ''
              }`}
            >
              <span className='inline-block w-8 text-zinc-500 select-none text-right mr-4'>
                {index + 1}
              </span>
              <span
                dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }}
              />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
