export default function PostSkeleton() {
  return (
    <div className="card animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full skeleton" />
        <div className="flex-1">
          <div className="h-4 w-24 skeleton rounded" />
          <div className="mt-2 h-3 w-16 skeleton rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-2">
        <div className="h-4 skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
      </div>

      {/* Image placeholder */}
      <div className="mt-4 h-48 skeleton rounded-lg" />

      {/* Actions */}
      <div className="mt-4 flex gap-4 border-t border-slate-100 pt-4 dark:border-slate-700">
        <div className="h-8 w-16 skeleton rounded" />
        <div className="h-8 w-16 skeleton rounded" />
      </div>
    </div>
  );
}

export function PostSkeletonList({ count = 3 }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
