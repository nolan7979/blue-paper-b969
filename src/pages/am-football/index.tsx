import { GetServerSidePropsContext } from 'next';

import Seo from '@/components/Seo';

import AmericanFootballSubPage from '@/modules/am-football/liveScore/page';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { MetaProps } from '@/models';
import { useEffect, useState } from 'react';
import { PAGE, SPORT } from '@/constant/common';

const AmericanFootballPage = ({
  data,
  isDesktop,
  dataAPI,
  featureData,
}: MetaProps) => {
  const [isDesktopClient, setIsDesktopClient] = useState<boolean | undefined>(
    isDesktop
  );

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
      <Seo templateTitle='American Football' />
      <AmericanFootballSubPage
        isDesktop={isDesktopClient}
        matchesDefault={dataAPI}
        sport={SPORT.AMERICAN_FOOTBALL}
        page={PAGE.liveScore}
      />
    </>
  );
};

export default AmericanFootballPage;

AmericanFootballPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  const { res } = context;
  let isDesktop = true;
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);
  const currentDate = new Date();
  const today = currentDate.toISOString().split('T')[0];
  const getTimezoneOffset = currentDate.getTimezoneOffset();

  try {
    const locale = context.locale || 'en'; // Use the locale from context
    const configv2 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/football/featured-events`,
      headers: {},
    };
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/sport/football/scheduled-events/${today}/offset/${getTimezoneOffset}`,
      headers: {},
    };
    // const response = await axios.request(config);

    // const data = await getContentStaticPage(
    //   CONTENT_SLUG[locale as 'vi' | 'en'].HOME,
    //   locale
    // );

    // if (res) {
    //   res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=30, stale-while-revalidate=30');
    // }

    const result = {
      // data,
      isDesktop,
      // dataAPI: response.data.data.events || '',
      // featureData: responsev2.data.data.event,
    };
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: {}, isDesktop }; // Handle the case where fetching fails
  }
};
