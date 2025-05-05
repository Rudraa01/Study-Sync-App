import { parse } from 'papaparse';

interface ImportedCard {
  front: string;
  back: string;
  tags?: string;
}

interface ImportedDeck {
  title: string;
  description?: string;
  cards: ImportedCard[];
}

export function parseCSV(file: File): Promise<ImportedDeck> {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Error parsing CSV file'));
          return;
        }

        const cards = results.data.map((row: any) => ({
          front: row.front || row.Front || row.question || row.Question || '',
          back: row.back || row.Back || row.answer || row.Answer || '',
          tags: row.tags || row.Tags || '',
        }));

        resolve({
          title: file.name.replace('.csv', ''),
          cards: cards.filter(card => card.front && card.back),
        });
      },
      error: (error) => reject(error),
    });
  });
}

export function exportToCSV(deck: {
  title: string;
  cards: { front: string; back: string; tags?: string | null }[];
}): string {
  const csv = [
    ['Front', 'Back', 'Tags'].join(','),
    ...deck.cards.map(card => 
      [
        `"${card.front.replace(/"/g, '""')}"`,
        `"${card.back.replace(/"/g, '""')}"`,
        `"${(card.tags || '').replace(/"/g, '""')}"`
      ].join(',')
    ),
  ].join('\n');

  return csv;
}

export function parseJSON(file: File): Promise<ImportedDeck> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        const cards = content.cards.map((card: any) => ({
          front: card.front || card.question || '',
          back: card.back || card.answer || '',
          tags: card.tags || '',
        }));

        resolve({
          title: content.title || file.name.replace('.json', ''),
          description: content.description,
          cards: cards.filter(card => card.front && card.back),
        });
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

export function exportToJSON(deck: {
  title: string;
  description?: string | null;
  cards: { front: string; back: string; tags?: string | null }[];
}): string {
  return JSON.stringify({
    title: deck.title,
    description: deck.description,
    cards: deck.cards.map(card => ({
      front: card.front,
      back: card.back,
      tags: card.tags || '',
    })),
  }, null, 2);
}
