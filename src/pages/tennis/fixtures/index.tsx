

import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';
import Tabs from '@/components/common/Tabs';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import TennisSubPage from '@/modules/tennis/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';


const TennisFixturesPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <TennisSubPage sport={SPORT.TENNIS} page={PAGE.fixtures} />
      <Tabs data={data} />
    </>
  );
};

TennisFixturesPage.Layout = MainLayout;

TennisFixturesPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].FIXTURE_TENNIS,
      locale
    );

    return { data: data };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: null };
  }
};

export default TennisFixturesPage;

