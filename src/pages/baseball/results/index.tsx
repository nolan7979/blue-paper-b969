import Tabs from '@/components/common/Tabs';
import Seo from '@/components/Seo';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import BaseballSubPage from '@/modules/baseball/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';

const BaseballResultsPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <BaseballSubPage sport={SPORT.BASEBALL} page={PAGE.results} />
      {!data?.notFound && <Tabs data={data} />}
    </>
  );
};

BaseballResultsPage.Layout = BaseballSubPage.Layout;

export default BaseballResultsPage;

BaseballResultsPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const locale = getLocaleSEOContext(context.locale);

    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].RESULT_BASEBALL,
      locale
    );

    const result = {
      data: data || {},
    };
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: {}, dataAPI: '', featureData: {} }; // Handle the case where fetching fails
  }
};
