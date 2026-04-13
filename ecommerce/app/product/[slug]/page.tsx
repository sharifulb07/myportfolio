import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCachedProductBySlug } from "@/lib/storefront";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const effectivePrice = product.discountPrice ?? product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description,
    sku: String(product._id),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: effectivePrice,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="relative h-80 overflow-hidden rounded-xl border bg-white">
        <Image
          src={
            product.images?.[0] ||
            "https://res.cloudinary.com/demo/image/upload/sample.jpg"
          }
          alt={product.title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-sm text-slate-500">Category: {product.category}</p>
        <p className="text-slate-700">{product.description}</p>
        <p className="text-2xl font-bold">${effectivePrice.toFixed(2)}</p>
        <p className="text-sm text-slate-500">Stock: {product.stock}</p>

        <form
          action="/api/cart"
          method="post"
          className="space-y-2 rounded-xl border bg-white p-4"
        >
          <input type="hidden" name="productId" value={String(product._id)} />
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            defaultValue={1}
            min={1}
            max={50}
            className="w-full rounded-md border px-3 py-2"
          />
          <p className="text-xs text-slate-500">
            Note: For API usage, send JSON with X-CSRF-Token header.
          </p>
        </form>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
