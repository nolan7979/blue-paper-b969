

import Tabs from '@/components/common/Tabs';
import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';

import { MetaProps } from '@/models';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import TableTennisSubPage from '@/modules/table-tennis/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';

const TableTennisResultsPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <TableTennisSubPage sport={SPORT.TABLE_TENNIS} page={PAGE.results} />
      <Tabs data={data} />
    </>
  );
};

TableTennisResultsPage.Layout = MainLayout;

TableTennisResultsPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].RESULT_TT,
      locale
    );

    return { data: data };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: null }; // Handle the case where fetching fails
  }
};

export default TableTennisResultsPage;
