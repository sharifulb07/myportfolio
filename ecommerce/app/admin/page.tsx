"use client";

import { FormEvent, useEffect, useState } from "react";

type Metrics = {
  users: number;
  products: number;
  orders: number;
  pendingOrders: number;
};

type AdminOrder = {
  _id: string;
  orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalPrice: number;
};

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminPage() {
  const [csrfToken, setCsrfToken] = useState("");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/csrf").then((r) => r.json()),
      fetch("/api/admin/dashboard").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ])
      .then(([csrf, metricsPayload, ordersPayload]) => {
        setCsrfToken(csrf.data.csrfToken);
        if (metricsPayload.success) {
          setMetrics(metricsPayload.data);
        }
        if (ordersPayload.success) {
          setOrders(ordersPayload.data);
        }
      })
      .catch(() => setMessage("Unable to load admin data. Login as ADMIN."));
  }, []);

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      discountPrice: Number(formData.get("discountPrice")),
      stock: Number(formData.get("stock")),
      images: [formData.get("image")],
      rating: 0,
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error?.message ?? "Unable to create product");
      return;
    }

    setMessage("Product created successfully");
    event.currentTarget.reset();
  }

  async function updateOrderStatus(orderId: string, orderStatus: string) {
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ orderId, orderStatus }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error?.message ?? "Unable to update order");
      return;
    }

    setOrders((previous) =>
      previous.map((order) =>
        order._id === orderId
          ? { ...order, orderStatus: payload.data.orderStatus }
          : order,
      ),
    );
    setMessage("Order status updated");
  }

  return (
    <section className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      {message && <p className="text-sm text-slate-700">{message}</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics ? (
          [
            ["Users", metrics.users],
            ["Products", metrics.products],
            ["Orders", metrics.orders],
            ["Pending", metrics.pendingOrders],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border bg-white p-4">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          ))
        ) : (
          <p className="text-sm">Dashboard metrics unavailable.</p>
        )}
      </div>

      <form
        onSubmit={createProduct}
        className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2"
      >
        <input
          name="title"
          placeholder="Title"
          required
          className="rounded-md border px-3 py-2"
        />
        <input
          name="slug"
          placeholder="Slug"
          required
          className="rounded-md border px-3 py-2"
        />
        <input
          name="category"
          placeholder="Category"
          required
          className="rounded-md border px-3 py-2"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          className="rounded-md border px-3 py-2"
        />
        <input
          name="discountPrice"
          type="number"
          step="0.01"
          placeholder="Discount Price"
          className="rounded-md border px-3 py-2"
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          required
          className="rounded-md border px-3 py-2"
        />
        <input
          name="image"
          type="url"
          placeholder="Image URL (Cloudinary)"
          required
          className="rounded-md border px-3 py-2 sm:col-span-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="rounded-md border px-3 py-2 sm:col-span-2"
          rows={3}
        />
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:col-span-2"
        >
          Create product
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Manage Orders</h2>
        {orders.map((order) => (
          <article
            key={order._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"
          >
            <div>
              <p className="font-semibold">Order #{order._id}</p>
              <p className="text-sm text-slate-500">
                Total: ${order.totalPrice.toFixed(2)}
              </p>
            </div>
            <select
              value={order.orderStatus}
              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </article>
        ))}
      </div>
    </section>
  );
}
