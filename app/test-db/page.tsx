import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';

// This async component does the dynamic data fetching.
// It must be rendered inside a <Suspense> boundary.
async function DatabaseStatus() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('meal_trains')
    .select('count');

  return (
    <div>
      <p className="mb-2">
        Status:{' '}
        {error ? (
          <span className="text-red-600">FAILED — {error.message}</span>
        ) : (
          <span className="text-green-600">CONNECTED ✓</span>
        )}
      </p>
      <p className="mb-2">Response: {JSON.stringify(data)}</p>
    </div>
  );
}

// The page component itself is synchronous.
// It renders a static shell with a <Suspense> fallback.
export default function TestDbPage() {
  return (
    <div className="p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <Suspense
        fallback={<p className="text-gray-500">Connecting to database…</p>}
      >
        <DatabaseStatus />
      </Suspense>
      <p className="text-gray-500 text-sm mt-4">
        (Empty array is expected — you have no meal trains yet.)
      </p>
    </div>
  );
}