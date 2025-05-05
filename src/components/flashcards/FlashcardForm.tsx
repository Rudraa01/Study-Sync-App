'use client';

import { useState } from 'react';
import { Button, Input, Card } from '@/components/ui';

interface FlashcardFormProps {
  onSubmit: (data: { front: string; back: string }) => Promise<void>;
  initialData?: { front: string; back: string };
  submitLabel?: string;
}

export default function FlashcardForm({ 
  onSubmit, 
  initialData,
  submitLabel = 'Create Card'
}: FlashcardFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [front, setFront] = useState(initialData?.front || '');
  const [back, setBack] = useState(initialData?.back || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit({ front, back });
      if (!initialData) {
        // Clear form if this is a new card creation
        setFront('');
        setBack('');
      }
    } catch (error) {
      console.error('Error submitting flashcard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Enter the question or term"
            required
          />
        </div>

        <div>
          <Input
            label="Back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Enter the answer or definition"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
