export default function AlunoLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Hero skeleton */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-200/60 to-indigo-200/60 h-44" />

            {/* Row skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 rounded-2xl bg-slate-100 h-36" />
                <div className="rounded-2xl bg-slate-200 h-36" />
            </div>

            {/* Alert bar */}
            <div className="rounded-2xl bg-emerald-50 h-16" />

            {/* Courses heading */}
            <div className="h-5 w-36 bg-slate-200 rounded-lg" />

            {/* Course cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {[1, 2].map(i => (
                    <div key={i} className="rounded-2xl border border-slate-100 bg-white h-44 flex overflow-hidden">
                        <div className="w-44 bg-slate-100 shrink-0" />
                        <div className="flex-1 p-5 space-y-3 flex flex-col">
                            <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                            <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
                            <div className="mt-auto h-1.5 bg-slate-100 rounded-full" />
                            <div className="h-10 bg-slate-100 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
