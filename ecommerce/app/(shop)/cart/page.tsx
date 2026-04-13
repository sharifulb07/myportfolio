"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = {
  product: { _id: string; title: string };
  quantity: number;
  priceSnapshot: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/csrf").then((r) => r.json()),
      fetch("/api/cart").then((r) => r.json()),
    ])
      .then(([csrf, cart]) => {
        setCsrfToken(csrf.data.csrfToken);
        setItems(cart.data?.items ?? []);
      })
      .catch(() => setError("Unable to load cart"));
  }, []);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.quantity * item.priceSnapshot, 0),
    [items],
  );

  async function removeItem(productId: string) {
    const response = await fetch(`/api/cart/item/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error?.message ?? "Unable to remove item");
      return;
    }

    setItems(payload.data.items ?? []);
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {items.length === 0 ? (
        <p className="rounded-xl border bg-white p-4">Cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between rounded-xl border bg-white p-4"
            >
              <div>
                <p className="font-semibold">{item.product.title}</p>
                <p className="text-sm text-slate-500">
                  Qty: {item.quantity} · ${item.priceSnapshot.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.product._id)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="rounded-xl border bg-white p-4">
            <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
            <a
              href="/checkout"
              className="mt-2 inline-block rounded-md bg-slate-900 px-4 py-2 text-white"
            >
              Proceed to COD checkout
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
