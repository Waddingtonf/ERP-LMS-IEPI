export default function DocenteLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-slate-100 rounded-xl border border-slate-200" />
                ))}
            </div>
            <div className="h-64 bg-slate-100 rounded-xl border border-slate-200" />
        </div>
    );
}
