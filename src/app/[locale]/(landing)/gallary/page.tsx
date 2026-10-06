import React from "react";
import { PageParamsType } from "@/types/page";
import { getProjects } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";

import GallaryGrid from "@/components/elements/gallary-grid";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Gallary({
  params,
}: {
  params: Promise<{ slug?: string; locale: "uz" | "ru" }>;
}): Promise<React.ReactElement> {
  const locale = (await params).locale as "uz" | "ru";
  setRequestLocale(locale);
  const data = getProjects();
  return (
    <main className="max-md:px-3">
      <div className="container flex flex-col gap-4 mb-16">
        {data.map((gallary) => (
          <GallaryGrid key={gallary.id} gallary={gallary} locale={locale} />
        ))}
      </div>
    </main>
  );
}
