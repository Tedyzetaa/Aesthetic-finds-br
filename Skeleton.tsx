export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-card bg-white shadow-card">
          <div className="skeleton aspect-[4/5] w-full animate-shimmer" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-2.5 w-1/3 animate-shimmer rounded" />
            <div className="skeleton h-3.5 w-4/5 animate-shimmer rounded" />
            <div className="skeleton h-3 w-1/4 animate-shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
