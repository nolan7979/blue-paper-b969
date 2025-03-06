import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';

import { PAGE, SPORT } from '@/constant/common';
import { MetaProps } from '@/models';
import BasketBallSubPage from '@/modules/hockey/liveScore/page';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';

const BasketballFixturesPage = ({ dataAPI, isDesktop }: MetaProps) => {
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
      <Seo title='Fixtures Ice Hockey page' />
      <BasketBallSubPage sport={SPORT.ICE_HOCKEY} page={PAGE.fixtures} isDesktop={isDesktopClient || isDesktop} />
    </>
  );
};

BasketballFixturesPage.Layout = MainLayout;

export default BasketballFixturesPage;


BasketballFixturesPage.getInitialProps = async (context: GetServerSidePropsContext) => {
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
      url: `${getAPIDetectedIP()}/sport/basketball/scheduled-events/${today}/offset/${getTimezoneOffset}`,
      headers: {},
    };
    // const response = await axios.request(config);



    return { isDesktop, };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { isDesktop, dataAPI: '' }; // Handle the case where fetching fails
  }
};
