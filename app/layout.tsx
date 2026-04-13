// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Shariful Islam | Full Stack Developer Portfolio",
  description:
    "Full Stack Developer specializing in React, Next.js, and Node.js. Creating immersive web experiences with cutting-edge animations.",
  keywords:
    "full stack developer, react developer, next.js, portfolio, web developer",
  authors: [{ name: "Shariful Islam" }],
  openGraph: {
    title: "Shariful Islam | Full Stack Developer",
    description:
      "Creating immersive web experiences with cutting-edge animations",
    url: "https://your-portfolio.com",
    siteName: "Shariful Islam Portfolio",
    images: [
      {
        url: "https://your-portfolio.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shariful Islam | Full Stack Developer",
    description:
      "Creating immersive web experiences with cutting-edge animations",
    images: ["https://your-portfolio.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 text-white"
      >
        <Providers>
          <CustomCursor />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
