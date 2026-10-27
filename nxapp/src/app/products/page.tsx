import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductPage } from "@/types/product";

const LIMIT = 12;

type CategoryCount = { id: number; name: string; _count: { products: number } };

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ skip?: string; q?: string; category?: string }>;
}) {
  const { skip: skipParam, q = "", category = "" } = await searchParams;
  const skip = Math.max(0, Number(skipParam) || 0);

  const query = new URLSearchParams({ limit: String(LIMIT), skip: String(skip) });
  if (q) query.set("q", q);
  if (category) query.set("category", category);

  const [response, categoriesResponse] = await Promise.all([
    fetch(`${process.env.API_URL}/products?${query}`),
    fetch(`${process.env.API_URL}/categories`),
  ]);
  if (!response.ok) throw new Error("HTTP " + response.status);
  if (!categoriesResponse.ok) throw new Error("HTTP " + categoriesResponse.status);
  const page: ProductPage = await response.json();
  const categories: CategoryCount[] = await categoriesResponse.json();

  const link = (s: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (category) p.set("category", category);
    p.set("skip", String(s));
    return `/products?${p}`;
  };

  const hasPrevious = skip > 0;
  const hasNext = skip + LIMIT < page.total;
  const button = "rounded px-4 py-2";

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Catalogue</h1>

      <form action="/products" method="get" className="mb-4 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search..."
          className="rounded border px-3 py-2"
        />
        <select name="category" defaultValue={category} className="rounded border px-3 py-2">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name} ({c._count.products})
            </option>
          ))}
        </select>
        <button type="submit" className={`${button} bg-blue-500 text-white`}>
          Search
        </button>
        {(q || category) && (
          <Link href="/products" className={`${button} bg-gray-300`}>
            Reset
          </Link>
        )}
      </form>

      {page.total === 0 ? (
        <p>No product found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {page.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            {hasPrevious ? (
              <Link className={`${button} bg-blue-500 text-white`} href={link(Math.max(0, skip - LIMIT))}>
                Previous
              </Link>
            ) : (
              <span className={`${button} bg-gray-300 text-gray-500`}>Previous</span>
            )}
            <span>
              {skip + 1} - {skip + page.products.length} / {page.total}
            </span>
            {hasNext ? (
              <Link className={`${button} bg-blue-500 text-white`} href={link(skip + LIMIT)}>
                Next
              </Link>
            ) : (
              <span className={`${button} bg-gray-300 text-gray-500`}>Next</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
