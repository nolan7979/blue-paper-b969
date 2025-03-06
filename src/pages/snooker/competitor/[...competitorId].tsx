/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { useEffect, useState } from 'react';

import { useConvertPath } from '@/hooks/useConvertPath';

import {
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';

import { useTeamStore } from '@/stores/team-store';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep, Select } from '@/components/common';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { groupByUniqueTournamentShow } from '@/utils/matchFilter';
import React from 'react';
import StarBlank from '/public/svg/star-blank.svg';
import { SPORT } from '@/constant/common';
import { getSlug } from '@/utils';
import dynamic from 'next/dynamic';
import Seo from '@/components/Seo';
import { MatchRowIsolated } from '@/components/modules/snooker/match/MatchRowIsolated';
import { useStandingSeasonData } from '@/hooks/useCommon';
import { useFollowStore } from '@/stores/follow-store';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { LeagueRow } from '@/modules/snooker/competitor/components/LeagueRow';
import { FeaturedMatch } from '@/modules/snooker/competitor/components/FeaturedMatch';
import LeagueRowMatch from '@/modules/snooker/competitor/components/LeagueRowMatch';
import { AllLeague } from '@/modules/snooker/competitor/components/AllLeague';

interface Props {
  data: string;
}

interface Props {
  id: string;
  sport: string;
  teamDetails: any;
  featuredEvents: any;
  teamUniqueTournaments: any;
  listMatchHistory: any;
  listMatchFuture: any;
  standingSeason: any;
  seasonBracket: any;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}

