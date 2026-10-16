export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🍲 Meal Train SA</h1>
          <p className="text-sm text-gray-500 mt-1">
            Coordinate meals for someone you care about
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}