import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';

import { PAGE } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import Tabs from '@/components/common/Tabs';
import BasketBallSubPage from '@/modules/basketball/liveScore/page';
import {
  getLocaleSEOContext,
  getMetaContent
} from '@/utils';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';

const BasketballFixturesPage = ({ data, isDesktop }: MetaProps) => {
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
        page={PAGE.fixtures}
        isDesktop={isDesktopClient || isDesktop}
      />
      <Tabs data={data} />
    </>
  );
};

BasketballFixturesPage.Layout = MainLayout;

export default BasketballFixturesPage;

BasketballFixturesPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  let isDesktop = true;
  const locale = getLocaleSEOContext(context.locale);
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);

  try {
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].FIXTURE_BKB,
      locale
    );
    const result = {
      data: data || {},
    };
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { isDesktop, dataAPI: '' }; // Handle the case where fetching fails
  }
};
