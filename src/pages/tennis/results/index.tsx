

import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';

import { MetaProps } from '@/models';

import { PAGE, SPORT } from '@/constant/common';
import TennisSubPage from '@/modules/tennis/liveScore/page';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';

const TennisResultsPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <TennisSubPage sport={SPORT.TENNIS} page={PAGE.results} />
      <Tabs data={data} />
    </>
  );
};

TennisResultsPage.Layout = MainLayout;

TennisResultsPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].RESULT_TENNIS,
      locale
    );

    return { data: data };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: null };
  }
};

export default TennisResultsPage;

