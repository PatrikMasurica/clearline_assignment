export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-slate-200" />

          <div className="mt-3 h-9 w-80 max-w-full rounded bg-slate-200" />

          <div className="mt-3 h-4 w-full max-w-2xl rounded bg-slate-200" />

          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="h-6 w-40 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-52 rounded bg-slate-200" />
            </div>

            <div className="divide-y divide-slate-200">
              {[1, 2, 3].map((item) => (
                <div key={item} className="px-5 py-5">
                  <div className="h-5 w-48 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full max-w-3xl rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}