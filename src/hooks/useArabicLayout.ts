import { useMemo } from 'react';
import { useRouter } from 'next/router';

export const useArabicLayout = () => {
  const { locale } = useRouter();
  const isArabicLayout = useMemo(() => locale === 'ar-XA', [locale]);
  return isArabicLayout;
};
