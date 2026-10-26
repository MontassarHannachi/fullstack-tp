import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Product } from "@/types/product";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("HTTP " + response.status);
  const product: Product = await response.json();

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Link href="/products" className="text-blue-600 underline">
        Back to catalogue
      </Link>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={500}
          height={500}
          className="w-full object-contain"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="opacity-70">
            {product.category}
            {product.brand ? ` - ${product.brand}` : ""}
          </p>
          <p>{product.description}</p>
          <p className="text-2xl text-green-600">${product.price}</p>
          <p>
            Rating: {product.rating} / 5 - Stock: {product.stock}
          </p>
        </div>
      </div>
    </div>
  );
}