const CompetitorDetailedPage: NextPage<Props> = ({
  id,
  teamDetails,
  featuredEvents,
  teamUniqueTournaments,
  listMatchHistory,
  listMatchFuture,
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

    return {
      templateTitle,
      description,
    };
  };

  const firstTournament = teamUniqueTournaments && teamUniqueTournaments?.uniqueTournaments.length > 0 ? teamUniqueTournaments?.uniqueTournaments[0] : {}
  // get list team from list standings
  const [dataTeam, setDataTeam] = useState([teamDetails])

  // const getDataTeam = (data: any) => {
  //   const firstData = data.length > 0 ? data[0].rows : []
  //   setDataTeam(firstData.map((it: any) => it.team).filter((idFil: any) => idFil.id !== teamDetails.id))
  // }

  if (!id) {
    return <></>;
  }

  return (
    <div>
      <Seo {...contentSEO(teamDetails)} />

      <div className='layout hidden lg:block'>
        <BreadCrumb className='no-scrollbar overflow-x-scroll py-5'>
          <BreadCumbLink href='/snooker' name={i18n.header.snooker} />
          {/* <BreadCrumbSep />
          <BreadCumbLink
            href={`/snooker/competition/${getSlug(firstTournament?.name)}/${firstTournament?.id}`}
            name={firstTournament?.name}
          /> */}
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/snooker/competitor/${teamDetails?.name}/${teamDetails?.id}}`}
            name={teamDetails?.name}
            isEnd
          />
        </BreadCrumb>
      </div>
      <div className='flex w-full'>
        <div className='layout w-full gap-6 flex transition-all duration-150 lg:flex-row'>
          <TwFilterCol className='flex-shrink-1 no-scrollbar sticky top-20 w-full max-w-[209px] lg:h-[91vh] lg:overflow-y-scroll'>
            <TwFilterTitle className='font-oswald'>
              {i18n.clubs.youMayBe}
            </TwFilterTitle>
            <AllLeague leagueData={dataTeam} type="competitor" idLeague={teamDetails.id} />
          </TwFilterCol>
          <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
            <TwMainCol className='!col-span-2'>
              <div className='h-full overflow-hidden'>
                <div className='flex w-full flex-col'>
                  <TeamCard clubData={teamDetails} />
                  <MatchCard listMatchHistory={listMatchHistory} listMatchFuture={listMatchFuture} teamDetails={teamDetails} />
                </div>
              </div>
            </TwMainCol>

            <TwQuickViewCol className='col-span-1 sticky top-20 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
              <div className='flex w-full flex-col gap-6'>
                <FeaturedMatch match={featuredEvents || ({} as SportEventDtoWithStat)} />
              </div>
            </TwQuickViewCol>
          </div>
        </div>
      </div>
    </div>
  );
};

CompetitorDetailedPage.getInitialProps = async (
  context: NextPageContext
): Promise<Props> => {
  const { locale, query } = context;
  const competitorId = query.competitorId || [];
  const teamId = competitorId.at(-1);
  const teamName = competitorId[0];


  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' },
  });

  const getTeamDetails = () => instance.get(`snooker/team/${teamId}`);
  const getFeaturedEvent = () => instance.get(`snooker/team/${teamId}/featured-events`);
  const getListMatchHistory = () => instance.get(`snooker/team/${teamId}/events/last/0`);

  const fetchData = async () => {
    const responses = await Promise.allSettled([
      getTeamDetails(),
      getFeaturedEvent(),
      getListMatchHistory(),
    ]);

    const resData = responses.map((response, index) => {
      if (response.status === 'fulfilled') {
        return response.value.data.data;
      } else {
        return null;
      }
    });

    const teamDetails = resData[0] || {};
    const featuredEvents = resData[1] || {};
    const listMatchHistory = resData[2];

    return {
      teamDetails: {
        id: teamId,
        name: teamName,
        ...teamDetails
      },
      featuredEvents,
      listMatchHistory,
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
      sport: SPORT.SNOOKER,
      ...data,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    id: teamId,
    sport: SPORT.SNOOKER,
    ...data,
  };
};

export default CompetitorDetailedPage;

const TeamCard = ({ clubData }: any) => {
  const sportType = SPORT.SNOOKER;

  const { teamFollowed } = useFollowStore((state) => ({
    teamFollowed: state.followed.teams,
  })); // get player follow from state

  const { addTeam, removeTeam } = useFollowStore();
  const [isFollowedTeam, setIsFollowedTeam] = useState(false);
  useEffect(() => {
    const playerSport = teamFollowed[sportType]
      ? teamFollowed[sportType]
      : [];
    const isFollowed = playerSport.some((item) => item?.id === clubData?.id);
    setIsFollowedTeam(isFollowed);
  }, [clubData, teamFollowed, sportType]);
  const changeFollow = () => {
    const newTeam = { id: clubData?.id, name: clubData.name, slug: clubData.slug };
    if (!isFollowedTeam) {
      addTeam(sportType, newTeam);
    } else {
      removeTeam(sportType, newTeam);
    }
  };
  return (
    <div className='w-full dark-away-score lg:custom-bg-white lg:dark:bg-dark-stadium px-4 relative flex items-center justify-center lg:rounded-md h-[162px] mb-6'>
      <div className='absolute right-4 top-3' onClick={changeFollow}>
        {isFollowedTeam ? <StarYellowNew className='h-6 w-6' /> :<StarBlank className='h-6 w-6' />}
      </div>
      <div className='flex items-center gap-3'>
        <Avatar
          id={clubData?.id}
          type='team'
          width={90}
          height={90}
          sport={SPORT.SNOOKER}
          isBackground={false}
          rounded={false}
        />
        <h3 className='text-2xl font-semibold font-oswald capitalize text-white lg:text-black lg:dark:text-white mb-2'>{clubData?.name}</h3>
      </div>
    </div>
  )
}

const MatchCard = ({ listMatchHistory, listMatchFuture, teamDetails }: any) => {
  const i18n = useTrans();
  const events = listMatchHistory?.events || [];
  const eventFuture = listMatchFuture?.events || [];
  const allEvent = [...eventFuture, ...events]

  const dataMatch = allEvent ? groupByUniqueTournamentShow(allEvent) : [];
  const onClick = (match: SportEventDtoWithStat) => {
    window.location.href = `/${SPORT.SNOOKER}/match/${match.slug}/${match.id}`;
  };
  if (allEvent && allEvent.length == 0) return <></>
  return (
    <div className='bg-white dark:bg-dark-wrap-match rounded-md p-4'>
      <h2 className='font-bold text-[14px] text-black dark:text-white uppercase mb-4'>{i18n.titles.matches}</h2>
      <div className='w-full'>
        <ul className='space-y-1.5 pr-1'>
          {dataMatch.map((group, idx) => (
            <React.Fragment key={`group-${idx}`}>
              {group.matches.map(
                (match: SportEventDtoWithStat, matchIdx: any) => {
                  return (
                    <React.Fragment key={`match-${match?.id}`}>
                      {matchIdx === 0 && (
                        <LeagueRowMatch
                          match={match}
                        />
                      )}
                      <MatchRowIsolated
                        isDetail={false}
                        match={match}
                        i18n={i18n}
                        homeSound=''
                        selectedMatch={null}
                        showSelectedMatch={false}
                        onClick={onClick}
                        sport={SPORT.SNOOKER}
                        h2HFilter='home'
                      />
                    </React.Fragment>
                  );
                }
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  )
}