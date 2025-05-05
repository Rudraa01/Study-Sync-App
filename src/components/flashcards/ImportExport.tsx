'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { parseCSV, parseJSON, exportToCSV, exportToJSON } from '@/utils/import-export';

interface ImportExportProps {
  deckId?: string;
  onImport: (data: { title: string; description?: string; cards: any[] }) => Promise<void>;
  deck?: {
    title: string;
    description?: string | null;
    cards: any[];
  };
}

export default function ImportExport({ deckId, onImport, deck }: ImportExportProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const data = file.name.endsWith('.csv')
        ? await parseCSV(file)
        : await parseJSON(file);
      
      await onImport(data);
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Error importing file. Please check the format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (!deck) return;

    const content = format === 'csv'
      ? exportToCSV(deck)
      : exportToJSON(deck);

    const blob = new Blob([content], { type: `text/${format}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Import Cards
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileImport}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-gray-500">
          Supported formats: CSV, JSON
        </p>
      </div>

      {deck && (
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Export Cards
          </label>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
            >
              Export as CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
            >
              Export as JSON
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
