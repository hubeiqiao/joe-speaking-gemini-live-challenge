'use client';

import Image from 'next/image';
import { Card, CardBody } from '@heroui/react';
import { ArrowRight } from 'lucide-react';

export function ChallengeSimulatorCard({
  className = '',
  onPress,
}: {
  className?: string;
  onPress?: () => void;
}) {
  return (
    <Card
      isPressable
      onPress={onPress}
      className={`
        relative overflow-hidden block sm:w-full
        bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900
        border border-emerald-500/20
        shadow-[0_8px_32px_-8px_rgba(16,185,129,0.2)]
        hover:shadow-[0_16px_48px_-12px_rgba(16,185,129,0.3)]
        hover:border-emerald-500/30
        transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.01]
        ${className}
      `}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl" />

      <CardBody className="relative p-4 sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg scale-125" />
            <Image
              src="/header-icon.png"
              alt="IELTS Speaking"
              width={56}
              height={56}
              priority
              className="relative w-12 h-12 sm:w-14 sm:h-14"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <h3 className="text-[13px] sm:text-base font-semibold text-white tracking-tight whitespace-nowrap">
                IELTS Speaking Simulator
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                Gemini Live
              </span>
            </div>
            <p className="text-[11px] sm:text-sm text-slate-300 leading-tight line-clamp-2 pr-2">
              Practice with a live Gemini examiner, hear the response, then compare the next attempt on the same topic.
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 transition-colors">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
