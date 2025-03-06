import Tabs from '@/components/common/Tabs';
import Seo from '@/components/Seo';
import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import VolleyballSubPage from '@/modules/volleyball/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';

const VolleyballPage = ({  data }: MetaProps) => {

  return (
    <>
      <Seo {...getMetaContent(data)} />
      <VolleyballSubPage
        page={PAGE.liveScore}
        sport={SPORT.VOLLEYBALL}
      />
      <Tabs data={data} />
    </>
  );
};

VolleyballPage.Layout = VolleyballSubPage.Layout;

export default VolleyballPage;

VolleyballPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  let isDesktop = true;
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);

  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].HOME_VOLLEYBALL,
      locale
    );

    return {
      data,
      isDesktop,
    };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return {
      data: {},
      isDesktop,
      dataAPI: '',
      featureData: {},
    };
  }
};
