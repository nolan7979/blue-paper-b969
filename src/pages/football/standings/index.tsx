import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';

import FootballBxhSubPage from '@/pages/football/standings/[...leagueId]';
import { getMetaContent } from '@/utils';
import { GetStaticProps } from 'next';

const FootballBxhPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <FootballBxhSubPage />
      {data && <Tabs data={data} />}
    </>
  );
};

FootballBxhPage.Layout = MainLayout;

export default FootballBxhPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;
  const data = await getContentStaticPage(
    CONTENT_SLUG[locale as 'vi' | 'en'].STANDINGS,
    locale
  );
  return {
    props: {
      data: data,
    },
    revalidate: 1800,
  };
};
