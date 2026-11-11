import Link from "next/link";

type Props = {
  page: number;
  pages: number;
  params: Record<string, string | undefined>;
  basePath?: string;
};

function hrefFor(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number,
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") search.set(key, value);
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function Pagination({ page, pages, params, basePath = "/hostels" }: Props) {
  if (pages <= 1) return null;

  const numbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  );

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={hrefFor(basePath, params, page - 1)} className="btn btn-outline">
          Previous
        </Link>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-1">
        {numbers.map((n, index) => {
          const previous = numbers[index - 1];
          const gap = previous && n - previous > 1;
          return (
            <span key={n} className="flex items-center gap-1">
              {gap ? <span className="px-1 text-muted">…</span> : null}
              <Link
                href={hrefFor(basePath, params, n)}
                aria-current={n === page ? "page" : undefined}
                className={`flex h-9 min-w-9 items-center justify-center rounded border px-2 text-sm font-medium ${
                  n === page
                    ? "border-forest bg-forest text-white"
                    : "border-line bg-card hover:border-ink"
                }`}
              >
                {n}
              </Link>
            </span>
          );
        })}
      </div>

      {page < pages ? (
        <Link href={hrefFor(basePath, params, page + 1)} className="btn btn-outline">
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
