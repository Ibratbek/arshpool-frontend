"use client";

import { useEffect } from "react";
import { defaultLocale } from "@/i18n/config";

// Static export has no middleware, so redirect `/` to the default locale in the browser.
export default function Root() {
  useEffect(() => {
    window.location.replace(`/${defaultLocale}/`);
  }, []);
  return (
    <noscript>
      <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}/`} />
    </noscript>
  );
}
