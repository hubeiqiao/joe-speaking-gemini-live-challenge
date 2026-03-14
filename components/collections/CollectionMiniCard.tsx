'use client';

import { Card, CardBody, Chip } from '@heroui/react';
import { getCategoryBadgeColor } from '@/lib/collections/card-layout';
import type { CollectionItem } from '@/lib/types/collections';

function getCategoryDisplay(category: CollectionItem['category']): { icon: string; label: string } {
  switch (category) {
    case 'vocabulary':
      return { icon: '🏷️', label: 'Vocabulary' };
    case 'grammar':
      return { icon: '🔧', label: 'Grammar' };
    case 'pronunciation':
      return { icon: '🎤', label: 'Pronunciation' };
    default:
      return { icon: '📚', label: 'Item' };
  }
}

export function CollectionMiniCard({ item }: { item: CollectionItem }) {
  const { icon, label } = getCategoryDisplay(item.category);
  const isCorrection = item.itemType === 'grammar-correction' || item.itemType === 'vocabulary-improvement';

  return (
    <Card className="shadow-sm border-default-200">
      <CardBody className="p-2.5 sm:p-3 gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            variant="flat"
            classNames={{
              base: getCategoryBadgeColor(item.category),
            }}
          >
            <span className="mr-1">{icon}</span>
            {label}
          </Chip>
        </div>

        <div className="space-y-1 sm:space-y-1.5">
          {isCorrection ? (
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-xs sm:text-sm text-danger flex items-start gap-1">
                <span className="flex-shrink-0">❌</span>
                <span className="break-words line-clamp-2">&quot;{item.title}&quot;</span>
              </p>
              {item.correctedText ? (
                <p className="text-xs sm:text-sm text-success flex items-start gap-1">
                  <span className="flex-shrink-0">✅</span>
                  <span className="break-words line-clamp-2">&quot;{item.correctedText}&quot;</span>
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-xs sm:text-sm font-medium text-foreground break-words line-clamp-2">
              &quot;{item.title}&quot;
            </p>
          )}

          {(item.explanation || item.content) ? (
            <p className="text-[11px] sm:text-xs text-default-500 flex items-start gap-1">
              <span className="flex-shrink-0">💡</span>
              <span className="break-words line-clamp-2">
                {item.explanation || item.content}
              </span>
            </p>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}
