/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { useEffect, useMemo, useState } from 'react';

import { useConvertPath } from '@/hooks/useConvertPath';

import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';

import { useTeamStore } from '@/stores/team-store';

import { AllTeam as AllTeamVlb } from '@/modules/volleyball/competior/components';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep, Select } from '@/components/common';

import { TwButtonIcon } from '@/components/buttons/IconButton';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { SelectLeague } from '@/components/common/selects/SelectLeague';
import { Divider } from '@/components/modules/common/tw-components/TwPlayer';
import LeagueRow from '@/components/modules/volleyball/components/LeagueRow';
import MatchRowH2H from '@/components/modules/volleyball/match/MatchRowH2H';
import MatchTimeScore from '@/components/modules/volleyball/match/MatchTimeScore';
import { SPORT } from '@/constant/common';
import { Group, SportEventDtoWithStat } from '@/constant/interface';
import { useStandingSeasonData } from '@/hooks/useCommon/useEventData';
import useTrans from '@/hooks/useTrans';
import { getSlug } from '@/utils';
import { getFavoriteType, getSportType, groupByUniqueTournamentShow } from '@/utils/matchFilter';
import clsx from 'clsx';
import React from 'react';
import ZoomOutSVG from '~/svg/zoom-out.svg';
import StarBlank from '/public/svg/star-blank.svg';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { useFollowStore } from '@/stores/follow-store';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';

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
  const tournamentId =
    teamUniqueTournaments && teamUniqueTournaments?.uniqueTournaments.length > 0
      ? teamUniqueTournaments?.uniqueTournaments[0]?.id
      : '';

  if (!id) {
    return <></>;
  }

  return (
    <>
      {/* <Seo {...contentSEO(teamDetails)} /> */}

      <div className='layout hidden lg:block'>
        <BreadCrumb className='overflow-x-scroll py-5 no-scrollbar'>
          <BreadCumbLink href='/volleyball' name={i18n.header.volleyball} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/volleyball/cim/${'teamName'}/${'teamId'}`}
            name={i18n.player.club}
            isEnd
          />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/volleyball/competition/${teamDetails.slug}/${teamDetails.id}`}
            name={teamDetails?.short_name || teamDetails?.name}
            isEnd
          />
        </BreadCrumb>
      </div>
      <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
        <TwFilterCol className='flex-shrink-1 sticky top-20 w-full max-w-[209px] no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
          <TwFilterTitle className='font-oswald'>
            {i18n.clubs.youMayBe}
          </TwFilterTitle>
          <AllTeamVlb tournamentId={tournamentId} />
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full overflow-hidden'>
              <div className='flex w-full flex-col'>
                <TeamCard clubData={teamDetails} />
                <LeagueCard tournaments={teamUniqueTournaments} />
                <MatchCard
                  listMatchHistory={listMatchHistory}
                  listMatchFuture={listMatchFuture}
                />
                <StandingCard
                  standingSeason={standingSeason}
                  idTeam={teamDetails.id}
                />
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='sticky top-20 col-span-1 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              <FeaturedCard featuredEvents={featuredEvents} />
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
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

  const getTeamDetails = () => instance.get(`volleyball/team/${teamId}`);
  const getFeaturedEvent = () =>
    instance.get(`volleyball/team/${teamId}/featured-events`);
  const getListMatchHistory = () =>
    instance.get(`volleyball/team/${teamId}/events/last/0`);
  const getTournaments = () =>
    instance.get(`volleyball/team/${teamId}/unique-tournaments`);
  const getStandingSeason = () =>
    instance.get(`volleyball/team/${teamId}/standings/seasons`);
  const getListMatchFuture = () =>
    instance.get(`volleyball/team/${teamId}/events/next/0`);

  const fetchData = async () => {
    const responses = await Promise.allSettled([
      getTeamDetails(),
      getFeaturedEvent(),
      getTournaments(),
      getListMatchHistory(),
      getStandingSeason(),
      getListMatchFuture(),
    ]);

    const resData = responses.map((response, index) => {
      if (response.status === 'fulfilled') {
        return response.value.data.data;
      } else {
        return null;
      }
    });
    const teamDetails = resData[0]?.team || {};
    const featuredEvents = resData[1] || {};
    const teamUniqueTournaments = resData[2];
    const listMatchHistory = resData[3];
    const standingSeason = resData[4];
    const listMatchFuture = resData[5];

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
      listMatchFuture,
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
      sport: 'volleyball',
      ...data,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    id: teamId,
    sport: 'volleyball',
    ...data,
  };
};

