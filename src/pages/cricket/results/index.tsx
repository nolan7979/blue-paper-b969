import { GetServerSidePropsContext } from 'next';

import { getContentStaticPage } from '@/lib/getContentStatic';

import Tabs from '@/components/common/Tabs';
import Seo from '@/components/Seo';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { MetaProps } from '@/models';
import LiveScoreComponent from '@/modules/cricket/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';

const CricketResultsPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <LiveScoreComponent page={PAGE.results} sport={SPORT.CRICKET} />
      {!data?.notFound && <Tabs data={data} />}
    </>
  );
};

CricketResultsPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const locale = getLocaleSEOContext(context.locale);

    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].RESULT_CRICKET,
      locale
    );

    const result = {
      data: data || {},
    };
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: {} }; // Handle the case where fetching fails
  }
};

export default CricketResultsPage;
