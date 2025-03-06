import Tabs from '@/components/common/Tabs';
import Seo from '@/components/Seo';
import { PAGE } from '@/constant/common';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { useParsedMatches } from '@/hooks/useParseMatches';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import BasketBallSubPage from '@/modules/basketball/liveScore/page';
import {
  getLocaleSEOContext,
  getMetaContent,
  parseMatchDataBasketBall,
} from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { GetServerSidePropsContext } from 'next';

const BasketBallPage = ({ isDesktop, dataAPI, data }: MetaProps) => {
  const { isDesktopClient } = useParsedMatches({
    parseMatchesData: parseMatchDataBasketBall,
    dataAPI: dataAPI,
  });
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <BasketBallSubPage
        isDesktop={isDesktopClient || isDesktop}
        page={PAGE.liveScore}
      />

      <Tabs data={data} />
    </>
  );
};

BasketBallPage.Layout = BasketBallSubPage.Layout;

export default BasketBallPage;

BasketBallPage.getInitialProps = async (context: GetServerSidePropsContext) => {
  const locale = getLocaleSEOContext(context.locale);
  let isDesktop = true;
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);

  try {
    const data = await getContentStaticPage(
      CONTENT_SLUG[locale as 'vi' | 'en'].HOME_BKB,
      locale
    );
    const result = {
      data: data || {},
    };
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { isDesktop }; // Handle the case where fetching fails
  }
};
