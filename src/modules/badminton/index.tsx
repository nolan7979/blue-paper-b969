import Seo from '@/components/Seo';
import { PAGE } from '@/constant/common';
import { MetaProps } from '@/models';
import BadmintonSubPage from '@/modules/badminton/liveScore/page';
import { useHomeStore } from '@/stores';
import { useLivescoreStore } from '@/stores/liveScore-store';
import { parseMatchDataArrayBadminton } from '@/utils';
import axios from 'axios';

import { NextPageContext } from 'next';
import { useEffect, useState } from 'react';

const BadmintonPage = ({ isDesktop, dataAPI }: MetaProps) => {
  const [isDesktopClient, setIsDesktopClient] = useState<boolean | undefined>(
    isDesktop
  );

  let parsedMatches = [];
  const { setMatches, removeMatches, matches } = useHomeStore();
  const { removeAllLivescore } = useLivescoreStore();

  useEffect(() => {
    if (matches.length > 0) {
      removeMatches()
    }
    
    if (dataAPI) {
      parsedMatches = parseMatchDataArrayBadminton(dataAPI);
      setMatches(parsedMatches);
      removeAllLivescore();
    }
  }, [dataAPI]);

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
      <Seo templateTitle='Badminton' />
      <BadmintonSubPage isDesktop={isDesktopClient || isDesktop} page={PAGE.liveScore} />
    </>
  );
};

BadmintonPage.Layout = BadmintonSubPage.Layout;

export default BadmintonPage;


BadmintonPage.getInitialProps = async (context: NextPageContext) => {
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
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/badminton/scheduled-events/${today}/offset/${getTimezoneOffset}`,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    };
    const response = await axios.request(config);

    return {
      isDesktop, dataAPI: response.data.data.events || ''
    }
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { isDesktop, dataAPI: '' }; // Handle the case where fetching fails
  }
};
