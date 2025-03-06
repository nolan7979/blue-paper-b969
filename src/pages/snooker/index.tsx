import Seo from '@/components/Seo';
import Tabs from '@/components/common/Tabs';
import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { useScrollProgress } from '@/hooks/useScrollProgess';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import LiveScoreComponent from '@/modules/snooker/liveScore/page';
import { useScrollStore } from '@/stores/scroll-progess';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';

const SnookerPage = ({ data, dataAPI }: MetaProps) => {
  const [isDesktopClient, setIsDesktopClient] = useState<boolean>(true);
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
        sport={SPORT.SNOOKER}
        page={PAGE.liveScore}
      />
      {!data?.notFound && <Tabs data={data} />}
    </>
  );
};

export default SnookerPage;

SnookerPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  const currentDate = new Date();
  const today = currentDate.toISOString().split('T')[0];
  const getTimezoneOffset = currentDate.getTimezoneOffset();
  const timestamp = new Date().getTime();

  try {
    const locale = getLocaleSEOContext(context.locale);
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/sport/snooker/scheduled-events/${today}/offset/${getTimezoneOffset}?timestamp=${timestamp}`,
      headers: {},
    };

    const response = await axios.request(config);

    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].HOME,
      locale
    );

    const result = {
      data: data || {},
      dataAPI: response.data.data.events || '',
    }
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: {}, dataAPI: '', featureData: {} }; // Handle the case where fetching fails
  }
};
