"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { HomeProduct } from "@/data/homeProducts";

type ProductCarouselSectionProps = {
  title: string;
  subtitle: string;
  products: HomeProduct[];
  autoPlayMs?: number;
};

export default function ProductCarouselSection({
  title,
  subtitle,
  products,
  autoPlayMs,
}: ProductCarouselSectionProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");

  const plugins = useMemo(() => {
    if (!autoPlayMs || autoPlayMs < 1000) {
      return [];
    }

    return [
      Autoplay({
        delay: autoPlayMs,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ];
  }, [autoPlayMs]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: false,
      containScroll: "trimSnaps",
    },
    plugins,
  );

  const handlePrevious = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  async function addToCart(product: HomeProduct) {
    setFeedback("");

    const authResponse = await fetch("/api/auth/me", { cache: "no-store" });
    if (!authResponse.ok) {
      router.push(`/login?next=${encodeURIComponent("/products")}`);
      return;
    }

    try {
      const csrfResponse = await fetch("/api/auth/csrf", { cache: "no-store" });
      const csrfPayload = await csrfResponse.json();

      const csrfToken = csrfPayload?.data?.csrfToken;
      if (!csrfToken) {
        setFeedback("Unable to verify session. Please login again.");
        router.push("/login?next=/products");
        return;
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setFeedback(
          payload?.error?.message ??
            "Please browse products to continue purchase.",
        );
        router.push("/products");
        return;
      }

      setFeedback(`Added ${product.title} to cart.`);
    } catch {
      setFeedback("Something went wrong while adding to cart.");
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-(--muted-foreground)">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            className="rounded-lg border bg-(--surface) px-3 py-2 text-sm font-semibold transition hover:bg-(--surface-soft)"
            aria-label={`Scroll ${title} left`}
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg border bg-(--surface) px-3 py-2 text-sm font-semibold transition hover:bg-(--surface-soft)"
            aria-label={`Scroll ${title} right`}
          >
            →
          </button>
        </div>
      </div>

      {feedback && (
        <p className="text-xs font-medium text-(--muted-foreground)">
          {feedback}
        </p>
      )}

      <div ref={emblaRef} className="overflow-hidden pb-2">
        <div className="no-scrollbar flex gap-4">
          {products.map((product) => {
            const savings = Number(
              (product.price - product.discountPrice).toFixed(2),
            );

            return (
              <article
                key={product.id}
                data-carousel-card
                className="min-w-65 max-w-65 shrink-0 rounded-2xl border bg-(--surface) p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative mb-3 h-40 overflow-hidden rounded-lg bg-(--surface-soft)">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs font-medium text-(--muted-foreground)">
                  {product.category}
                </p>
                <h3 className="line-clamp-1 text-sm font-semibold leading-5">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs text-(--muted-foreground)">
                  ⭐ {product.rating} · {product.sold} sold
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <p className="text-base font-bold">
                    ${product.discountPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-(--muted-foreground) line-through">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <p className="mt-1 text-xs font-medium text-emerald-700">
                  Save ${savings.toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="mt-3 w-full rounded-lg bg-(--primary) px-3 py-2 text-xs font-semibold text-(--primary-foreground)"
                >
                  Add to cart
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
