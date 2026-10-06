import ProductDetail from "@/components/elements/product-detail";
import ProductSlider from "@/components/elements/product-slider";
import { getProductDetail, getProductIds } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    // Next requires at least one param for static export; "0" renders 404 when no products exist.
    (getProductIds().length ? getProductIds() : ["0"]).map((id) => ({ locale, id }))
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string, locale: "uz" | "ru" }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const locale = (await params).locale
  const id = (await params).id

  const data = getProductDetail(id);
  if (!data) return {};

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: data[`name_${locale}`],
    description: data[`description_${locale}`],
    openGraph: {
      images: data.images.map((image) => image.source),
    },
  }
}

export default async function Product({
  params,
}: {
  params: Promise<{ id: string, locale: "uz" | "ru" }>;
}): Promise<React.ReactElement> {

  const id = (await params).id;
  setRequestLocale((await params).locale);
  const data = getProductDetail(id);
  if (!data) notFound();

  return (
    <main className="max-md:px-3">
      <div className="container flex max-lg:flex-col max-md:gap-10 md:gap-3 lg:gap-8 xl:gap-10 2xl:gap-14">
        <ProductSlider images={data.images} />
        <ProductDetail product={data} locale={(await params).locale} />
      </div>
    </main>
  );
}
