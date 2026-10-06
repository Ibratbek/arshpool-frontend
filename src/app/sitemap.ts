import {MetadataRoute} from 'next';
import {Locale, getPathname, routing} from '@/i18n/routing';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [getEntry('/'), getEntry('/products'), getEntry('/catalog')];
}

type Href = Parameters<typeof getPathname>[0]['href'];

function getEntry(href: Href) {
  return {
    url: getUrl(href, routing.defaultLocale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, getUrl(href, locale)])
      )
    }
  };
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({locale, href});
  return "https://arshpool.uz" + pathname;
}