import { GetStaticProps } from 'next';

import { getContentStaticPage } from '@/lib/getContentStatic';

import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { MetaProps } from '@/models';
import FixturesResultsSubPageAMFootball from '@/modules/am-football/fixtures/page';
import { getMetaContent } from '@/utils';
import AmericanFootballSubPage from '@/modules/am-football/liveScore/page';

const FixturesPageAMFootball = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <AmericanFootballSubPage
        sport={SPORT.AMERICAN_FOOTBALL}
        page={PAGE.fixtures}
      />
      <Tabs data={data} />
    </>
  );
};

FixturesPageAMFootball.Layout = MainLayout;

export default FixturesPageAMFootball;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;
  const data = await getContentStaticPage(
    CONTENT_SLUG[locale as 'vi' | 'en'].FIXTURES,
    locale
  );
  return {
    props: {
      data: data,
    },
    revalidate: 60000,
  };
};
