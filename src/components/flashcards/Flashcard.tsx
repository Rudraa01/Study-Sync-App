'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '@/components/ui';

interface FlashcardProps {
  front: string;
  back: string;
  onRate?: (rating: 1 | 2 | 3 | 4) => void;
}

export default function Flashcard({ front, back, onRate }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative perspective-1000">
      <div
        className={`relative w-full transition-transform duration-500 preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
        style={{ minHeight: '300px' }}
      >
        {/* Front */}
        <Card
          className={`absolute w-full h-full backface-hidden ${
            isFlipped ? 'invisible' : ''
          }`}
        >
          <div className="flex items-center justify-center h-full p-6 text-center">
            <p className="text-xl font-medium text-gray-900">{front}</p>
          </div>
        </Card>

        {/* Back */}
        <Card
          className={`absolute w-full h-full backface-hidden rotate-y-180 ${
            !isFlipped ? 'invisible' : ''
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <p className="text-xl text-gray-900">{back}</p>
            </div>

            {onRate && (
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="p-4 border-t border-gray-100"
                  >
                    <p className="text-sm text-gray-500 text-center mb-3">
                      How well did you know this?
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRate(1)}
                      >
                        Again
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRate(2)}
                      >
                        Hard
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRate(3)}
                      >
                        Good
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRate(4)}
                      >
                        Easy
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
