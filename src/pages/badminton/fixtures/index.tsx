

import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import BadmintonSubPage from '@/modules/badminton/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { NextPageContext } from 'next';


const BadmintonFixturesPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <BadmintonSubPage page={PAGE.fixtures}  sport={SPORT.BADMINTON}/>
      <Tabs data={data} />
    </>
  );
};

BadmintonFixturesPage.Layout = MainLayout;

BadmintonFixturesPage.getInitialProps = async (context: NextPageContext) => {

  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].FIXTURE_BADMINTON,
      locale
    );

    return { data: data };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: null }; // Handle the case where fetching fails
  }
};


export default BadmintonFixturesPage;

