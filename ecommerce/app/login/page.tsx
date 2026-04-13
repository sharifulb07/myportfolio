"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error?.message ?? "Login failed");
      return;
    }

    setMessage(`Welcome back, ${payload.data.name}`);
    event.currentTarget.reset();

    const nextPath = searchParams.get("next") || "/products";
    router.push(nextPath);
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Login</h1>
      <form
        onSubmit={onSubmit}
        className="max-w-md space-y-3 rounded-xl border bg-white p-4"
      >
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-md border px-3 py-2"
        />

        <label className="block text-sm font-medium">Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-md border px-3 py-2"
        />

        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          type="submit"
        >
          Sign in
        </button>
      </form>
      <p className="text-sm text-slate-700">{message}</p>
      <p className="text-sm text-slate-600">
        New here?{" "}
        <a href="/register" className="underline">
          Create an account
        </a>
      </p>
    </section>
  );
}
