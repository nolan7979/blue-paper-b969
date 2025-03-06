import Seo from '@/components/Seo';
import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';
import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import LiveScoreComponent from '@/modules/cricket/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';

const CricketFixturesPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <LiveScoreComponent page={PAGE.fixtures} sport={SPORT.CRICKET} />
      {!data?.notFound && <Tabs data={data} />}
    </>
  );
};

CricketFixturesPage.Layout = MainLayout;

CricketFixturesPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const locale = getLocaleSEOContext(context.locale);

    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].FIXTURE_CRICKET,
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

export default CricketFixturesPage;
