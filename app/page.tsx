import Script from "next/script";
import BicycleHome from "@/components/sections/BicycleHome";

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["Store", "BicycleStore", "ToyStore"],
    name: "The Funzo",
    description:
      "Cycle and toy store in Raysan, Gandhinagar for kids cycles, family bicycles, and toys.",
    areaServed: ["Raysan", "Gandhinagar"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Raysan",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    url: "https://thefunzo.com",
  };

  return (
    <>
      <Script
        id="the-funzo-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <BicycleHome />
    </>
  );
}
