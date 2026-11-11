export default function LoadingHostels() {
  return (
    <div className="wrap py-9 md:py-12">
      <div className="h-3 w-32 skeleton" />
      <div className="mt-5 h-11 w-72 skeleton" />
      <div className="mt-3 h-4 w-96 max-w-full skeleton" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
        <div className="card h-[430px] p-4">
          <div className="h-4 w-28 skeleton" />
          <div className="mt-6 space-y-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-3 w-20 skeleton" />
                <div className="mt-2 h-11 w-full skeleton" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-8 w-full border-b border-line" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-[4/3] skeleton" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-28 skeleton" />
                  <div className="h-6 w-40 skeleton" />
                  <div className="h-3 w-full skeleton" />
                  <div className="h-10 w-full skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
