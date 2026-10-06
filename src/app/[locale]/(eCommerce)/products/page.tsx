import { getProducts } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import ProductFilterGrid from "@/components/elements/product-filter-grid";
import { Metadata, ResolvingMetadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: "uz" | "ru" }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const locale = (await params).locale

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
  const title = locale === "uz" ? "Arshpool barcha mahsulotlari" : "Все товары Arshpool"
  const desc = locale === "uz" ? "Arshpool barcha mahsulotlari" : "Все товары Arshpool"

  return {
    title: title,
    description: desc,
    openGraph: {
      images: ['/icon.png', ...previousImages],
    },
  }
}

export default async function Products({ params }: { params: Promise<{ locale: "uz" | "ru" }> }) {
  const locale = (await params).locale;
  setRequestLocale(locale);
  const data = getProducts();
  return (
    <main className="max-md:px-3">
      <Suspense>
        <ProductFilterGrid data={data} locale={locale} />
      </Suspense>
    </main>
  );
}
