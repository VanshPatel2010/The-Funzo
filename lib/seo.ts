import type { Metadata } from "next";
import type { Category, Product, ProductWithCategory } from "@/lib/types";
import { defaultStoreSettings } from "@/lib/store-settings";
import { parseImages } from "@/lib/helpers";

export const siteUrl = "https://thefunzo.com";

export const localSeoKeywords = [
  "cycle store in Gandhinagar",
  "cycle store in Raysan",
  "toy store in Gandhinagar",
  "toy store in raysan",
  "bicycle shop Gandhinagar",
  "kids cycle Gandhinagar",
  "cycle shop near me Gandhinagar",
  "toy shop Raysan",
  "cycle shop in Gandhinagar",
  "bicycle store Raysan",
  "kids bicycle shop Gandhinagar",
  "toy shop Gandhinagar",
  "cycle and toy store Raysan",
  "The Funzo Gandhinagar",
];

export const storeSeo = {
  name: "The Funzo",
  legalName: "The Funzo",
  url: siteUrl,
  logo: `${siteUrl}/apple-touch-icon.png`,
  image: `${siteUrl}/opengraph-image.svg`,
  telephone: defaultStoreSettings.contact_number,
  whatsappNumber: defaultStoreSettings.whatsapp_number,
  whatsappUrl: `https://wa.me/${defaultStoreSettings.whatsapp_number}`,
  streetAddress: "Raysan",
  locality: "Raysan",
  city: "Gandhinagar",
  region: "Gujarat",
  postalCode: "382007",
  country: "IN",
  latitude: 23.1906,
  longitude: 72.6287,
  openingHours: ["Mo-Su 10:00-21:00"],
  priceRange: "₹₹",
  themeColor: "#071018",
  facebookUrl: "",
  instagramUrl: defaultStoreSettings.instagram_url || "",
  googleBusinessUrl:
    defaultStoreSettings.address_url ||
    "https://www.google.com/maps/search/The+Funzo+Raysan+Gandhinagar",
  googleMapsEmbedUrl:
    "https://www.google.com/maps?q=The%20Funzo%2C%20Raysan%2C%20Gandhinagar%2C%20Gujarat%20382007&output=embed",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function localDescription(subject: string) {
  return `${subject} at The Funzo, a cycle and toy store in Raysan, Gandhinagar for kids cycles, bicycles, toys and local family shopping.`;
}

export function buildSeoMetadata({
  title,
  description,
  path,
  image = storeSeo.image,
  type = "website",
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const allKeywords = Array.from(new Set([...localSeoKeywords, ...keywords]));

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: allKeywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: storeSeo.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    other: {
      "geo.region": "IN-GJ",
      "geo.placename": "Gandhinagar",
      "geo.position": `${storeSeo.latitude};${storeSeo.longitude}`,
      ICBM: `${storeSeo.latitude}, ${storeSeo.longitude}`,
      keywords: allKeywords.join(", "),
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    "@id": `${siteUrl}/#localbusiness`,
    name: storeSeo.name,
    legalName: storeSeo.legalName,
    url: siteUrl,
    logo: storeSeo.logo,
    image: storeSeo.image,
    description:
      "The Funzo is a local cycle and toy store in Raysan, Gandhinagar, Gujarat, selling kids cycles, bicycles, toys and family-friendly products.",
    telephone: storeSeo.telephone,
    priceRange: storeSeo.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: storeSeo.streetAddress,
      addressLocality: storeSeo.locality,
      addressRegion: storeSeo.region,
      postalCode: storeSeo.postalCode,
      addressCountry: storeSeo.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: storeSeo.latitude,
      longitude: storeSeo.longitude,
    },
    openingHours: storeSeo.openingHours,
    sameAs: [
      storeSeo.googleBusinessUrl,
      storeSeo.facebookUrl,
      storeSeo.instagramUrl,
    ].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: storeSeo.name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function productSchema(product: ProductWithCategory) {
  const images = parseImages(product.images);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images.length > 0 ? images : [storeSeo.image],
    description:
      product.description ||
      `${product.name} available at The Funzo cycle and toy store in Gandhinagar.`,
    brand: {
      "@type": "Brand",
      name: storeSeo.name,
    },
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/product/${product.slug}`),
      seller: {
        "@id": `${siteUrl}/#localbusiness`,
      },
    },
  };
}

export function itemListSchema(category: Category, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} products at The Funzo`,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/product/${product.slug}`),
      name: product.name,
    })),
  };
}

export function reviewSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#reviews`,
    name: storeSeo.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "3",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Rahul S." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "The Funzo has the best collection of bikes for kids. My son loves his new mountain bike!",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Anita M." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "Excellent customer service and top-notch quality. The buying process was incredibly smooth.",
      },
    ],
  };
}
