import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../../auth/[...nextauth]/route';

interface Params {
  params: {
    deckId: string;
  };
}

// Create a new card in a deck
export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns the deck
    const deck = await prisma.flashcardDeck.findUnique({
      where: { id: params.deckId },
    });

    if (!deck || deck.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Deck not found or unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { front, back, tags } = body;

    if (!front || !back) {
      return NextResponse.json(
        { error: 'Front and back are required' },
        { status: 400 }
      );
    }

    const card = await prisma.flashcard.create({
      data: {
        front,
        back,
        tags,
        deckId: params.deckId,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return NextResponse.json(
      { error: 'Error creating flashcard' },
      { status: 500 }
    );
  }
}

// Get all cards in a deck
export async function GET(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to the deck
    const deck = await prisma.flashcardDeck.findUnique({
      where: { id: params.deckId },
    });

    if (!deck || (!deck.isPublic && deck.ownerId !== session.user.id)) {
      return NextResponse.json(
        { error: 'Deck not found or unauthorized' },
        { status: 401 }
      );
    }

    const cards = await prisma.flashcard.findMany({
      where: { deckId: params.deckId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { error: 'Error fetching flashcards' },
      { status: 500 }
    );
  }
}
