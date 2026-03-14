'use client';

import { useMemo, useState } from 'react';
import { Card, CardBody, Input } from '@heroui/react';
import { CollectionMiniCard } from '@/components/collections/CollectionMiniCard';
import type { ChallengeCollectionItem } from '@/lib/types/challenge';
import type { CollectionItem } from '@/lib/types/collections';

function mapCollectionItem(item: ChallengeCollectionItem): CollectionItem {
  return {
    id: item.id,
    title: item.title,
    content: item.notes,
    explanation: item.notes,
    category: item.source === 'review' ? 'grammar' : 'vocabulary',
    itemType: item.source === 'review' ? 'real-world-suggestion' : 'vocabulary-collocation',
  };
}

export function CollectionTab({ items }: { items: ChallengeCollectionItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const collectionItems = useMemo(() => items.map(mapCollectionItem), [items]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return collectionItems;
    }

    const query = searchQuery.toLowerCase();
    return collectionItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.explanation?.toLowerCase().includes(query),
    );
  }, [collectionItems, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-8rem)] p-2 sm:p-3 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="hidden md:block mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Collection</h2>
              <p className="text-xs sm:text-sm md:text-base text-muted">
                Your saved learning items from AI feedback ({collectionItems.length} items)
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 md:bg-content1 md:rounded-large md:shadow-lg md:p-6">
          <div className="flex flex-col gap-3">
            <Input
              aria-label="Search collections"
              placeholder="Search collections..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              isClearable
              classNames={{
                input: 'text-sm',
                inputWrapper: 'h-11 rounded-xl md:rounded-lg',
              }}
            />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <Card className="shadow-md">
            <CardBody className="p-6 text-center">
              <p className="text-default-500">No items match your filters</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <CollectionMiniCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
