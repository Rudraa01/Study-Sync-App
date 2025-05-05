'use client';

import { Card } from '@/components/ui';

interface StudyStatsProps {
  totalCards: number;
  dueCards: number;
  averageAccuracy?: number;
  retentionRate?: number;
  lastStudied?: Date | null;
}

export default function StudyStats({
  totalCards,
  dueCards,
  averageAccuracy = 0,
  retentionRate = 0,
  lastStudied,
}: StudyStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500">Total Cards</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalCards}</dd>
        </div>
      </Card>

      <Card>
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500">Cards Due</dt>
          <dd className="mt-1 text-3xl font-semibold text-indigo-600">{dueCards}</dd>
        </div>
      </Card>

      <Card>
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500">Average Accuracy</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">
            {averageAccuracy.toFixed(1)}%
          </dd>
        </div>
      </Card>

      <Card>
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500">Retention Rate</dt>
          <dd className="mt-1 text-3xl font-semibold text-blue-600">
            {retentionRate.toFixed(1)}%
          </dd>
        </div>
      </Card>

      {lastStudied && (
        <div className="col-span-full">
          <p className="text-sm text-gray-500">
            Last studied:{' '}
            {new Date(lastStudied).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
