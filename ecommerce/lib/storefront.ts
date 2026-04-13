import { unstable_cache } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel } from "@/models/Product";

export const getCachedProducts = unstable_cache(
  async (search?: string, category?: string) => {
    await connectToDatabase();

    const query: Record<string, unknown> = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }

    const products = await ProductModel.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return products;
  },
  ["storefront-products"],
  {
    revalidate: 120,
  },
);

export const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    await connectToDatabase();
    return ProductModel.findOne({ slug }).lean();
  },
  ["storefront-product-by-slug"],
  {
    revalidate: 120,
  },
);
