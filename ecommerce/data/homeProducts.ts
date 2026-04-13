export type HomeProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPrice: number;
  rating: number;
  sold: number;
  createdAt: string;
  image: string;
};

const categories = [
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
  "Accessories",
] as const;

export const homeProducts: HomeProduct[] = Array.from(
  { length: 50 },
  (_, index) => {
    const id = index + 1;
    const category = categories[index % categories.length];
    const basePrice = 25 + ((id * 7) % 190);
    const discountPercent = 5 + (id % 6) * 5;
    const discountPrice = Number(
      (basePrice * (1 - discountPercent / 100)).toFixed(2),
    );
    const rating = Number((3.6 + (id % 8) * 0.2).toFixed(1));
    const sold = 40 + ((id * 31) % 900);

    const objectIdLike = id.toString(16).padStart(24, "0");

    return {
      id: objectIdLike,
      slug: `mock-product-${id}`,
      title: `${category} Product ${id}`,
      description: `Premium ${category.toLowerCase()} item with curated quality and everyday value.`,
      category,
      price: Number(basePrice.toFixed(2)),
      discountPrice,
      rating,
      sold,
      createdAt: new Date(Date.now() - id * 86400000).toISOString(),
      image: `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/sample.jpg`,
    };
  },
);

export const recentProducts = [...homeProducts]
  .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  .slice(0, 15);

export const bestSellingProducts = [...homeProducts]
  .sort((a, b) => b.sold - a.sold)
  .slice(0, 15);

export const topRatedProducts = [...homeProducts]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 15);

export const dealsProducts = [...homeProducts]
  .sort((a, b) => b.price - b.discountPrice - (a.price - a.discountPrice))
  .slice(0, 15);

export const budgetProducts = [...homeProducts]
  .sort((a, b) => a.discountPrice - b.discountPrice)
  .slice(0, 15);

export const premiumProducts = [...homeProducts]
  .sort((a, b) => b.discountPrice - a.discountPrice)
  .slice(0, 15);

export const fashionSpotlightProducts = homeProducts
  .filter((product) => product.category === "Fashion")
  .slice(0, 15);
