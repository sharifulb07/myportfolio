import Image from "next/image";
import { getCachedProducts } from "@/lib/storefront";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const products = await getCachedProducts(params.search, params.category);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>

      <form className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-3">
        <input
          type="text"
          name="search"
          defaultValue={params.search}
          placeholder="Search products"
          className="rounded-md border px-3 py-2"
        />
        <input
          type="text"
          name="category"
          defaultValue={params.category}
          placeholder="Filter category"
          className="rounded-md border px-3 py-2"
        />
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-white"
          type="submit"
        >
          Apply
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(
          (product: {
            _id: string;
            title: string;
            slug: string;
            images: string[];
            category: string;
            price: number;
            discountPrice?: number;
            stock: number;
            rating: number;
          }) => {
            const effectivePrice = product.discountPrice ?? product.price;
            return (
              <article
                key={String(product._id)}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="relative mb-3 h-44 overflow-hidden rounded-md bg-slate-100">
                  <Image
                    src={
                      product.images?.[0] ||
                      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
                    }
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="line-clamp-1 text-lg font-semibold">
                  {product.title}
                </h2>
                <p className="text-sm text-slate-500">{product.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-bold">${effectivePrice.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">
                    Stock: {product.stock}
                  </p>
                </div>
                <a
                  href={`/product/${product.slug}`}
                  className="mt-3 inline-block rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                >
                  View details
                </a>
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}
