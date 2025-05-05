'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { FlashcardDeck } from '@/components/flashcards';

interface Deck {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { cards: number };
}

export default function FlashcardsPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');

  // Fetch decks on component mount
  useState(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const response = await fetch('/api/flashcards');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setDecks(data);
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDeckTitle,
          description: newDeckDescription || null,
          isPublic: false,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Navigate to the new deck
      router.push(`/flashcards/${data.id}`);
    } catch (error) {
      console.error('Error creating deck:', error);
      alert('Failed to create deck. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-lg shadow-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your flashcard decks
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Create new deck card */}
          <Card className="col-span-1">
            <form onSubmit={handleCreateDeck} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Deck</h3>
              <Input
                label="Title"
                value={newDeckTitle}
                onChange={(e) => setNewDeckTitle(e.target.value)}
                placeholder="Enter deck title"
                required
              />
              <Input
                label="Description"
                value={newDeckDescription}
                onChange={(e) => setNewDeckDescription(e.target.value)}
                placeholder="Enter deck description (optional)"
              />
              <Button type="submit" isLoading={isCreating} className="w-full">
                Create Deck
              </Button>
            </form>
          </Card>

          {/* Existing decks */}
          {decks.map((deck) => (
            <FlashcardDeck
              key={deck.id}
              id={deck.id}
              title={deck.title}
              description={deck.description}
              cardCount={deck._count.cards}
              isPublic={deck.isPublic}
            />
          ))}
        </div>

        {decks.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-500">No flashcard decks yet. Create your first deck!</p>
          </div>
        )}
      </div>
    </div>
  );
}
