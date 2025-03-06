import Seo from '@/components/Seo';
import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import BaseballSubPage from '@/modules/baseball/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';

const BaseballFixturesPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <BaseballSubPage sport={SPORT.BASEBALL} page={PAGE.fixtures} />
      {!data?.notFound && <Tabs data={data} />}
    </>
  );
};

BaseballFixturesPage.Layout = MainLayout;

export default BaseballFixturesPage;


BaseballFixturesPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  try {
    const locale = getLocaleSEOContext(context.locale);

    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].FIXTURE_BASEBALL,
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
