import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { calculateNextReview } from '@/utils/spaced-repetition';

interface Params {
  params: {
    deckId: string;
    cardId: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { quality } = body;

    if (![1, 2, 3, 4].includes(quality)) {
      return NextResponse.json(
        { error: 'Quality must be between 1 and 4' },
        { status: 400 }
      );
    }

    // Get the card and verify deck ownership
    const card = await prisma.flashcard.findUnique({
      where: { id: params.cardId },
      include: { deck: true },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (card.deck.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate next review using SM-2 algorithm
    const { nextReview, interval, easeFactor } = calculateNextReview(
      quality,
      card.interval,
      card.easeFactor
    );

    // Update card with new review data
    const updatedCard = await prisma.flashcard.update({
      where: { id: params.cardId },
      data: {
        lastReview: new Date(),
        nextReview,
        interval,
        easeFactor,
      },
    });

    // Update user's study streak and stats
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        lastStudyDate: new Date(),
        studyTime: { increment: 1 }, // Increment study time in minutes
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating card review:', error);
    return NextResponse.json(
      { error: 'Error updating card review' },
      { status: 500 }
    );
  }
}
