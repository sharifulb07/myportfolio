import ProductCarouselSection from "@/components/home/ProductCarouselSection";
import Image from "next/image";
import {
  bestSellingProducts,
  budgetProducts,
  dealsProducts,
  fashionSpotlightProducts,
  homeProducts,
  premiumProducts,
  recentProducts,
  topRatedProducts,
} from "@/data/homeProducts";

export default function Home() {
  const categories = Array.from(
    new Set(homeProducts.map((product) => product.category)),
  ).slice(0, 6);

  return (
    <section className="space-y-12">
      <header
        className="relative grid gap-8 overflow-hidden rounded-3xl border p-7 text-(--primary-foreground) lg:grid-cols-2 lg:items-center lg:p-10"
        style={{
          backgroundImage:
            "linear-gradient(120deg, var(--hero-from), var(--hero-to))",
        }}
      >
        <div className="pointer-events-none absolute -top-14 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-sky-300/20 blur-2xl" />

        <div>
          <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
            Featured Marketplace
          </p>
          <h1 className="text-4xl leading-tight font-bold tracking-tight lg:text-5xl">
            Shop smarter with a
            <span className="block text-sky-200">modern curated catalog</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/90 lg:text-base">
            Discover curated products across trending categories. Home page now
            includes 50 product cards organized in carousel sections for faster
            browsing and better discovery.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              50 products
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              Recent arrivals
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              Best selling
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              Top rated
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              Deals
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/products"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
            >
              Explore Products
            </a>
            <a
              href="/cart"
              className="rounded-lg border border-white/35 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
            >
              View Cart
            </a>
          </div>
        </div>

        <div className="relative h-64 overflow-hidden rounded-2xl border border-white/20 bg-slate-100/20 lg:h-80">
          <Image
            src="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1400/sample.jpg"
            alt="Featured products hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-lg bg-black/45 px-3 py-2 text-xs font-semibold backdrop-blur-sm">
            New Season Collection
            <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold tracking-wide">
              TRENDING
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 rounded-2xl border bg-(--surface) p-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Total products", homeProducts.length],
          ["Recent", recentProducts.length],
          ["Best Selling", bestSellingProducts.length],
          ["Top Rated", topRatedProducts.length],
          ["Deals", dealsProducts.length],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-xl border bg-(--surface-soft) p-3"
          >
            <p className="text-xs font-medium text-(--muted-foreground)">
              {label}
            </p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-(--muted-foreground)">
              Browse curated categories designed for faster product discovery.
            </p>
          </div>
          <a
            href="/products"
            className="text-sm font-semibold text-(--primary)"
          >
            View all
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const inCategory = homeProducts.filter(
              (product) => product.category === category,
            ).length;
            return (
              <a
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="group rounded-2xl border bg-(--surface) p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-xs font-semibold tracking-wide text-(--muted-foreground) uppercase">
                  Category
                </p>
                <h3 className="mt-1 text-lg font-bold">{category}</h3>
                <p className="mt-2 text-sm text-(--muted-foreground)">
                  {inCategory} products available
                </p>
                <p className="mt-3 text-sm font-semibold text-(--primary)">
                  Explore {category} →
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border bg-(--surface) p-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["🚚", "Fast delivery", "Shipping updates for every COD order."],
          [
            "🛡️",
            "Secure checkout",
            "Validated order flow with CSRF protection.",
          ],
          [
            "📦",
            "Reliable stock",
            "Real-time inventory checks before order placement.",
          ],
          ["💬", "Order support", "Track status from pending to delivered."],
        ].map(([icon, title, desc]) => (
          <div
            key={String(title)}
            className="rounded-xl bg-(--surface-soft) p-4"
          >
            <p className="text-xl">{icon}</p>
            <h3 className="mt-2 text-sm font-bold">{title}</h3>
            <p className="mt-1 text-xs text-(--muted-foreground)">{desc}</p>
          </div>
        ))}
      </section>

      <ProductCarouselSection
        title="Recent Products"
        subtitle="Fresh arrivals handpicked from the latest catalog updates."
        products={recentProducts}
        autoPlayMs={4500}
      />

      <ProductCarouselSection
        title="Best Selling"
        subtitle="Customer favorites with the highest sales volume."
        products={bestSellingProducts}
      />

      <ProductCarouselSection
        title="Top Rated"
        subtitle="Highest-rated picks loved by shoppers."
        products={topRatedProducts}
      />

      <ProductCarouselSection
        title="Hot Deals"
        subtitle="Biggest savings currently available in store."
        products={dealsProducts}
        autoPlayMs={3800}
      />

      <ProductCarouselSection
        title="Budget Picks"
        subtitle="Affordable favorites with the best low-price value."
        products={budgetProducts}
      />

      <ProductCarouselSection
        title="Premium Selection"
        subtitle="Top-tier products for shoppers looking for premium quality."
        products={premiumProducts}
      />

      <ProductCarouselSection
        title="Fashion Spotlight"
        subtitle="Trending fashion products in a timed carousel showcase."
        products={fashionSpotlightProducts}
        autoPlayMs={3200}
      />
    </section>
  );
}
