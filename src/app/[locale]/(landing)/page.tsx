import Addresses from "@/components/addresses";
import Faq from "@/components/faq";
import Hero from "@/components/hero";
import Partners from "@/components/partners";
import Products from "@/components/products";
import Projects from "@/components/projects";
import Services from "@/components/services";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return (
    <main className="max-md:px-3">
      <Hero />
      <Projects />
      <Services />
      <Partners />
      <Products />
      <Faq />
      <Addresses />
    </main>
  );
}
