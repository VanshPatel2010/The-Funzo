import { buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Search Cycles & Toys Gandhinagar | The Funzo",
  description:
    "Search kids cycles, bicycles and toys at The Funzo cycle and toy store in Raysan, Gandhinagar with WhatsApp enquiries.",
  path: "/search",
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
