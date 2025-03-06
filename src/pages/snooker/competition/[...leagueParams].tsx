import axios from 'axios';
import { GetServerSidePropsContext, NextPage, NextPageContext } from 'next';

import { getAPIDetectedIP } from '@/utils/detectIPAPI';

import Seo from '@/components/Seo';

import { getMetaContent } from '@/utils';

import Tabs from '@/components/common/Tabs';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import LeagueDetailedSubPageSnooker from '@/modules/snooker/competition/pages/LeagueParams';

interface Props extends MetaProps {
  uniqueTournament: any;
  seasons: any;
  seasonCoverageInfo: any;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}

const LeagueDetailedPage: NextPage<Props> = ({
  uniqueTournament,
  seasons,
  data,
}: Props) => {
  const { name } = uniqueTournament || {};

  if (data) {
    data.yoast_head_json.og_title =
      data?.yoast_head_json?.og_title + ' - ' + name;
  }

  return (
    <>
      <Seo {...getMetaContent(data)} />
      <LeagueDetailedSubPageSnooker
        uniqueTournament={uniqueTournament}
        seasons={seasons}
      />
      <Tabs data={data} />
    </>
  );
};

LeagueDetailedPage.getInitialProps = async (
  context: NextPageContext
): Promise<Props> => {
  const { locale, query } = context;
  const leagueParams = query.leagueParams || [];
  const competitionId = leagueParams.at(-1);

  const url = `${getAPIDetectedIP()}/snooker/unique-tournament/${competitionId}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };

  const data = await getContentStaticPage(
    CONTENT_SLUG[locale as 'vi' | 'en'].STANDINGS,
    locale
  );

  const competitionData = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
      return -1;
    });

  const urlSeason = `${getAPIDetectedIP()}/snooker/unique-tournament/${competitionId}/seasons`;
  const configSeason = {
    method: 'get',
    maxBodyLength: Infinity,
    url: urlSeason,
    headers: {},
  };

  const seasonData = await axios
    .request(configSeason)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
      return -1;
    });

  if (seasonData === -1 || competitionData === -1) {
    return {
      data: data || {},
      uniqueTournament: competitionData || {},
      seasons: seasonData?.seasons || [],
      seasonCoverageInfo: seasonData?.seasonCoverageInfo || {},
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    data: data || {},
    uniqueTournament: competitionData || {},
    seasons: seasonData?.seasons || [],
    seasonCoverageInfo: seasonData?.seasonCoverageInfo || {},
  };
};

export default LeagueDetailedPage;
