import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import SessionGuard from "@/components/SessionGuard";
import { getSiteConfig } from "@/lib/site";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const site = getSiteConfig();

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon-512.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: site.appName,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: site.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} h-full antialiased`}>
      <body className="min-h-dvh overflow-x-hidden flex flex-col">
        <SessionGuard />
        {children}
      </body>
    </html>
  );
}
