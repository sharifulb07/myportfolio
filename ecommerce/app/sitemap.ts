import type { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel } from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.CORS_ORIGIN ?? "http://localhost:3000";

  await connectToDatabase();
  const products = await ProductModel.find(
    {},
    { slug: 1, updatedAt: 1 },
  ).lean();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/cart",
    "/checkout",
    "/orders",
    "/login",
    "/register",
    "/admin",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map(
    (product: { slug: string; updatedAt?: Date }) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt ?? new Date(),
    }),
  );

  return [...staticRoutes, ...productRoutes];
}
