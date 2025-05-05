export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="mt-1 h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6"
            >
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="mt-1 h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="mt-4 h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
