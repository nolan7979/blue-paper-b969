import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import { GlobalStyles } from 'twin.macro';

import '@/styles/customize.scss';
import '@/styles/globals.css';

import { generateQueryClient } from '@/lib';

import { MainLayout } from '@/components/layout';
import ReloadAtMidnight from '@/components/ReloadAtMidnight';
import { ToastProvider } from '@/components/toast/ToastProvider';

import SuggestionsDownload from '@/components/layout/SuggestionDownload';
import { LOCAL_STORAGE } from '@/constant/common';
import { useDetectDeviceClient, useSportName } from '@/hooks';
import { AppPropsWithLayout } from '@/models';
import { useMatchStore } from '@/stores';
import { getItem, setItem } from '@/utils/localStorageUtils';
import { useRouter } from 'next/router';
// import { useRouter } from 'next/router';

function MyApp({
  Component,
  pageProps: { session, _nextI18Next = {}, ...pageProps },
}: AppPropsWithLayout) {
  const [queryClient] = useState(() => generateQueryClient());
  const sport = useSportName();
  const router = useRouter();
  const { setMatchDetails } = useMatchStore();
  const {isDesktop } = useDetectDeviceClient();

  useEffect(() => {
    setMatchDetails(null);
  }, [sport]);

  useEffect(() => {
    const hasCleared = localStorage.getItem('has_cleared_storage');
    if (!hasCleared) {
      localStorage.clear();
      localStorage.setItem('has_cleared_storage', 'true');
    }
  }, []);

  useEffect(() => {
    const savedLocale = getItem(LOCAL_STORAGE.currentLocale);
    const currentLocale = (savedLocale && JSON.parse(savedLocale)) || 'en';
    const defaultLocale = router.locale || 'en';

    // Save locale if not already saved
    if (!savedLocale) {
      setItem(LOCAL_STORAGE.currentLocale, JSON.stringify(defaultLocale));
      router.push(router.asPath, router.asPath, { locale: defaultLocale });
      return;
    }

    // Update route if saved locale differs from current
    if (currentLocale !== router.locale) {
      const options = { locale: currentLocale };
      router.push(router.asPath, router.asPath, options);
    }
  }, [router.locale, router.asPath]);

  // useFcmToken(); // Hook lấy FCM token

  return (
    <ThemeProvider attribute='class' defaultTheme='dark'>
      <ReloadAtMidnight />
      <SessionProvider session={session}>
        <ToastProvider>
          <GlobalStyles />
          <QueryClientProvider client={queryClient}>
            {!isDesktop && <SuggestionsDownload />}
            <MainLayout isDesktop={isDesktop}>
              <Component {...pageProps} />
            </MainLayout>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ToastProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
