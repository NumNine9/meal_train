import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { CreateTrainForm } from './CreateTrainForm';
import { getTodayString, getDateStringPlusDays } from '@/lib/dates';

// Async child — all dynamic work happens here
async function NewTrainContent() {
  await connection();   // 👈 gate first

  const today = getTodayString();
  const maxDate = getDateStringPlusDays(90);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Create a meal train
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in a few details. We will generate a calendar your volunteers
          can claim.
        </p>
      </div>

      <CreateTrainForm today={today} maxDate={maxDate} />
    </>
  );
}

// Sync page — static shell + Suspense
export default function NewTrainPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>
      </div>

      <Suspense fallback={<NewTrainSkeleton />}>
        <NewTrainContent />
      </Suspense>
    </div>
  );
}

function NewTrainSkeleton() {
  return (
    <div className="animate-pulse max-w-2xl">
      <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-80 mb-8"></div>
      <div className="space-y-6">
        <div className="h-20 bg-gray-100 rounded-lg"></div>
        <div className="h-20 bg-gray-100 rounded-lg"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="h-24 bg-gray-100 rounded-lg"></div>
      </div>
    </div>
  );
}