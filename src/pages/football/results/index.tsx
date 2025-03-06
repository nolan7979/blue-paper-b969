import { GetServerSidePropsContext } from 'next';

import { getContentStaticPage } from '@/lib/getContentStatic';

import Tabs from '@/components/common/Tabs';
import Seo from '@/components/Seo';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { MetaProps } from '@/models';
import LiveScoreComponent from '@/modules/football/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import axios from 'axios';
import { useEffect, useState } from 'react';

const FootballResultsPage =({ data, isDesktop, dataAPI, featureData }: MetaProps) => {
  const [isDesktopClient, setIsDesktopClient] = useState<boolean | undefined>()

  useEffect(() => {
    // Function to update isDesktop based on current window width
    const handleResize = () => {
      setIsDesktopClient(window.innerWidth >= 768);
    };

    // Check on initial render if on client
    handleResize();

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Seo {...getMetaContent(data)} />
      <LiveScoreComponent page={PAGE.results} sport={SPORT.FOOTBALL} 
        isDesktop={isDesktopClient || isDesktop}
        matchesDefault={dataAPI} 
        featureData={featureData}
        />
      <Tabs data={data} />
    </>
  );
};

// FootballResultsPage.Layout = MainLayout;

FootballResultsPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  const { res } = context;
  let isDesktop = true;
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);
  //get today format yyyy-MM-dd
  const currentDate = new Date();
  const today = currentDate.toISOString().split('T')[0];
  const getTimezoneOffset = currentDate.getTimezoneOffset();

  try {
    const locale = getLocaleSEOContext(context.locale);
    const configv2 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/football/featured-events`,
      headers: {},
    };

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/football/scheduled-events/${today}/offset/${getTimezoneOffset}`,
      headers: {},
    };

    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].RESULT,
      locale
    );
    // if (res) {
    //   res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=30, stale-while-revalidate=30');
    // }

    return {
      data: data || {},
      isDesktop,
      // dataAPI: response.data.data.events || '',
      // featureData: responsev2.data.data.event,
    }
  } catch (error) {
    console.error('Error fetching static content:', error);
    return {
      data: {},
      isDesktop,
      dataAPI: '',
      featureData: {},
    }
  }
};


export default FootballResultsPage;

