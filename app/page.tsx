import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">🍲</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Meal Train SA
        </h1>
        <p className="text-gray-600 mb-8">
          Coordinate meal deliveries for someone in your community who
          needs support.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}