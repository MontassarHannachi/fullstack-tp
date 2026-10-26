import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductPage } from "@/types/product";

const LIMIT = 12;

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ skip?: string }>;
}) {
  const { skip: skipParam } = await searchParams;
  const skip = Math.max(0, Number(skipParam) || 0);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=${LIMIT}&skip=${skip}`
  );
  if (!response.ok) throw new Error("HTTP " + response.status);
  const page: ProductPage = await response.json();

  const hasPrevious = skip > 0;
  const hasNext = skip + LIMIT < page.total;
  const button = "rounded px-4 py-2";

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Catalogue</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {page.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {hasPrevious ? (
          <Link
            className={`${button} bg-blue-500 text-white`}
            href={`/products?skip=${Math.max(0, skip - LIMIT)}`}
          >
            Previous
          </Link>
        ) : (
          <span className={`${button} bg-gray-300 text-gray-500`}>Previous</span>
        )}
        <span>
          {skip + 1} - {skip + page.products.length} / {page.total}
        </span>
        {hasNext ? (
          <Link className={`${button} bg-blue-500 text-white`} href={`/products?skip=${skip + LIMIT}`}>
            Next
          </Link>
        ) : (
          <span className={`${button} bg-gray-300 text-gray-500`}>Next</span>
        )}
      </div>
    </div>
  );
}
