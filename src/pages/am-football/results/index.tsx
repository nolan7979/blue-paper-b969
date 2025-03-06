import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getContentStaticPage } from '@/lib/getContentStatic';

import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';

import { CONTENT_SLUG } from '@/constant/contentStatic';
import { MetaProps } from '@/models';
import { getMetaContent } from '@/utils';

import { PAGE, SPORT } from '@/constant/common';
import AmericanFootballSubPage from '@/modules/am-football/liveScore/page';
import i18nConfig from '../../../../i18n.config';

const FootballResultsPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <AmericanFootballSubPage sport={SPORT.AMERICAN_FOOTBALL} page={PAGE.results} />
      <Tabs data={data} />
    </>
  );
};

FootballResultsPage.Layout = MainLayout;

export default FootballResultsPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;
  const data = await getContentStaticPage(
    CONTENT_SLUG[locale as 'vi' | 'en'].RESULT,
    locale
  );
  return {
    props: {
      data: data,
      ...(await serverSideTranslations(
        locale || 'en',
        ['common', 'football'],
        i18nConfig as never
      )),
    },
    revalidate: 1800,
  };
};
