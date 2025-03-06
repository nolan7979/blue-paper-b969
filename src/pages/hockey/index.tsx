import Seo from '@/components/Seo';
import { PAGE, SPORT } from '@/constant/common';
import { useParsedMatches } from '@/hooks/useParseMatches';
import { MetaProps } from '@/models';
import IceHockeySubPage from '@/modules/hockey/liveScore/page';
import { parseMatchDataBasketBall } from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { GetServerSidePropsContext } from 'next';

const IceHockeyPage = ({ isDesktop, dataAPI }: MetaProps) => {
  const { isDesktopClient } = useParsedMatches({
    parseMatchesData: parseMatchDataBasketBall,
    dataAPI: dataAPI,
  });
  return (
    <>
      <Seo templateTitle='Ice Hockey' description='Ice Hockey'/>
      <IceHockeySubPage
        isDesktop={isDesktopClient || isDesktop}
        page={PAGE.liveScore}
        sport={SPORT.ICE_HOCKEY}
      />
    </>
  );
};

IceHockeyPage.Layout = IceHockeySubPage.Layout;

export default IceHockeyPage;

IceHockeyPage.getInitialProps = async (context: GetServerSidePropsContext) => {
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

   

    return { isDesktop };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { isDesktop }; // Handle the case where fetching fails
  }
};
