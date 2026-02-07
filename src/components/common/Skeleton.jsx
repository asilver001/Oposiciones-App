/**
 * Skeleton - Reusable loading skeleton component
 *
 * Provides pulsing placeholder elements that approximate page layouts
 * while content is loading via Suspense.
 */

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
  );
}

/**
 * PageSkeleton - Full page skeleton matching the app layout
 * Used as Suspense fallback for lazy-loaded pages.
 */
export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <div className="bg-white/80 border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-lg mx-auto p-4 space-y-4 mt-2">
        {/* Hero card */}
        <Skeleton className="w-full h-32 rounded-2xl" />

        {/* Stats row */}
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-20 rounded-2xl" />
          <Skeleton className="flex-1 h-20 rounded-2xl" />
          <Skeleton className="flex-1 h-20 rounded-2xl" />
        </div>

        {/* List items */}
        <Skeleton className="w-full h-16 rounded-2xl" />
        <Skeleton className="w-full h-16 rounded-2xl" />
        <Skeleton className="w-full h-16 rounded-2xl" />
        <Skeleton className="w-3/4 h-16 rounded-2xl" />
      </div>
    </div>
  );
}
