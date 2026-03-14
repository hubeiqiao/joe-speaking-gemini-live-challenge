'use client';

import { useCallback, useRef } from 'react';

interface BottomTabBarProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  isHidden?: boolean;
  className?: string;
}

const TABS = [
  {
    key: 'practice',
    label: 'Practice',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    ),
  },
  {
    key: 'library',
    label: 'Library',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    ),
  },
  {
    key: 'collection',
    label: 'Collection',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    ),
  },
  {
    key: 'review',
    label: 'Review',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    ),
  },
];

export default function BottomTabBar({
  selectedTab,
  onTabChange,
  isHidden = false,
  className = '',
}: BottomTabBarProps) {
  const tablistRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = TABS.findIndex((tab) => tab.key === selectedTab);
      let newIndex: number | null = null;

      switch (event.key) {
        case 'ArrowLeft':
          newIndex = currentIndex === 0 ? TABS.length - 1 : currentIndex - 1;
          break;
        case 'ArrowRight':
          newIndex = currentIndex === TABS.length - 1 ? 0 : currentIndex + 1;
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = TABS.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      onTabChange(TABS[newIndex].key);

      requestAnimationFrame(() => {
        const buttons = tablistRef.current?.querySelectorAll('[role="tab"]');
        (buttons?.[newIndex] as HTMLButtonElement | undefined)?.focus();
      });
    },
    [onTabChange, selectedTab],
  );

  if (isHidden) {
    return null;
  }

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-divider bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
      role="navigation"
      style={{
        paddingBottom: 'var(--safe-area-bottom)',
        paddingLeft: 'var(--safe-area-left)',
        paddingRight: 'var(--safe-area-right)',
      }}
    >
      <div
        aria-label="Main tabs"
        className="flex h-[60px] items-center justify-around"
        onKeyDown={handleKeyDown}
        ref={tablistRef}
        role="tablist"
      >
        {TABS.map((tab) => {
          const isSelected = selectedTab === tab.key;
          return (
            <button
              key={tab.key}
              aria-label={tab.label}
              aria-selected={isSelected}
              className={`flex h-full min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0 ${
                isSelected ? 'text-accent' : 'text-muted'
              }`}
              onClick={() => onTabChange(tab.key)}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
            >
              {tab.icon}
              <span className="mt-1 text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
