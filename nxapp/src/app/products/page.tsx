import type { Product } from "@/types/product";

export default async function Products() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/1`);
  if (!response.ok) throw new Error("HTTP " + response.status);
  const product: Product = await response.json();

  return (
    <p className="p-4">
      {product.title} - {product.description}
    </p>
  );
}
