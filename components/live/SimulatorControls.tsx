'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SimulatorControls({
  className,
  isEnding = false,
  isMuted,
  onEndTest,
  onMuteToggle,
  showHotkeys = true,
}: {
  className?: string;
  isEnding?: boolean;
  isMuted: boolean;
  onEndTest: () => void;
  onMuteToggle: () => void;
  showHotkeys?: boolean;
}) {
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'm':
          event.preventDefault();
          onMuteToggle();
          break;
        case 'escape':
          event.preventDefault();
          if (showEndConfirm) {
            onEndTest();
          } else {
            setShowEndConfirm(true);
          }
          break;
      }
    },
    [onEndTest, onMuteToggle, showEndConfirm],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!showEndConfirm) {
      return;
    }

    const timer = setTimeout(() => setShowEndConfirm(false), 3000);
    return () => clearTimeout(timer);
  }, [showEndConfirm]);

  const handleEndClick = () => {
    if (showEndConfirm) {
      onEndTest();
    } else {
      setShowEndConfirm(true);
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex items-center gap-2 sm:gap-3">
        <Tooltip content={`${isMuted ? 'Unmute' : 'Mute'} microphone${showHotkeys ? ' (M)' : ''}`}>
          <Button
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={cn(
              'h-12 w-12 rounded-full sm:h-14 sm:w-14',
              isMuted ? 'animate-pulse motion-reduce:animate-none' : undefined,
            )}
            color={isMuted ? 'danger' : 'default'}
            isIconOnly
            onPress={onMuteToggle}
            size="lg"
            variant={isMuted ? 'flat' : 'solid'}
          >
            {isMuted ? <MicOff className="h-5 w-5 sm:h-6 sm:w-6" /> : <Mic className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
        </Tooltip>

        <Tooltip content={showEndConfirm ? 'Click again to confirm' : `End test${showHotkeys ? ' (Esc)' : ''}`}>
          <Button
            aria-label="End test"
            className={cn(
              'h-12 w-12 rounded-full sm:h-14 sm:w-14',
              showEndConfirm ? 'animate-pulse ring-2 ring-danger motion-reduce:animate-none' : undefined,
            )}
            color="danger"
            isIconOnly
            isLoading={isEnding}
            onPress={handleEndClick}
            size="lg"
            variant="flat"
          >
            <PhoneOff className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </Tooltip>
      </div>

      {showEndConfirm ? (
        <p className="animate-fade-in text-xs text-danger motion-reduce:animate-none">Press Esc or click again to end test</p>
      ) : null}

      {showHotkeys && !showEndConfirm ? (
        <div className="hidden items-center gap-4 text-xs text-default-400 sm:flex">
          <span>
            <kbd className="rounded bg-default-100 px-1.5 py-0.5 text-default-600">M</kbd> Mute
          </span>
          <span>
            <kbd className="rounded bg-default-100 px-1.5 py-0.5 text-default-600">Esc</kbd> End
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default SimulatorControls;
