'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user?.name?.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s an overview of your study progress
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">Study Streak</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">0 days</dd>
            </div>
          </Card>

          <Card>
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">Total Study Time</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">0h</dd>
            </div>
          </Card>

          <Card>
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">Level</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">1</dd>
            </div>
          </Card>

          <Card>
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">Flashcards Created</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">0</dd>
            </div>
          </Card>
        </div>

        {/* Placeholder for future dashboard sections */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <p className="mt-4 text-gray-500">No recent activity to show.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