export default CompetitorDetailedPage;

const TeamCard = ({ clubData }: any) => {
  const sportType = SPORT.VOLLEYBALL;
  const { data: session = {} } = useSession();
  const { mutate: mutateFavorite } = useSubsFavoriteById();

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
    <div className='relative mb-6 flex h-[162px] w-full items-center justify-center lg:rounded-md px-4 dark-away-score lg:custom-bg-white dark:lg:bg-dark-stadium'>
      <div className='absolute right-4 top-3' onClick={changeFollow}>
        {isFollowedTeam ? <StarYellowNew className='h-6 w-6' /> :<StarBlank className='h-6 w-6' />}
      </div>
      <div className='flex items-center gap-3'>
        <Avatar
          id={clubData?.id}
          type='team'
          width={90}
          height={90}
          sport='volleyball'
          isBackground={false}
          rounded={false}
        />
        <h3 className='mb-2 font-oswald text-2xl font-semibold capitalize text-white lg:text-black lg:dark:text-white'>
          {clubData?.name}
        </h3>
      </div>
    </div>
  );
};

const LeagueCard = ({ tournaments }: any) => {
  const i18n = useTrans();
  const uniqueTournaments = tournaments?.uniqueTournaments;
  if (uniqueTournaments && uniqueTournaments.length == 0) return <></>;

  return (
    <div className='mb-6 rounded-md bg-white dark:bg-dark-wrap-match'>
      <h2 className='px-4 py-[14px] text-center text-[14px] font-bold uppercase text-black dark:text-white'>
        {i18n.drawerMobile.tournaments}
      </h2>
      <div className='flex w-full items-center justify-center gap-10 p-4'>
        {uniqueTournaments &&
          uniqueTournaments.map(
            (it: { id: string; name: string; slug?: string }) => (
              <div
                className='flex flex-col items-center justify-center gap-3'
                key={it?.id}
              >
                <CustomLink
                  href={`/${SPORT.VOLLEYBALL}/competition/${
                    it?.slug || getSlug(it?.name)
                  }/${it?.id}`}
                  target='_parent'
                >
                  <Avatar
                    id={it?.id}
                    type='competition'
                    width={40}
                    heght={40}
                    sport='volleyball'
                    isBackground={false}
                    rounded={false}
                    className='shrink-0 grow-0 basis-[40px]'
                  />
                </CustomLink>
                <h3 className='text-center text-[14px] font-semibold capitalize text-black dark:text-white'>
                  {it?.name}
                </h3>
              </div>
            )
          )}
      </div>
    </div>
  );
};

