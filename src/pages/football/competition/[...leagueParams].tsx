import axios from 'axios';
import { NextPage, NextPageContext } from 'next';

import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { decode } from '@/utils/hash.id';

import Seo from '@/components/Seo';

import { getMetaContent } from '@/utils';

import Tabs from '@/components/common/Tabs';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import LeagueDetailedSubPageFootball from '@/modules/football/competition/pages/LeagueParams';
import { useMemo } from 'react';

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
  const newId = decode(uniqueTournament?.id);
  const image = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/football/competition/${newId}/image`;
  }, [newId]);

  return (
    <>
      <Seo {...getMetaContent(data)} image={image} isSquareImage={true} />
      <LeagueDetailedSubPageFootball
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

  const url = `${getAPIDetectedIP()}/football/unique-tournament/${competitionId}`;
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

  const urlSeason = `${getAPIDetectedIP()}/football/unique-tournament/${competitionId}/seasons`;
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
      uniqueTournament: competitionData?.uniqueTournament || {},
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
    uniqueTournament: competitionData?.uniqueTournament || {},
    seasons: seasonData?.seasons || [],
    seasonCoverageInfo: seasonData?.seasonCoverageInfo || {},
  };
};

export default LeagueDetailedPage;
