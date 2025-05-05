'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { Flashcard, FlashcardForm } from '@/components/flashcards';

interface FlashcardType {
  id: string;
  front: string;
  back: string;
  lastReview?: string | null;
  nextReview?: string | null;
}

interface DeckData {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  cards: FlashcardType[];
}

export default function DeckPage({ params }: { params: { deckId: string } }) {
  const router = useRouter();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<'manage' | 'study'>('manage');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showingForm, setShowingForm] = useState(false);

  useEffect(() => {
    fetchDeck();
  }, [params.deckId]);

  const fetchDeck = async () => {
    try {
      const response = await fetch(`/api/flashcards/${params.deckId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setDeck(data);
    } catch (error) {
      console.error('Error fetching deck:', error);
      alert('Failed to load deck');
      router.push('/flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCard = async (data: { front: string; back: string }) => {
    try {
      const response = await fetch(`/api/flashcards/${params.deckId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create card');

      await fetchDeck(); // Refresh deck data
      setShowingForm(false);
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Failed to create card');
    }
  };
  const handleCardRate = async (rating: 1 | 2 | 3 | 4) => {
    if (!deck?.cards[currentCardIndex]) return;

    try {
      // Submit review
      await fetch(
        `/api/flashcards/${deck.id}/cards/${deck.cards[currentCardIndex].id}/review`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quality: rating }),
        }
      );

      // Move to next card
      if (currentCardIndex < (deck?.cards.length ?? 0) - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        // End of study session
        setMode('manage');
        await fetchDeck(); // Refresh deck data
        alert('Study session completed!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to save review. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/4 bg-gray-200 rounded" />
            <div className="h-64 bg-white rounded-lg shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!deck) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{deck.title}</h1>
            {deck.description && (
              <p className="mt-1 text-sm text-gray-500">{deck.description}</p>
            )}
          </div>

          <div className="flex space-x-4">
            {mode === 'manage' && deck.cards.length > 0 && (
              <Button onClick={() => setMode('study')}>Start Study Session</Button>
            )}
            {mode === 'study' && (
              <Button variant="outline" onClick={() => setMode('manage')}>
                Exit Study Session
              </Button>
            )}
          </div>
        </div>

        {mode === 'manage' ? (
          <div className="space-y-6">
            {/* Add card form */}
            {showingForm ? (
              <FlashcardForm onSubmit={handleCreateCard} />
            ) : (
              <Button onClick={() => setShowingForm(true)}>Add New Card</Button>
            )}

            {/* Card list */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {deck.cards.map((card) => (
                <Card key={card.id} className="relative">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Front</h3>
                      <p className="mt-1">{card.front}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Back</h3>
                      <p className="mt-1">{card.back}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {deck.cards.length > 0 && (
              <Flashcard
                front={deck.cards[currentCardIndex].front}
                back={deck.cards[currentCardIndex].back}
                onRate={handleCardRate}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
