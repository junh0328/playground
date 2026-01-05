'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  badge?: string;
  content: React.ReactNode;
}

interface TabSwitcherProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function TabSwitcher({ tabs, defaultTab }: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className='space-y-4'>
      {/* 탭 버튼들 */}
      <div className='flex gap-1 p-1 bg-zinc-800 rounded-lg w-fit'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all
              flex items-center gap-2
              ${
                activeTab === tab.id
                  ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
              }
            `}
          >
            {tab.label}
            {tab.badge && (
              <span
                className={`
                  text-xs px-1.5 py-0.5 rounded
                  ${
                    activeTab === tab.id
                      ? 'bg-zinc-600 text-zinc-200'
                      : 'bg-zinc-700 text-zinc-400'
                  }
                `}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div>{activeContent}</div>
    </div>
  );
}
