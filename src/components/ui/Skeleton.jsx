export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-navy-100/60 shadow-sm">
      <div className="aspect-[4/3] bg-navy-50 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-navy-50 rounded w-20 animate-pulse" />
        <div className="h-5 bg-navy-50 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-navy-50 rounded w-full animate-pulse" />
        <div className="h-3 bg-navy-50 rounded w-2/3 animate-pulse" />
        <div className="flex justify-between items-end pt-2">
          <div className="h-7 bg-navy-50 rounded w-24 animate-pulse" />
          <div className="h-3 bg-navy-50 rounded w-16 animate-pulse" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-navy-50 rounded-xl flex-1 animate-pulse" />
          <div className="h-10 bg-navy-50 rounded-xl flex-1 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonCategory() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="aspect-[4/3] bg-navy-50 animate-pulse" />
    </div>
  )
}