"use client";

import ThemeToggle from "@/components/theme/ThemeToggle";

export default function NavBar() {
  return (
    <header className="border-b bg-(--surface)">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="text-xl font-bold tracking-tight">
          MVP Store
        </a>
        <div className="flex items-center gap-4 text-sm font-medium">
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
          <a href="/orders">Orders</a>
          <a href="/admin">Admin</a>
          <a href="/login">Login</a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
