import Seo from '@/components/Seo';
import { MainLayout } from '@/components/layout';
import { PAGE, SPORT } from '@/constant/common';
import Tabs from '@/components/common/Tabs';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import BasketBallSubPage from '@/modules/basketball/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';

const BasketballResultsPage = ({ dataAPI, isDesktop, data }: MetaProps) => {
  const [isDesktopClient, setIsDesktopClient] = useState<boolean | undefined>(
    isDesktop
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopClient(window.innerWidth >= 768);
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <BasketBallSubPage
        sport={SPORT.BASKETBALL}
        page={PAGE.results}
        isDesktop={isDesktopClient || isDesktop}
      />
      <Tabs data={data} />
    </>
  );
};

BasketballResultsPage.Layout = MainLayout;

export default BasketballResultsPage;

BasketballResultsPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  const locale = getLocaleSEOContext(context.locale);
  let isDesktop = true;
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);

  try {
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].RESULT_BKB,
      locale
    );
    const result = {
      data: data || {},
    };
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { isDesktop, data: '' }; // Handle the case where fetching fails
  }
};
