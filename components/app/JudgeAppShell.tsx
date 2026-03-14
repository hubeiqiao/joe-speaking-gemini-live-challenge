'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Tab, Tabs } from '@heroui/react';
import { BookOpen, ClipboardList, Library, Mic } from 'lucide-react';
import BottomTabBar from '@/components/app/BottomTabBar';
import { ChallengeUserMenu } from '@/components/app/ChallengeUserMenu';
import { CollectionTab } from '@/components/tabs/CollectionTab';
import { LibraryTab } from '@/components/tabs/LibraryTab';
import { PracticeTab } from '@/components/tabs/PracticeTab';
import { ReviewTab } from '@/components/tabs/ReviewTab';
import type { BrowserDemoState } from '@/lib/demo/browser-store';
import type { ChallengeReview, ChallengeSession } from '@/lib/types/challenge';

type TabKey = 'practice' | 'library' | 'collection' | 'review';

interface JudgeAppShellProps {
  userLabel: string;
  state: BrowserDemoState;
  latestSession: ChallengeSession | null;
  latestReview: ChallengeReview | null;
  isLocalMode?: boolean;
  livePanel?: React.ReactNode;
  onCreateAttempt: () => void;
  onGenerateReview: () => Promise<void> | void;
  onResetDemo: () => void;
  onSaveInsight: () => void;
  onSignOut: () => Promise<void> | void;
  liveStatus?: string | null;
}

const tabs: Array<{ icon: React.ComponentType<{ className?: string }>; key: TabKey; label: string }> = [
  { icon: Mic, key: 'practice', label: 'Practice' },
  { icon: Library, key: 'library', label: 'Library' },
  { icon: BookOpen, key: 'collection', label: 'Collection' },
  { icon: ClipboardList, key: 'review', label: 'Review' },
];

export function JudgeAppShell({
  userLabel,
  state,
  latestSession,
  latestReview,
  isLocalMode = false,
  livePanel,
  onCreateAttempt,
  onGenerateReview,
  onResetDemo,
  onSaveInsight,
  onSignOut,
  liveStatus = null,
}: JudgeAppShellProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('practice');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(latestSession?.id ?? state.sessions[0]?.id ?? null);

  useEffect(() => {
    if (selectedSessionId && state.sessions.some((session) => session.id === selectedSessionId)) {
      return;
    }

    setSelectedSessionId(latestSession?.id ?? state.sessions[0]?.id ?? null);
  }, [latestSession?.id, selectedSessionId, state.sessions]);

  const selectedSession = useMemo(
    () => state.sessions.find((session) => session.id === selectedSessionId) ?? latestSession ?? state.sessions[0] ?? null,
    [latestSession, selectedSessionId, state.sessions],
  );
  const selectedReview = useMemo(
    () => (selectedSession ? state.reviews.find((review) => review.sessionId === selectedSession.id) ?? null : latestReview),
    [latestReview, selectedSession, state.reviews],
  );

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div
        className="sticky top-0 z-40 border-b border-divider bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{
          paddingTop: 'var(--safe-area-top)',
          paddingLeft: 'var(--safe-area-left)',
          paddingRight: 'var(--safe-area-right)',
        }}
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="md:hidden py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 ml-2">
              <Image alt="Joe Speaking" className="flex-shrink-0" height={44} src="/header-logo.png" width={44} />
              <div className="flex flex-col justify-center -mt-1">
                <h1 className="text-lg font-bold leading-none">
                  <span className="bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">Joe</span>{' '}
                  <span className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">
                    Speaking
                  </span>
                </h1>
                <p className="text-xs text-muted leading-none mt-1">Learn English by actually speaking</p>
              </div>
            </div>
            <div className="flex items-center">
              <ChallengeUserMenu isLocalMode={isLocalMode} onLocalClear={onSignOut} />
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between py-2">
            <div className="flex-shrink-0 flex items-center gap-4">
              <Image alt="Joe Speaking" className="flex-shrink-0" height={52} src="/header-logo.png" width={52} />
              <div className="flex flex-col justify-center -mt-1">
                <h1 className="text-xl lg:text-2xl font-bold leading-none">
                  <span className="bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">Joe</span>{' '}
                  <span className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">
                    Speaking
                  </span>
                </h1>
                <p className="text-xs text-muted leading-none">Learn English by actually speaking</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Tabs
                aria-label="Main navigation tabs"
                classNames={{
                  cursor: 'w-full bg-accent',
                  tab: 'max-w-fit px-3 lg:px-4 h-10',
                  tabContent: 'group-data-[selected=true]:text-accent text-sm font-semibold',
                  tabList: 'gap-6 lg:gap-8 relative rounded-none p-0 border-b-0',
                }}
                color="primary"
                onSelectionChange={(key) => setActiveTab(key as TabKey)}
                selectedKey={activeTab}
                variant="underlined"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tab
                      key={tab.key}
                      title={
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <span>{tab.label}</span>
                        </div>
                      }
                    />
                  );
                })}
              </Tabs>
              <ChallengeUserMenu isLocalMode={isLocalMode} onLocalClear={onSignOut} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex-1 pb-[var(--bottom-tab-height-safe)] md:pb-0"
        style={{
          paddingLeft: 'var(--safe-area-left)',
          paddingRight: 'var(--safe-area-right)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className={activeTab === 'practice' ? '' : 'hidden'}>
            <PracticeTab
              livePanel={livePanel}
              onCreateAttempt={onCreateAttempt}
              onGenerateReview={() => void onGenerateReview()}
            />
          </div>
          <div className={activeTab === 'library' ? '' : 'hidden'}>
            <LibraryTab
              onSessionSelect={(sessionId) => {
                setSelectedSessionId(sessionId);
                setActiveTab('review');
              }}
              sessions={state.sessions}
            />
          </div>
          <div className={activeTab === 'collection' ? '' : 'hidden'}>
            <CollectionTab items={state.collectionItems} />
          </div>
          <div className={activeTab === 'review' ? '' : 'hidden'}>
            <ReviewTab latestReview={selectedReview} latestSession={selectedSession} sessions={state.sessions} />
          </div>
        </div>
      </div>

      <BottomTabBar
        className="md:hidden"
        isHidden={false}
        onTabChange={(tab) => setActiveTab(tab as TabKey)}
        selectedTab={activeTab}
      />
    </main>
  );
}
