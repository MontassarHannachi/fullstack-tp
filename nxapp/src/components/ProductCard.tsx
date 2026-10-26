import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex flex-col overflow-hidden rounded border hover:shadow-lg"
    >
      <Image
        src={product.thumbnail}
        alt={product.title}
        width={300}
        height={300}
        className="h-48 w-full object-contain"
      />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="font-bold">{product.title}</h2>
        <p className="text-green-600">${product.price}</p>
        <p className="line-clamp-2 text-sm opacity-80">{product.description}</p>
      </div>
    </Link>
  );
}
