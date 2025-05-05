'use client';

import { Card, Badge } from '@/components/ui';
import Link from 'next/link';

interface FlashcardDeckProps {
  id: string;
  title: string;
  description?: string | null;
  cardCount: number;
  isPublic: boolean;
  lastStudied?: Date | null;
}

export default function FlashcardDeck({
  id,
  title,
  description,
  cardCount,
  isPublic,
  lastStudied,
}: FlashcardDeckProps) {
  return (
    <Link href={`/flashcards/${id}`}>
      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <Badge variant={isPublic ? 'info' : 'default'} size="sm">
              {isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>
          
          {description && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
          )}
          
          <div className="mt-auto pt-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{cardCount} cards</span>
              {lastStudied && (
                <span>
                  Last studied: {new Date(lastStudied).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
