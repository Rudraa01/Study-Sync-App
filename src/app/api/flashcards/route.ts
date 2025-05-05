import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

// Get all decks for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decks = await prisma.flashcardDeck.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          { isPublic: true }
        ]
      },
      include: {
        _count: {
          select: { cards: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(decks);
  } catch (error) {
    console.error('Error fetching flashcard decks:', error);
    return NextResponse.json(
      { error: 'Error fetching flashcard decks' },
      { status: 500 }
    );
  }
}

// Create a new deck
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, isPublic = false } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const deck = await prisma.flashcardDeck.create({
      data: {
        title,
        description,
        isPublic,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(deck);
  } catch (error) {
    console.error('Error creating flashcard deck:', error);
    return NextResponse.json(
      { error: 'Error creating flashcard deck' },
      { status: 500 }
    );
  }
}
