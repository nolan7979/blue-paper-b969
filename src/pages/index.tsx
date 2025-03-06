import { GetServerSidePropsContext } from 'next';

import { getContentStaticPage } from '@/lib/getContentStatic';

import Tabs from '@/components/common/Tabs';
import Seo from '@/components/Seo';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { MetaProps } from '@/models';
import LiveScoreComponent from '@/modules/football/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import axios from 'axios';

const HomePage = ({ data, dataAPI, featureData }: MetaProps & { version: number }) => {

  return (
    <>
      <Seo {...getMetaContent(data)} />
      <LiveScoreComponent
        sport={SPORT.FOOTBALL}
        page={PAGE.liveScore}
        matchesDefault={dataAPI}
        featureData={featureData}
      />
      {!data?.notFound && <Tabs data={data} />}
    </>
  );
};

export default HomePage;

HomePage.getInitialProps = async (context: GetServerSidePropsContext) => {
  const currentDate = new Date();
  const today = currentDate.toISOString().split('T')[0];
  const getTimezoneOffset = currentDate.getTimezoneOffset();
  const timestamp = new Date().getTime();

  try {
    const locale = getLocaleSEOContext(context.locale);
    const configv2 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/football/featured-events/locale/${locale}?timestamp=${timestamp}`,
      headers: {},
    };
  
    const [responsev2] = await Promise.all([
      axios.request(configv2),
    ]);

    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].HOME,
      locale
    );

    const result = {
      data: data || {},
      // dataAPI: response.data.data.events || '',
      featureData: responsev2.data.data.event,
    }
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: {}, dataAPI: '', featureData: {} }; // Handle the case where fetching fails
  }
};
