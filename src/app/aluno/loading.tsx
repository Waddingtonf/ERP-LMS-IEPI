export default function AlunoLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 w-72 bg-slate-200 rounded-lg" />
            <div className="h-4 w-56 bg-slate-100 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-40 bg-violet-50 rounded-xl border border-violet-100" />
                <div className="h-40 bg-slate-100 rounded-xl border border-slate-200" />
            </div>
            <div className="h-6 w-48 bg-slate-200 rounded mt-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-48 bg-slate-100 rounded-xl border border-slate-200" />
                <div className="h-48 bg-slate-100 rounded-xl border border-slate-200" />
            </div>
        </div>
    );
}
