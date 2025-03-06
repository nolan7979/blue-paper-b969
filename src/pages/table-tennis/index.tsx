import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';
import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { useDetectedCountry } from '@/hooks/useDetectDevice';
import {
  useLocaleStatsDetailHead,
  useLocaleStatsHead,
} from '@/hooks/useFootball';
import { useScrollProgress } from '@/hooks/useScrollProgess';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import TableTennisSubPage from '@/modules/table-tennis/liveScore/page';
import { useScrollStore } from '@/stores/scroll-progess';
import { getLocaleSEOContext, getMetaContent } from '@/utils';

import { getItem, setItem } from '@/utils/localStorageUtils';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

const TableTennisPage = ({ data }: MetaProps) => {
  const { locale } = useRouter();
  // Fetch values from local storage and parse them
  const country = useMemo(() => getItem(LOCAL_STORAGE.countryDetect), []);
  const localeList = useMemo(() => getItem(LOCAL_STORAGE.localeList), []);
  const { isDesktop } = useDetectDeviceClient();
  const statsLocale = useMemo(
    () => getItem(LOCAL_STORAGE.statsLocaleDetail),
    []
  );
  const currentLocale = useMemo(() => getItem(LOCAL_STORAGE.currentLocale), []);

  const { data: dataDetected } = useDetectedCountry(!country);
  const { data: dataLocale } = useLocaleStatsHead();
  const { data: statsDetailData } = useLocaleStatsDetailHead(
    JSON.parse(currentLocale!)
  );

  //Store
  const {scrollProgress,setScrollProgress} = useScrollStore()
  const getScrollProgess= useScrollProgress({
    enableLogging: false,
    onProgressChange: (progress) => {
      // Do something with progress value
   
      if (progress === 100) {
        console.log('Reached bottom of page');
      }
    },
    throttleDelay: 50
  });

  useEffect(() => {
   
    if (getScrollProgess - (scrollProgress +1) >= 1 || scrollProgress - (getScrollProgess +1) >=0) {
      setScrollProgress(getScrollProgess);
    }
  }, [getScrollProgess]);
  useEffect(() => {
    if (dataDetected) {
      setItem(LOCAL_STORAGE.countryDetect, dataDetected.country);
    }
  }, [dataDetected]);

  useEffect(() => {
    if (
      dataLocale &&
      localeList &&
      dataLocale.length !== JSON.parse(localeList).length
    ) {
      setItem(LOCAL_STORAGE.localeList, JSON.stringify(dataLocale));
    }
  }, [dataLocale, localeList]);

  useEffect(() => {
    if (
      statsDetailData &&
      JSON.stringify(statsDetailData).length !== statsLocale?.length
    ) {
      setItem(LOCAL_STORAGE.statsLocaleDetail, JSON.stringify(statsDetailData));
    }
  }, [statsDetailData, statsLocale]);

  useEffect(() => {
    const parsedLocale = currentLocale && JSON.parse(currentLocale);
    if (parsedLocale !== locale) {
      setItem(LOCAL_STORAGE.currentLocale, JSON.stringify(locale));
    }
  }, [locale, currentLocale]);

  return (
    <>
      <Seo {...getMetaContent(data)} />
      <TableTennisSubPage
        sport={SPORT.TABLE_TENNIS}
        page={PAGE.liveScore}
        isDesktop={isDesktop}
      />
      <Tabs data={data} />
    </>
  );
};

TableTennisPage.Layout = MainLayout;

TableTennisPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].HOME_TT,
      locale
    );

    return { data: data };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: null }; // Handle the case where fetching fails
  }
};

export default TableTennisPage;
