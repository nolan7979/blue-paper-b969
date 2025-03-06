import Seo from '@/components/Seo';
import { MainLayout } from '@/components/layout';
import { PAGE, SPORT } from '@/constant/common';
import { MetaProps } from '@/models';
import BasketBallSubPage from '@/modules/hockey/liveScore/page';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';

const FootballResultsPage = ({ isDesktop }: MetaProps) => {
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
      <Seo title='Ice Hockey results page' />
      <BasketBallSubPage
        sport={SPORT.ICE_HOCKEY}
        page={PAGE.results}
        isDesktop={isDesktopClient || isDesktop}
      />
    </>
  );
};

FootballResultsPage.Layout = MainLayout;

export default FootballResultsPage;

FootballResultsPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  const { res } = context;
  let isDesktop = true;
  const currentDate = new Date();
  const today = currentDate.toISOString().split('T')[0];
  const getTimezoneOffset = currentDate.getTimezoneOffset();
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);

  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/sport/hockey/scheduled-events/${today}/offset/${getTimezoneOffset}`,
      headers: {},
    };
    // const response = await axios.request(config);


    return { isDesktop, };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { isDesktop, dataAPI: '' }; // Handle the case where fetching fails
  }
};