const MatchCard = ({ teamDetails, listMatchHistory, listMatchFuture }: any) => {
  const i18n = useTrans();
  const eventLast = listMatchHistory?.events || [];
  const eventNext = listMatchFuture?.events || [];

  const allEventClub = [...eventNext, ...eventLast];

  const dataMatch = allEventClub
    ? groupByUniqueTournamentShow(allEventClub)
    : [];

  if (allEventClub && allEventClub.length == 0) return <></>;
  return (
    <div className='mb-4 rounded-md bg-white p-4 dark:bg-dark-wrap-match'>
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
                      {matchIdx === 0 && <LeagueRow match={match} />}
                      <MatchRowH2H
                        h2hEvent={match}
                        teamId={match?.homeTeam?.id}
                        h2HFilter={'home'}
                        isDetail
                      ></MatchRowH2H>
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

const FeaturedCard = ({ featuredEvents }: any) => {
  const i18n = useTrans();

  const { uniqueTournament, homeTeam, awayTeam, scores } = featuredEvents;
  const isScoreNotAvailable = !scores || Object.keys(scores)?.length === 0;
  if (featuredEvents && Object.keys(featuredEvents).length == 0) return <></>;
  return (
    <div className='relative rounded-md bg-white p-4 dark:bg-dark-wrap-match'>
      <div className='absolute right-3 top-3 z-10'>
        <CustomLink
          href={`/${SPORT.VOLLEYBALL}/match/${featuredEvents?.slug}/${featuredEvents?.id}`}
          target='_parent'
        >
          <TwButtonIcon
            icon={<ZoomOutSVG />}
            className='h-8 w-8 rounded-full  bg-head-tab !pb-0 dark:bg-slate-700'
          />
        </CustomLink>
      </div>
      <h2 className='mb-4 text-[14px] font-bold uppercase text-black dark:text-white'>
        {i18n.titles.featured_match}
      </h2>
      <div className='mb-2 flex items-center gap-3'>
        <CustomLink
          href={`/volleyball/competitor/${
            uniqueTournament?.name || getSlug(uniqueTournament?.name)
          }/${uniqueTournament?.id}`}
          target='_parent'
        >
          <Avatar
            id={uniqueTournament?.id}
            type='competition'
            width={24}
            height={24}
            isBackground={false}
            rounded={false}
            sport='volleyball'
          />
        </CustomLink>
        <h3 className='text-[11px] text-light-secondary'>
          {uniqueTournament?.name}
        </h3>
      </div>
      <Divider />
      <div className='flex items-center justify-between gap-6 pt-4'>
        <div className='flex flex-1 flex-col items-center justify-center gap-3'>
          <CustomLink
            href={`/volleyball/competitor/${homeTeam?.name}/${homeTeam?.id}`}
            target='_parent'
          >
            <Avatar
              id={homeTeam?.id}
              type='team'
              width={40}
              heght={40}
              isBackground={false}
              rounded={false}
              sport='volleyball'
              className='shrink-0 grow-0 basis-[40px]'
            />
          </CustomLink>
          <h3 className='max-w-24 truncate text-center text-[14px] font-semibold capitalize text-black dark:text-white'>
            {homeTeam?.name}
          </h3>
        </div>
        <MatchTimeScore
          match={featuredEvents}
          status={featuredEvents?.status}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
          isClub
        />
        <div className='flex flex-1 flex-col items-center justify-center gap-3'>
          <CustomLink
            href={`/volleyball/competitor/${awayTeam?.name}/${awayTeam?.id}`}
            target='_parent'
          >
            <Avatar
              id={awayTeam?.id}
              type='team'
              width={40}
              heght={40}
              isBackground={false}
              rounded={false}
              sport='volleyball'
              className='shrink-0 grow-0 basis-[40px]'
            />
          </CustomLink>
          <h3 className='max-w-24 truncate text-center text-[14px] font-semibold capitalize text-black dark:text-white'>
            {awayTeam?.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

const StandingCard = ({ standingSeason, idTeam }: any) => {
  const i18n = useTrans();

  const tournamentSeasons = standingSeason?.tournamentSeasons;
  const getFirstTournament =
    tournamentSeasons && tournamentSeasons.length > 0
      ? tournamentSeasons[0]
      : {};
  const getFirstSeason =
    getFirstTournament && Object.keys(getFirstTournament).length > 0
      ? getFirstTournament?.seasons[0]
      : {};
  const [selectedTournament, setSelectedTournament] = useState(
    getFirstTournament?.tournament || {}
  );
  const [selectedSeason, setSelectedSeason] = useState<any>(
    getFirstSeason || {}
  );

  const [ssOptions, setSSOptions] = useState<any[]>(getFirstTournament.seasons);

  const { data: standingData, isLoading } = useStandingSeasonData(
    selectedSeason?.id,
    SPORT.VOLLEYBALL
  );

  const memorizedStandingData = useMemo<Group[]>(
    () => standingData?.standings || [],
    [standingData]
  );

  //end call api standings

  const handleChangeLeague = (tourId: any) => {
    const findSeason = tournamentSeasons.find(
      (tourItem: any) => tourItem.tournament.id === tourId
    );
    const firstItemSeasons = findSeason.seasons[0];
    setSSOptions(findSeason.seasons);
    setSelectedSeason(firstItemSeasons);
  };

  useEffect(() => {
    handleChangeLeague(selectedTournament.id);
  }, [selectedTournament]);

  const uniqueTournaments =
    tournamentSeasons &&
    tournamentSeasons.map((record: any) => {
      return record.tournament;
    });

  if (!standingData) return <></>;

  return (
    <div className='mb-10 rounded-md bg-white dark:bg-dark-wrap-match'>
      <h2 className='p-4 text-[14px] font-bold uppercase text-black dark:text-white'>
        {i18n.menu.standings}
      </h2>
      <div className='flex justify-start gap-2 p-4 pt-0'>
        <div>
          <SelectLeague
            options={uniqueTournaments}
            // shownValue={statsTournament?.name}
            valueGetter={setSelectedTournament}
            size='full'
            label='shortName'
          ></SelectLeague>
        </div>

        <div>
          <Select
            options={ssOptions}
            size='full'
            label='name'
            valueGetter={setSelectedSeason}
            classes='min-w-[5rem]'
            shownValue={selectedSeason?.name || selectedSeason?.year}
          />
        </div>
      </div>
      {memorizedStandingData.length > 0 &&
        memorizedStandingData?.map((group) => (
          <div
            key={group?.name?.replace(/\s+/g, '')}
            className='mb-4 flex w-full flex-col gap-2 px-4 last:mb-0'
          >
            <span className='text-ccsm font-medium dark:text-white'>
              {group?.name || ''}
            </span>
            <div className='flex bg-dark-gray py-2 text-[13px]'>
              <div className='w-11 text-center'>#</div>
              <div className='flex-1'>{i18n.menu.team}</div>
              {['P', 'W', 'L', 'Sets', 'PTS'].map((it) => (
                <div className='w-14 text-center' key={it}>
                  {it}
                </div>
              ))}
            </div>
            <div>
              {memorizedStandingData &&
                group.rows.map((it, index: number) => (
                  <React.Fragment key={it.team.id}>
                    <RowStanding rowData={it} idTeam={idTeam} />
                    <Divider />
                  </React.Fragment>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

const RowStanding = ({ rowData, idTeam }: any) => {
  const { team, points, win, loss, total, sets_loss, sets_win, position } =
    rowData;
  return (
    <div
      className={`flex py-2 text-[13px] text-black dark:text-white ${
        team?.id === idTeam && 'bg-primary-mask'
      }`}
    >
      <div className='flex w-11 items-center justify-center text-center'>
        <div
          className={clsx(
            'flex h-4 w-4 items-center justify-center rounded-full',
            {
              'border border-dark-green text-dark-green': position < 4,
            }
          )}
        >
          <span className='text-msm font-normal'>{position}</span>
        </div>
      </div>
      <div className='flex flex-1 gap-2'>
        <CustomLink
          href={`/volleyball/competitor/${team?.name}/${team?.id}`}
          target='_parent'
        >
          <Avatar
            id={team?.id}
            type='team'
            width={24}
            height={24}
            isBackground={false}
            rounded={false}
          />
        </CustomLink>
        <h3 className=' text-black dark:text-white'>{team?.name}</h3>
      </div>
      <div className='w-14 text-center'>{total}</div>
      <div className='w-14 text-center'>{win}</div>
      <div className='w-14 text-center'>{loss}</div>
      <div className='w-14 text-center'>{`${sets_win}:${sets_loss}`}</div>
      <div className='w-14 text-center'>{points}</div>
    </div>
  );
};
