import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { getStoreSettings } from "@/lib/store-settings";
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
  metadataBase: new URL("https://thefunzo.com"),
  title: "The Funzo | Cycle and Toy Store in Raysan, Gandhinagar",
  description:
    "The Funzo is a cycle and toy store in Raysan, Gandhinagar offering kids cycles, family bicycles, ride-on toys, and fun products for all ages.",
  keywords: [
    "cycle store in Gandhinagar",
    "toy store in Gandhinagar",
    "cycle store in Raysan",
    "toy shop in Raysan",
    "kids cycle shop Gandhinagar",
    "bicycle shop Raysan",
    "toys and cycles Gandhinagar",
  ],
  openGraph: {
    title: "The Funzo | Cycle and Toy Store in Raysan, Gandhinagar",
    description:
      "Shop cycles and toys in Raysan, Gandhinagar with The Funzo. Explore kids bikes, family bicycles, and fun toys in one place.",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: "/",
  },
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
      <body className="bg-[#071018] font-sans text-white antialiased">
        <Header settings={settings} />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
