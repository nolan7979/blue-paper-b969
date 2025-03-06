

import { MainLayout } from '@/components/layout';
import Seo from '@/components/Seo';

import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import TableTennisSubPage from '@/modules/table-tennis/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';
  
const TableTennisFixturesPage = ({ data }: MetaProps) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <TableTennisSubPage sport={SPORT.TABLE_TENNIS} page={PAGE.fixtures} />
    </>
  );
};

TableTennisFixturesPage.Layout = MainLayout;

TableTennisFixturesPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].FIXTURE_TT,
      locale
    );

    return { data: data };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: null }; // Handle the case where fetching fails
  }
};
export default TableTennisFixturesPage;
