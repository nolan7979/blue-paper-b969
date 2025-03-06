import { useMemo } from "react";

export const useLocale = (locale: string) => {
  const currentLocale = useMemo(() => locale && locale !== 'en' ? `/${locale}` : '', [locale]);
  return { currentLocale };
}