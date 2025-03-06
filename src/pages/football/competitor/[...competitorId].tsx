/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { useEffect } from 'react';

import { decode } from '@/utils/hash.id';
import { useConvertPath } from '@/hooks/useConvertPath';

import Seo from '@/components/Seo';

import { useTeamStore } from '@/stores/team-store';


import { SPORT } from '@/constant/common';
import useTrans from '@/hooks/useTrans';
import CompetitorFootball from '@/modules/football/competitor/pages/Competitor';

interface Props {
  data: string;
}

interface Props {
  id: string;
  sport: string;
  teamDetails: any;
  players: any;
  teamUniqueTournaments: any;
  teamTransfers: any;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}

const CompetitorDetailedPage: NextPage<Props> = ({
  id,
  teamDetails,
  players,
  teamUniqueTournaments,
  teamTransfers,
}: Props) => {
  const { setSelectedStandingsTournament, setSelectedStandingsSeason } =
    useTeamStore();
  const i18n = useTrans();

  const path = useConvertPath();
  useEffect(() => {
    setSelectedStandingsTournament({});
    setSelectedStandingsSeason({});
  }, [setSelectedStandingsTournament, setSelectedStandingsSeason]);

  const contentSEO = (teamDetails: any) => {
    if (!teamDetails) {
      return {
        templateTitle: '',
        description: '',
      };
    }

    const templateTitle = i18n.seo.competitor.title.replaceAll(
      '{teamName}',
      teamDetails.name
    );
    const description = i18n.seo.competitor.description.replaceAll(
      '{domain}',
      `Uniscore.${path === 'vn' ? path : 'com'}`
    );

    const newId = decode(teamDetails?.id);
    const image = `${process.env.NEXT_PUBLIC_IMAGE_URL}/football/team/${newId}/image`
    return {
      templateTitle,
      description,
      image,
      isSquareImage: true,
    };
  };

  if (!id) {
    return <></>;
  }

  return (
    <>
      <Seo {...contentSEO(teamDetails)} />
      <CompetitorFootball
        id={id}
        teamDetails={teamDetails}
        players={players}
        teamUniqueTournaments={teamUniqueTournaments}
        teamTransfers={teamTransfers}
      />
    </>
  );
};

CompetitorDetailedPage.getInitialProps = async (
  context: NextPageContext
): Promise<Props> => {
  const { locale, query } = context;
  const competitorId = query.competitorId || [];
  const teamId = competitorId.at(-1);

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    // headers: { 'X-Custom-Header': 'foobar' },
  });

  const getTeamDetails = () => instance.get(`${SPORT.FOOTBALL}/team/${teamId}`);
  const getPlayers = () => instance.get(`${SPORT.FOOTBALL}/team/${teamId}/players`);
  const getTransfers = () => instance.get(`${SPORT.FOOTBALL}/team/${teamId}/transfers`);
  const getTournaments = () =>
    instance.get(`${SPORT.FOOTBALL}/team/${teamId}/unique-tournaments`);

  const fetchData = async () => {
    const responses = await Promise.allSettled([
      getTeamDetails(),
      getPlayers(),
      getTournaments(),
      getTransfers(),
    ]);

    const resData = responses.map((response, index) => {
      if (response.status === 'fulfilled') {
        return response.value.data.data;
      } else {
        return null;
      }
    });
    const teamDetails = resData[0]?.team || {};
    const players = resData[1] || {};
    const teamUniqueTournaments = resData[2];
    const teamTransfers = resData[3];

    return {
      teamDetails,
      players,
      teamUniqueTournaments,
      teamTransfers,
    };
  };

  const data: any = await fetchData()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return -1;
    });

  if (data === -1) {
    return {
      id: teamId,
      sport: 'soccer',
      ...data,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    id: teamId,
    sport: 'soccer',
    ...data,
  };
};

export default CompetitorDetailedPage;
