export default function AdminLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 w-64 bg-slate-200 rounded-lg" />
            <div className="h-4 w-48 bg-slate-100 rounded" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 bg-slate-100 rounded-xl border border-slate-200" />
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="h-64 bg-slate-100 rounded-xl border border-slate-200" />
                <div className="h-64 bg-slate-100 rounded-xl border border-slate-200" />
            </div>
        </div>
    );
}
