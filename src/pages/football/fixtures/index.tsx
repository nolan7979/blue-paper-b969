import Seo from '@/components/Seo';
import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';
import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import LiveScoreComponent from '@/modules/football/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';

const FootballFixturesPage = ({
  data,
  isDesktop,
  dataAPI,
  featureData,
}: MetaProps) => {
  const [isDesktopClient, setIsDesktopClient] = useState<boolean | undefined>();

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
      <LiveScoreComponent
        page={PAGE.fixtures}
        sport={SPORT.FOOTBALL}
        isDesktop={isDesktopClient || isDesktop}
        matchesDefault={dataAPI}
        featureData={featureData}
      />
      {data && <Tabs data={data} />}
    </>
  );
};

FootballFixturesPage.Layout = MainLayout;

FootballFixturesPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  const { res } = context;
  let isDesktop = true;
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);
  //get today format yyyy-MM-dd
  const currentDate = new Date();
  // const today = currentDate.toISOString().split('T')[0];
  // const getTimezoneOffset = currentDate.getTimezoneOffset();

  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].FIXTURES,
      locale
    );

    return {
      data: data || {},
      isDesktop,
      // dataAPI: response.data.data.events || '',
      // featureData: responsev2.data.data.event,
    };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return {
      data: {},
      isDesktop,
      dataAPI: '',
      featureData: {},
    };
  }
};

export default FootballFixturesPage;
