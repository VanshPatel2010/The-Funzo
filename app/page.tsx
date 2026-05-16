import BicycleHome from "@/components/sections/BicycleHome";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildSeoMetadata,
  localBusinessSchema,
  reviewSchema,
  websiteSchema,
} from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Cycle & Toy Store in Gandhinagar | The Funzo",
  description:
    "Visit The Funzo, a cycle and toy store in Raysan, Gandhinagar for kids cycles, bicycles, toys and family gifts near you.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={reviewSchema()} />
      <BicycleHome />
    </>
  );
}
