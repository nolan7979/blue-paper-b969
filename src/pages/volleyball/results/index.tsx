

import Seo from '@/components/Seo';

import { MetaProps } from '@/models';
import { getLocaleSEOContext, getMetaContent } from '@/utils';

import { PAGE } from '@/constant/common';
import VolleyballSubPage from '@/modules/volleyball/liveScore/page';
import { GetServerSidePropsContext } from 'next';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import Tabs from '@/components/common/Tabs';

const FootballResultsPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <VolleyballSubPage page={PAGE.results} />
      <Tabs data={data} />
    </>
  );
};


export default FootballResultsPage;

FootballResultsPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  let isDesktop = true;
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);

  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].RESULT_VOLLEYBALL,
      locale
    );

    return {
      data,
      isDesktop,
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
