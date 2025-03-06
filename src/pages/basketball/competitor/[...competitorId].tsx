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

import { AllLeague } from '@/modules/basketball/competior/components';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep, Select } from '@/components/common';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { SelectLeague } from '@/components/common/selects/SelectLeague';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { getFavoriteType, getSportType, groupByTournamentShow } from '@/utils/matchFilter';
import React from 'react';
import StarBlank from '/public/svg/star-blank.svg';
import { SPORT } from '@/constant/common';
import { getAgeFromTimestamp, getSlug } from '@/utils';
import dynamic from 'next/dynamic';
import Seo from '@/components/Seo';
import { FeaturedMatch } from '@/components/modules/basketball/competition/FeaturedMatch';
import { LeagueRow } from '@/components/modules/basketball/columns';
import { MatchRowIsolated } from '@/components/modules/basketball/match';
import BkbMatchRowH2H from '@/components/modules/basketball/match/BkbMatchRowH2H';
import { useWindowSize } from '@/hooks';
import { useTeamOfLeagueData } from '@/hooks/useBasketball';
import { useFollowStore } from '@/stores/follow-store';
import { StarYellowNew } from '@/components/icons/StarYellowNew';

const TeamPlayersSection = dynamic(
  () =>
    import('@/modules/basketball/competior/components').then(
      (mod) => mod.TeamPlayersSection
    ),
  { ssr: false }
);

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
  teams: any;
  players: any;
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
  standingSeason,
  seasonBracket,
  teams,
  players,
}: Props) => {
  const { width } = useWindowSize();
  const { setSelectedStandingsTournament, setSelectedStandingsSeason } =
    useTeamStore();
  const i18n = useTrans();

  let firstSeason: any = {};
  if (seasonBracket && seasonBracket.length > 0) {
    firstSeason = seasonBracket[0];
  }
  const { data: teamOfLeague, isLoading: isLoadingTeamOfLeague } = useTeamOfLeagueData(teamDetails?.competition?.id);

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

  const firstTournament =
    teamUniqueTournaments && teamUniqueTournaments?.uniqueTournaments.length > 0
      ? teamUniqueTournaments?.uniqueTournaments[0]
      : {};

  // get list team from list standings

  if (!id) {
    return <></>;
  }

  return (
    <div>
      <Seo {...contentSEO(teamDetails)} />
      <div className='layout hidden lg:block'>
        <BreadCrumb className='overflow-x-scroll py-5 no-scrollbar'>
          <BreadCumbLink href='/basketball' name={i18n.header.basketball} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/basketball/competition/${getSlug(firstTournament?.name)}/${
              firstTournament?.id
            }`}
            name={firstTournament?.name}
          />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/basketball/competitor/${teamDetails?.name}/${teamDetails?.id}}`}
            name={teamDetails?.name}
            isEnd
          />
        </BreadCrumb>
      </div>
      <div className='flex w-full'>
        <div className='layout flex gap-6 transition-all duration-150 lg:flex-row'>
          <TwFilterCol className='flex-shrink-1 sticky top-20 w-full max-w-[209px] no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <TwFilterTitle className='font-oswald'>
              {i18n.clubs.youMayBe}
            </TwFilterTitle>
            <AllLeague leagueData={teams || teamOfLeague} type='competitor' isLoading={isLoadingTeamOfLeague} />
          </TwFilterCol>
          <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
            <TwMainCol className='!col-span-2'>
              <div className='h-full overflow-hidden'>
                <div className='flex w-full flex-col'>
                  <TeamCard clubData={teamDetails} i18n={i18n} players={players} />
                  <LeagueCard teamDetails={teamDetails} tournaments={teamUniqueTournaments} />
                  <MatchCard
                    listMatchHistory={listMatchHistory}
                    listMatchFuture={listMatchFuture}
                    clubData={teamDetails}
                  />
                  <StandingCard
                    standingSeason={standingSeason}
                    idTeam={teamDetails.id}
                  />
                  {/* <div className='flex items-center justify-between px-4'>
                    <h3 className='py-[14px] text-[14px] font-bold uppercase text-black dark:text-white'>
                      {selectedSeasonCup?.name}
                    </h3>
                    <Select
                      options={seasonBracket || []}
                      size='full'
                      label='name'
                      valueGetter={setSelectedSeasonCup}
                      shownValue={
                        selectedSeasonCup?.name || selectedSeasonCup?.id
                      }
                      classes='w-32'
                    ></Select>
                  </div>
                  <CupTreeBB selectedSeason={selectedSeasonCup} isTeam /> */}
                  <TeamPlayersSection
                    players={players}
                    i18n={i18n}
                    isMobile={width < 1024}
                  />
                </div>
              </div>
            </TwMainCol>

            <TwQuickViewCol className='col-span-1 sticky top-20 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
              <div className='flex w-full flex-col gap-6'>
                <FeaturedMatch
                  match={featuredEvents || ({} as SportEventDtoWithStat)}
                />
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

  const getTeamDetails = () => instance.get(`basketball/team/${teamId}`);
  const getFeaturedEvent = () =>
    instance.get(`basketball/team/${teamId}/featured-events`);
  const getListMatchHistory = () =>
    instance.get(`basketball/team/${teamId}/events/last/0`);
  const getTournaments = () =>
    instance.get(`basketball/team/${teamId}/unique-tournaments`);
  const getStandingSeason = () =>
    instance.get(`basketball/team/${teamId}/standings/seasons`);
  const getSeasonBracket = () =>
    instance.get(`basketball/team/${teamId}/bracket/seasons`);
  const getListMatchFuture = () =>
    instance.get(`basketball/team/${teamId}/events/next/0`);
  const getTeams = (competitionId: string) =>
    instance.get(`basketball/unique-tournament/${competitionId}/teams`);
  const getPlayers = () => instance.get(`basketball/team/${teamId}/players`);

  const fetchData = async () => {
    const responses = await Promise.allSettled([
      getTeamDetails(),
      getFeaturedEvent(),
      getTournaments(),
      getListMatchHistory(),
      getStandingSeason(),
      getSeasonBracket(),
      getListMatchFuture(),
      getPlayers(),
      
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
    const teamUniqueTournaments = resData[2];
    const listMatchHistory = resData[3];
    const standingSeason = resData[4];
    const seasonBracket = resData[5] || [];
    const listMatchFuture = resData[6];
    const players = resData[7] || {};
    let teams = [];
    if (teamDetails?.competition?.id) {
      const response = await getTeams(teamDetails?.competition?.id);
      teams = response.data.data.teams;
    }

    return {
      teamDetails: {
        id: teamId,
        name: teamName,
        ...teamDetails,
      },
      featuredEvents,
      teamUniqueTournaments,
      listMatchHistory,
      standingSeason,
      seasonBracket,
      listMatchFuture,
      teams,
      players,
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
      sport: SPORT.BASKETBALL,
      ...data,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    id: teamId,
    sport: SPORT.BASKETBALL,
    ...data,
  };
};

export default CompetitorDetailedPage;

import CalendarFill from '/public/svg/calendar-fill.svg';
import PlayerSVG from '/public/svg/player.svg';
import ForeignSVG from '/public/svg/foreign.svg';
import NationalSVG from '/public/svg/address.svg';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
const TeamCard = ({ clubData, i18n, players }: any) => {
  const sportType = SPORT.BASKETBALL;
  // console.log(players)
  const { data: session = {} } = useSession();
  const { mutate: mutateFavorite } = useSubsFavoriteById();

  function calAverageAge_notSubstitute(players: any[]): number {
    const starters = players.filter(
      playerRecord => playerRecord?.player?.dateOfBirthTimestamp
    );
  
    if (starters.length === 0) {
      return 0;
    }
    const totalAge = starters.reduce((acc, playerRecord) => {
      const player = playerRecord.player || {};
      if (player.dateOfBirthTimestamp) {
        return acc + getAgeFromTimestamp(player.dateOfBirthTimestamp);
      }
      return acc;
    }, 0);
  
    const averageAge = totalAge / starters.length;
    const avgAge = Number(averageAge.toFixed(1));
    return avgAge;
  }
  const { players: playersTeam = [] } = players || {}; 
  const avgAge = calAverageAge_notSubstitute(playersTeam);
  const nationPlayer = clubData?.country?.id && clubData?.country?.id != '' &&  playersTeam.filter((it:any) => it.player?.country?.id == clubData?.country?.id).length;
  const foreignPlayer = playersTeam.length - nationPlayer;

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
    // if(session && Object.keys(session).length > 0) {
    //   const dataFavoriteId = {
    //     id: clubData?.id,
    //     sportType: getSportType(sportType),
    //     type: getFavoriteType('competitor'),
    //     isFavorite: !isFollowedTeam,
    //   }
    //   mutateFavorite({session, dataFavoriteId})
    // }
  };
  return (
    <div className='mb-6 flex w-full flex-wrap overflow-hidden lg:rounded-lg dark-away-score lg:bg-transparent'>
      <div className='relative flex w-full items-center bg-transparent lg:bg-white lg:dark:bg-dark-stadium px-4 py-6 lg:w-1/2 lg:py-3'>
        <div className='absolute right-4 top-3' onClick={changeFollow}>
          {isFollowedTeam ? <StarYellowNew className='h-6 w-6' /> :<StarBlank className='h-6 w-6' />}
        </div>
        <div className='flex items-center gap-3'>
          <Avatar
            isBackground={false}
            id={clubData?.id}
            type='team'
            width={90}
            height={90}
            sport={SPORT.BASKETBALL}
            rounded={false}
          />
          <h3 className='mb-2 font-oswald text-2xl font-semibold capitalize text-white lg:text-black lg:dark:text-white'>
            {clubData?.name}
          </h3>
        </div>
      </div>
      <div className='grid w-full grid-cols-2 bg-transparent lg:bg-white lg:dark:bg-dark-summary lg:w-1/2'>
        <div className='h-[68px] border-b border-player-summary px-4 py-3 lg:border-l'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary'>
            {i18n.titles.players}
          </h4>
          <div className='flex items-center gap-2'>
            <PlayerSVG className='h-6 w-6' />
            <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
              {playersTeam ? playersTeam.length : '--'}
            </b>
          </div>
        </div>
        <div className='h-[68px] border-b border-l border-player-summary px-4 py-2'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary'>
            {i18n.competitor.avgAge}
          </h4>
          <div className='flex items-center gap-2'>
            <CalendarFill className='h-6 w-6' />
            <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
              {avgAge ? avgAge : '--'}
            </b>
          </div>
        </div>
        <div className='h-[68px] border-player-summary px-4 py-3 lg:border-l'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary'>
            {i18n.competitor.foreignPlayer}
          </h4>
          <div className='flex items-center gap-2'>
            <ForeignSVG className='h-6 w-6' />
            <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
              {foreignPlayer ? foreignPlayer : '--'}
            </b>
          </div>
        </div>
        <div className='h-[68px] border-l border-player-summary px-4 py-3'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary'>
            {i18n.competitor.nationPlayer}
          </h4>
          <div className='flex items-center gap-2'>
            <NationalSVG className='h-6 w-6' />
            <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
              {nationPlayer ? nationPlayer : '--'}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeagueCard = ({ teamDetails, tournaments }: any) => {
  const i18n = useTrans();
  const { uniqueTournaments } = tournaments;
  if (uniqueTournaments && uniqueTournaments.length == 0) return <></>;

  return (
    <div className='mb-6 rounded-md bg-white dark:bg-dark-wrap-match block lg:flex w-full'>
      <div className='w-full lg:w-1/2'>
        <div>
          <h2 className='px-4 py-[14px] text-left text-[14px] font-bold uppercase text-black dark:text-white'>
            {i18n.info.information}
          </h2>
          <div className='divide-list divide-dashed text-csm px-4'>
            <div className='flex justify-between items-center py-1'>
              <span>{i18n.competitor.coach}</span>
              <span className='text-logo-blue'>{teamDetails?.coach?.name ? teamDetails?.coach?.name : '--'}</span>
            </div>
            <div className='flex justify-between items-center py-1'>
              <span>{i18n.home.nation}</span>
              <span className='text-black dark:text-white'>{teamDetails?.country?.name ? teamDetails?.country?.name : '--'}</span>
            </div>
          </div>
        </div>
        <div className='pb-4'>
          <h2 className='px-4 py-[14px] text-left text-[14px] font-bold uppercase text-black dark:text-white'>
            {i18n.titles.venue}
          </h2>
          <div className='divide-list divide-dashed text-csm px-4'>
            <div className='flex justify-between items-center py-1'>
              <span>{i18n.titles.venue}</span>
              <span className='text-black dark:text-white'>{teamDetails?.venue?.name ? teamDetails?.venue?.name : '--'}</span>
            </div>
            <div className='flex justify-between items-center py-1'>
              <span>{i18n.qv.location}</span>
              <span className='text-black dark:text-white'>{teamDetails?.venue?.city ? teamDetails?.venue?.city : '--'}</span>
            </div>
            <div className='flex justify-between items-center py-1'>
              <span>{i18n.competitor.capacity}</span>
              <span className='text-black dark:text-white'>{teamDetails?.venue?.capacity ? teamDetails?.venue?.capacity : '--'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full lg:w-1/2 border-l border-line-default dark:border-player-summary'>
        <h2 className='px-4 py-[14px] text-left text-[14px] font-bold uppercase text-black dark:text-white'>
          {i18n.drawerMobile.tournaments}
        </h2>
        <div className='grid grid-cols-3 w-full items-center justify-center p-4'>
          {uniqueTournaments.map((it: { id: string; name: string }) => (
            <div
              className='flex flex-col items-center justify-center gap-3'
              key={it?.id}
            >
              <CustomLink
                href={`/basketball/competition/${getSlug(it?.name)}/${it?.id}`}
                target='_parent'
              >
                <Avatar
                  id={it?.id}
                  type='competition'
                  width={40}
                  height={40}
                  sport={SPORT.BASKETBALL}
                  isBackground={false}
                  rounded={false}
                  className='shrink-0 grow-0 basis-[40px]'
                />
              </CustomLink>
              <h3 className='text-center text-[11px] font-normal capitalize text-black dark:text-white'>
                {it?.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MatchCard = ({ listMatchHistory, listMatchFuture, clubData }: any) => {
  const i18n = useTrans();
  const { events } = listMatchHistory;
  const { events: eventFuture } = listMatchFuture;
  const allEvent = [...eventFuture, ...events];

  const dataMatch = allEvent ? groupByTournamentShow(allEvent) : [];
  const onClick = (match: SportEventDtoWithStat) => {
    window.location.href = `/basketball/match/${match.slug}/${match.id}`;
  };
  if (allEvent && allEvent.length == 0) return <></>;
  return (
    <div className='rounded-md bg-white dark:bg-dark-wrap-match p-4'>
      <h2 className='mb-4 text-[14px] font-bold uppercase text-black dark:text-white'>
        {i18n.titles.matches}
      </h2>
      <div className='w-full'>
        <ul className='space-y-1.5 pr-1'>
          {dataMatch.map((group, idx) => (
            <React.Fragment key={`group-${idx}`}>
              {group.matches.map(
                (match: SportEventDtoWithStat, matchIdx: any) => {
                  return (
                    <React.Fragment key={`match-${match?.id}`}>
                      {matchIdx === 0 && (
                        <LeagueRow match={match} isLink />
                      )}
                      <BkbMatchRowH2H
                        h2hEvent={match}
                        teamId={clubData?.id || match?.homeTeam?.id}
                        h2HFilter={'home'}
                        isDetail
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
  );
};

const StandingStable = dynamic(
  () =>
    import('@/components/modules/basketball/competition').then(
      (mod) => mod.StandingStable
    ),
  { ssr: false }
);

const StandingCard = ({ standingSeason, idTeam }: any) => {
  const i18n = useTrans();

  const { tournamentSeasons } = standingSeason;
  const getFirstTournament =
    tournamentSeasons && tournamentSeasons.length > 0
      ? tournamentSeasons[0]
      : {};
  const getFirstSeason =
    getFirstTournament && Object.keys(getFirstTournament).length > 0
      ? getFirstTournament?.seasons[0]
      : {};

  const [selectedTournament, setSelectedTournament] = useState(
    getFirstTournament.tournament || {}
  );
  const [selectedSeason, setSelectedSeason] = useState<any>(
    getFirstSeason || {}
  );

  const [ssOptions, setSSOptions] = useState<any[]>(getFirstTournament.seasons);

  //call api standings
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' },
  });

  const handleChangeLeague = (tourId: any) => {
    const findSeason = tournamentSeasons.find(
      (tourItem: any) => tourItem?.tournament?.id === tourId
    );
    const firstItemSeasons = findSeason?.seasons[0];
    setSSOptions(findSeason?.seasons);
    setSelectedSeason(firstItemSeasons);
  };

  useEffect(() => {
    handleChangeLeague(selectedTournament?.id);
  }, [selectedTournament]);

  const uniqueTournaments = tournamentSeasons.map((record: any) => {
    return record.tournament;
  });

  return (
    <div className='mb-10 rounded-md bg-white dark:bg-dark-wrap-match'>
      <h2 className='p-4 text-[14px] font-bold uppercase text-black dark:text-white'>
        {i18n.menu.standings}
      </h2>
      <div className='flex w-full lg:w-auto justify-start gap-2 p-4 pt-0'>
        <div className='flex-1 lg:flex-none'>
          <SelectLeague
            options={uniqueTournaments}
            // shownValue={statsTournament?.name}
            valueGetter={setSelectedTournament}
            size='full'
            label='shortName'
          />
        </div>

        <div>
          <Select
            options={ssOptions}
            size='full'
            label='name'
            valueGetter={setSelectedSeason}
            shownValue={selectedSeason?.name || selectedSeason?.id}
          ></Select>
        </div>
      </div>
      <div className='relative'>
        <StandingStable
          uniqueTournament={selectedTournament}
          selectedSeason={selectedSeason}
        />
      </div>
    </div>
  );
};
