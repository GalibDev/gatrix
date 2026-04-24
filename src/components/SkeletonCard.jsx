export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-slate-800 p-5">
      <div className="mb-4 h-32 rounded-xl bg-slate-700"></div>
      <div className="mb-2 h-4 w-3/4 rounded bg-slate-700"></div>
      <div className="h-3 w-1/2 rounded bg-slate-700"></div>
    </div>
  );
}