import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/layout/NavBar";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MVP Store",
    template: "%s | MVP Store",
  },
  description:
    "Production-ready MVP eCommerce app with Next.js, MongoDB, JWT auth, and COD checkout.",
  openGraph: {
    title: "MVP Store",
    description: "Secure eCommerce MVP with COD and admin dashboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
              {children}
            </main>
            <footer className="mt-8 border-t bg-(--surface)">
              <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-(--muted-foreground) sm:flex-row">
                <p>
                  © {new Date().getFullYear()} MVP Store. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <a href="/products" className="hover:underline">
                    Shop
                  </a>
                  <a href="/orders" className="hover:underline">
                    Orders
                  </a>
                  <a href="/login" className="hover:underline">
                    Account
                  </a>
                  <ThemeToggle />
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
