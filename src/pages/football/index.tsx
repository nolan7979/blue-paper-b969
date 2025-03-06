import Seo from '@/components/Seo';
import Tabs from '@/components/common/Tabs';
import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import LiveScoreComponent from '@/modules/football/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';

const FootballPage = ({ data, dataAPI, featureData }: MetaProps) => {
  const [isDesktopClient, setIsDesktopClient] = useState<boolean>(true);

  useEffect(() => {
   const getUserAgent = window.navigator.userAgent;
   const isDesktop = !/mobile|android|iphone|ipad/i.test(getUserAgent);
   setIsDesktopClient(isDesktop);
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
      <LiveScoreComponent
        isDesktop={isDesktopClient}
        matchesDefault={dataAPI}
        sport={SPORT.FOOTBALL}
        page={PAGE.liveScore}
        featureData={featureData}
      />
      {!data?.notFound && <Tabs data={data} />}
    </>
  );
};

export default FootballPage;

FootballPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  const currentDate = new Date();
  const today = currentDate.toISOString().split('T')[0];
  const getTimezoneOffset = currentDate.getTimezoneOffset();
  const timestamp = new Date().getTime();

  try {
    const locale = getLocaleSEOContext(context.locale);
    const configv2 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/football/featured-events/locale/${locale}?timestamp=${timestamp}`,
      headers: {},
    };
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/sport/football/scheduled-events/${today}/offset/${getTimezoneOffset}?timestamp=${timestamp}`,
      headers: {},
    };

    const [responsev2, response] = await Promise.all([
      axios.request(configv2),
      axios.request(config),
    ]);

    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].HOME,
      locale
    );

    const result = {
      data: data || {},
      dataAPI: response.data.data.events || '',
      featureData: responsev2.data.data.event,
    }
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: {}, dataAPI: '', featureData: {} }; // Handle the case where fetching fails
  }
};
