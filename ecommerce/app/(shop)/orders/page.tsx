"use client";

import { useEffect, useState } from "react";

type Order = {
  _id: string;
  orderStatus: string;
  totalPrice: number;
  paymentMethod: "COD";
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          setError(data.error?.message ?? "Unable to load orders");
          return;
        }
        setOrders(data.data);
      })
      .catch(() => setError("Unable to load orders"));
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order._id} className="rounded-xl border bg-white p-4">
            <p className="font-semibold">Order #{order._id}</p>
            <p className="text-sm text-slate-600">
              Status: {order.orderStatus}
            </p>
            <p className="text-sm text-slate-600">
              Payment: {order.paymentMethod}
            </p>
            <p className="text-sm text-slate-600">
              Total: ${order.totalPrice.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
