import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { getStoreSettings } from "@/lib/store-settings";
import { buildSeoMetadata, storeSeo } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...buildSeoMetadata({
    title: "Cycle & Toy Store in Gandhinagar | The Funzo",
    description:
      "The Funzo is a cycle and toy store in Raysan, Gandhinagar for kids cycles, bicycles, toys, gifts and family shopping near you.",
    path: "/",
  }),
  manifest: "/manifest.json",
  appleWebApp: {
    title: "The Funzo",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: storeSeo.themeColor,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${barlowCondensed.variable}`}
    >
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link
          rel="preload"
          as="image"
          href="/hero-bike.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="bg-[#071018] font-sans text-white antialiased">
        <Header settings={settings} />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
