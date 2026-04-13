"use client";

import { FormEvent, useEffect, useState } from "react";

export default function CheckoutPage() {
  const [csrfToken, setCsrfToken] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((data) => setCsrfToken(data.data.csrfToken))
      .catch(() => setMessage("Unable to load CSRF token"));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        addressLine1: formData.get("addressLine1"),
        city: formData.get("city"),
        state: formData.get("state"),
        postalCode: formData.get("postalCode"),
        country: formData.get("country"),
        phone: formData.get("phone"),
        paymentMethod: "COD",
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error?.message ?? "Unable to place order");
      return;
    }

    setMessage(`Order placed successfully. Order ID: ${payload.data._id}`);
    event.currentTarget.reset();
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Checkout (Cash on Delivery)
      </h1>
      <form
        onSubmit={onSubmit}
        className="max-w-2xl space-y-3 rounded-xl border bg-white p-4"
      >
        <label className="block text-sm font-medium">Full name</label>
        <input
          name="fullName"
          required
          className="w-full rounded-md border px-3 py-2"
        />

        <label className="block text-sm font-medium">Email address</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-md border px-3 py-2"
        />

        <label className="block text-sm font-medium">Address line</label>
        <input
          name="addressLine1"
          required
          className="w-full rounded-md border px-3 py-2"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input
              name="city"
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">State</label>
            <input
              name="state"
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Postal code
            </label>
            <input
              name="postalCode"
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Country</label>
            <input
              name="country"
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <label className="block text-sm font-medium">Phone number</label>
        <input
          name="phone"
          required
          className="w-full rounded-md border px-3 py-2"
        />

        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          type="submit"
        >
          Confirm COD order
        </button>
      </form>
      {message && <p className="text-sm text-slate-700">{message}</p>}
    </section>
  );
}
