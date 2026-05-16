import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWhatsAppLink, getStoreSettings } from "@/lib/store-settings";
import { buildSeoMetadata, localBusinessSchema, storeSeo } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Contact Cycle Store Gandhinagar | The Funzo",
  description:
    "Contact The Funzo cycle and toy store in Raysan, Gandhinagar for kids cycles, bicycles, toys, directions and WhatsApp enquiries.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getStoreSettings();

  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <section className="bg-[#071018] px-6 py-20 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <article>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Contact The Funzo
            </p>
            <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
              Cycle and Toy Store in Raysan, Gandhinagar
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Visit The Funzo for kids cycles, bicycles, toys, ride-on toys and
              helpful local shopping support in Gandhinagar.
            </p>

            <address className="mt-8 not-italic text-slate-200">
              <strong className="text-white">The Funzo</strong>
              <br />
              {storeSeo.streetAddress}, {storeSeo.city}
              <br />
              {storeSeo.region} {storeSeo.postalCode}, India
              <br />
              <a
                className="mt-3 inline-block text-cyan-200"
                href={`tel:${settings.contact_number}`}
              >
                {settings.contact_number}
              </a>
            </address>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={buildWhatsAppLink(settings.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
              >
                Chat on WhatsApp
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35"
              >
                Browse Products
              </Link>
            </div>
          </article>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <iframe
              title="The Funzo Google Map in Raysan Gandhinagar"
              src={storeSeo.googleMapsEmbedUrl}
              width="100%"
              height="520"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
