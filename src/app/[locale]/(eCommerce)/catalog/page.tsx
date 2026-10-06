import { CategoryType } from "@/types/product";
import { getCategories } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { cn } from "@/lib/utils";
import Link from "@/components/elements/navigation";

// export async function generateMetadata(
//     { params }: {params: PageParamsType},
//     parent: ResolvingMetadata
//   ): Promise<Metadata> {
//     // read route params
//     const locale = (await params).locale

//     // fetch data
//     const product = await fetch(`https://.../${id}`).then((res) => res.json())

//     // optionally access and extend (rather than replace) parent metadata
//     const previousImages = (await parent).openGraph?.images || []

//     return {
//       title: product.title,
//       openGraph: {
//         images: ['/some-specific-page-image.jpg', ...previousImages],
//       },
//     }
//   }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Catalog({ params }: { params: Promise<{ locale: "uz" | "ru" }> }) {
  const locale = (await params).locale;

  setRequestLocale(locale);
  const data = getCategories();
  const mainCategories = data.filter((category) => category.status === "M");
  const additionalCategories = data.filter(
    (category) => category.status === "A"
  );
  return (
    <main className="max-md:px-3">
      <div className="container flex flex-wrap xl:gap-10 md:gap-6 max-md:gap-3">
        {mainCategories.map((category) => (
          <CatalogItem
            category={category}
            locale={locale}
            key={category.id}
            className="flex-1 min-w-[150px]"
            subClassName="xl:p-10 md:p-5 max-md:p-3 xl:pt-60 md:pt-40 max-md:pt-20 bg-gradient-to-b from-transparent to-[#000000be] from-60%"
          />
        ))}
      </div>
      <div className="container md:mt-20 max-md:mt-14 grid md:grid-cols-3 xs:grid-cols-2 max-xs:grid-cols-1 xl:gap-10 md:gap-6 max-md:gap-3">
        {additionalCategories.map((category) => (
          <CatalogItem
            category={category}
            locale={locale}
            key={category.id}
            className=""
            subClassName="xl:p-10 md:p-5 max-md:p-3 xl:py-20 md:py-14 max-md:py-8 text-end bg-gradient-to-r from-transparent to-[#000000be] from-30%"
          />
        ))}
      </div>
    </main>
  );
}

function CatalogItem({
  category,
  locale,
  className,
  subClassName,
}: {
  category: CategoryType;
  locale: "uz" | "ru";
  className?: string;
  subClassName?: string;
}) {
  return (
    <Link
      href={{ pathname: "/catalog/[slug]", params: { slug: category.id } }}
      className="flex-1"
    >
      <div
        className={cn(
          "xl:rounded-4xl md:rounded-3xl max-md:rounded-xl bg-center bg-cover",
          className
        )}
        style={{ backgroundImage: `url(${category.image})` }}
      >
        <div className={cn("w-full h-full xl:rounded-4xl md:rounded-3xl max-md:rounded-xl text-white xl:text-4xl md:text-3xl sm:text-2xl max-sm:text-lg", subClassName)}>
          {category[`name_${locale}`]}
        </div>
      </div>
    </Link>
  );
}
