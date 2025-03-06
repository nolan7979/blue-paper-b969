import Tabs from '@/components/common/Tabs';
import Seo from '@/components/Seo';
import { PAGE, SPORT } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { useDetectDeviceClient } from '@/hooks';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import BadmintonSubPage from '@/modules/badminton/liveScore/page';
import { getLocaleSEOContext, getMetaContent } from '@/utils';
import { GetServerSidePropsContext } from 'next';

const BadmintonPage = ({ data }: MetaProps) => {
  const {isDesktop} = useDetectDeviceClient();

  return (
    <>
      <Seo {...getMetaContent(data)} />
      <BadmintonSubPage
        isDesktop={isDesktop}
        page={PAGE.liveScore}
        sport={SPORT.BADMINTON}
      />
      <Tabs data={data} />
    </>
  );
};

BadmintonPage.Layout = BadmintonSubPage.Layout;

export default BadmintonPage;

BadmintonPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  try {
    const locale = getLocaleSEOContext(context.locale);
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].HOME_BADMINTON,
      locale
    );

    return { data: data };
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { data: null }; // Handle the case where fetching fails
  }
};
