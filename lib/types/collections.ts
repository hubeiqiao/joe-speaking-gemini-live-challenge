export type CollectionCategory = 'vocabulary' | 'grammar' | 'pronunciation';

export type CollectionItemType =
  | 'vocabulary-collocation'
  | 'grammar-rule'
  | 'grammar-correction'
  | 'vocabulary-improvement'
  | 'pronunciation-pattern'
  | 'real-world-suggestion';

export interface CollectionItem {
  id: string;
  title: string;
  content: string;
  example?: string;
  context?: string;
  category: CollectionCategory;
  itemType: CollectionItemType;
  explanation?: string;
  correctedText?: string;
  notes?: string;
}
