/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import { useLocaleStatsDetailHead } from '@/hooks/useFootball';
import { getContentStaticPage } from '@/lib/getContentStatic';

import Tabs from '@/components/common/Tabs';
import Seo from '@/components/Seo';

import { LOCAL_STORAGE, PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { MetaProps } from '@/models';
import LiveScoreComponent from '@/modules/cricket/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';

const HomePage = ({ data }: MetaProps) => {
  const { locale } = useRouter();

  const currentLocale = useMemo(
    () => getItem(LOCAL_STORAGE.currentLocale),
    [locale]
  );

  const { data: statsDetailData } = useLocaleStatsDetailHead(
    JSON.parse(currentLocale!) || locale
  );

  const statsLocale = useMemo(
    () => getItem(LOCAL_STORAGE.statsLocaleDetail),
    [currentLocale, locale]
  );

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
      <LiveScoreComponent sport={SPORT.CRICKET} page={PAGE.liveScore} />
      {!data?.notFound && <Tabs data={data} />}
    </>
  );
};

export default HomePage;

HomePage.getInitialProps = async (context: GetServerSidePropsContext) => {
  try {
    const locale = getLocaleSEOContext(context.locale);

    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].HOME_CRICKET,
      locale
    );

    const result = {
      data: data || {},
    };
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: {} }; // Handle the case where fetching fails
  }
};
