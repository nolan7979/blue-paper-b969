import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import dynamic from 'next/dynamic';

import { getAPIDetectedIP } from '@/utils/detectIPAPI';

import Seo from '@/components/Seo';

import { getLocaleSEOContext, getMetaContent } from '@/utils';

import Tabs from '@/components/common/Tabs';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { MetaProps } from '@/models';
import React from 'react';

const LeagueDetailedSubPageVlb = dynamic(
  () => import('@/modules/volleyball/competition/page'),
  { ssr: false }
);

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



  return (
    <>
      <Seo {...getMetaContent(data)} />
      <LeagueDetailedSubPageVlb
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
  const { query } = context;
  const leagueParams = query.leagueParams || [];
  const competitionId = leagueParams.at(-1);


  const url = `${getAPIDetectedIP()}/volleyball/unique-tournament/${competitionId}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };
  const locale = getLocaleSEOContext(context.locale);
  const data = await getContentStaticPage(
    CONTENT_SLUG[locale as 'vi' | 'en'].STANDINGS_VOLLEYBALL,
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

  const urlSeason = `${getAPIDetectedIP()}/volleyball/unique-tournament/${competitionId}/seasons`;
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
    uniqueTournament: competitionData || {},
    seasons: seasonData?.seasons || [],
    seasonCoverageInfo: seasonData?.seasonCoverageInfo || {},
  };
};

export default LeagueDetailedPage;
