/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { useEffect, useState } from 'react';

import { useConvertPath } from '@/hooks/useConvertPath';

import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';

import { useTeamStore } from '@/stores/team-store';

import { AllLeague } from '@/modules/am-football/competior/components';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep, Select } from '@/components/common';

import Avatar from '@/components/common/Avatar';
import { SelectLeague } from '@/components/common/selects/SelectLeague';
import LeagueRow from '@/components/modules/am-football/components/LeagueRow';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { getFavoriteType, getSportType, groupByUniqueTournamentShow } from '@/utils/matchFilter';
import React from 'react';
import StarBlank from '/public/svg/star-blank.svg';
import { SPORT } from '@/constant/common';
import {
  CupTree as CupTreeAMF,
  FeaturedMatch,
} from '@/components/modules/am-football/competition';
import MatchRowLeague from '@/components/modules/am-football/competition/MatchRowLeague';
import { getSlug } from '@/utils';
import dynamic from 'next/dynamic';
import Seo from '@/components/Seo';
import { useLocale } from '@/hooks/useLocale';
import { useRouter } from 'next/router';
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
  listMatchHistory,
  listMatchFuture,
  standingSeason,
  seasonBracket,
}: Props) => {
  const { setSelectedStandingsTournament, setSelectedStandingsSeason } =
    useTeamStore();
  const i18n = useTrans();

  let firstSeason: any = {};
  if (seasonBracket && seasonBracket.length > 0) {
    firstSeason = seasonBracket[0];
  }

  const [selectedSeasonCup, setSelectedSeasonCup] = useState<any>(
    firstSeason || {}
  );

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
    featuredEvents &&
    featuredEvents?.uniqueTournament &&
    Object.keys(featuredEvents?.uniqueTournament).length > 0
      ? featuredEvents?.uniqueTournament
      : {};

  // get list team from list standings
  const [dataTeam, setDataTeam] = useState([]);
  const getDataTeam = (data: any) => {
    const firstData = data.length > 0 ? data[0].rows : [];
    setDataTeam(
      firstData
        .map((it: any) => it.team)
        .filter((idFil: any) => idFil.id !== teamDetails.id)
    );
  };

  if (!id) {
    return <></>;
  }

  return (
    <div>
      <Seo {...contentSEO(teamDetails)} />

      <div className='layout hidden lg:block'>
        <BreadCrumb className='overflow-x-scroll py-5 no-scrollbar'>
          <BreadCumbLink href='/am-football' name={i18n.header.am_football} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/am-football/competition/${
              firstTournament?.slug || getSlug(firstTournament?.name)
            }/${firstTournament?.id}`}
            name={firstTournament?.name}
          />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/am-football/competitor/${teamDetails?.name}/${teamDetails?.id}}`}
            name={teamDetails?.name}
            isEnd
          />
        </BreadCrumb>
      </div>
      <div className='flex w-full'>
        <div className='layout flex w-full gap-6 transition-all duration-150 lg:flex-row'>
          <TwFilterCol className='flex-shrink-1 sticky top-20 w-full max-w-[209px] no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <TwFilterTitle className='font-oswald'>
              {i18n.clubs.youMayBe}
            </TwFilterTitle>
            <AllLeague leagueData={dataTeam} type='competitor' />
          </TwFilterCol>
          <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
            <TwMainCol className='!col-span-2'>
              <div className='h-full overflow-hidden'>
                <div className='flex w-full flex-col'>
                  <TeamCard clubData={teamDetails} />
                  <MatchCard listMatchHistory={listMatchHistory} />
                  <StandingCard
                    standingSeason={standingSeason}
                    idTeam={teamDetails.id}
                    getDataTeam={getDataTeam}
                  />
                  <div className='flex items-center justify-between px-4'>
                    <h3 className='py-[14px] text-[14px] font-bold uppercase text-black dark:text-white'>
                      {selectedSeasonCup?.name}
                    </h3>
                    <Select
                      options={seasonBracket}
                      size='full'
                      label='name'
                      valueGetter={setSelectedSeasonCup}
                      shownValue={
                        selectedSeasonCup?.name || selectedSeasonCup?.id
                      }
                      classes='w-32'
                    ></Select>
                  </div>
                  <CupTreeAMF selectedSeason={selectedSeasonCup} isTeam />
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

  const getTeamDetails = () => instance.get(`am-football/team/${teamId}`);
  const getFeaturedEvent = () =>
    instance.get(`am-football/team/${teamId}/featured-events`);
  const getListMatchHistory = () =>
    instance.get(`am-football/team/${teamId}/events/last/0`);
  const getStandingSeason = () =>
    instance.get(`am-football/team/${teamId}/standings/seasons`);
  const getSeasonBracket = () =>
    instance.get(`am-football/team/${teamId}/bracket/seasons`);
  const getListMatchFuture = () =>
    instance.get(`am-football/team/${teamId}/events/next/0`);

  const fetchData = async () => {
    const responses = await Promise.allSettled([
      getTeamDetails(),
      getFeaturedEvent(),
      getListMatchHistory(),
      getStandingSeason(),
      getSeasonBracket(),
      getListMatchFuture(),
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
    const standingSeason = resData[3];
    const seasonBracket = resData[4];
    const listMatchFuture = resData[5];

    return {
      teamDetails: {
        id: teamId,
        name: teamName,
        ...teamDetails,
      },
      featuredEvents,
      listMatchHistory,
      standingSeason,
      seasonBracket,
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
      sport: SPORT.AMERICAN_FOOTBALL,
      ...data,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    id: teamId,
    sport: SPORT.AMERICAN_FOOTBALL,
    ...data,
  };
};

export default CompetitorDetailedPage;

const TeamCard = ({ clubData }: any) => {
  const sportType = SPORT.AMERICAN_FOOTBALL;
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
          sport={SPORT.AMERICAN_FOOTBALL}
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

const MatchCard = ({ listMatchHistory }: any) => {
  const i18n = useTrans();
  const router = useRouter();
  const { events } = listMatchHistory;
  const allEvent = [...events];
  const dataMatch = allEvent ? groupByUniqueTournamentShow(allEvent) : [];
  const onClick = (match: SportEventDtoWithStat) => {
    router.push(`/${SPORT.AMERICAN_FOOTBALL}/match/${match?.slug}/${match.id}`);
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
                      {matchIdx === 0 && <LeagueRow match={match} />}
                      <MatchRowLeague
                        key={match?.id}
                        match={match}
                        i18n={i18n}
                        onClick={onClick}
                        sport={SPORT.AMERICAN_FOOTBALL}
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

const StandingStableAMF = dynamic(
  () =>
    import('@/components/modules/am-football/competition').then(
      (mod) => mod.StandingStable
    ),
  { ssr: false }
);

const StandingCard = ({ standingSeason, idTeam, getDataTeam }: any) => {
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
  const [standingArr, setStandingArr] = useState<any>([]);

  const [ssOptions, setSSOptions] = useState<any[]>(getFirstTournament.seasons);

  //call api standings
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' },
  });

  async function getStandings(idSeasons: any) {
    try {
      const response = (await instance.get(
        `am-football/unique-tournament/season/${idSeasons}/standings`
      )) as any;
      getDataTeam(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }
  //end call api standings

  const handleChangeLeague = (tourId: any) => {
    const findSeason = tournamentSeasons.find(
      (tourItem: any) => tourItem?.tournament?.id === tourId
    );
    const firstItemSeasons = findSeason?.seasons[0];
    setSSOptions(findSeason?.seasons);
    setSelectedSeason(firstItemSeasons);
  };

  useEffect(() => {
    getStandings(selectedSeason?.id || getFirstTournament?.seasons[0]?.id);
  }, [selectedSeason]);

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
      <div className='flex justify-start gap-2 p-4 pt-0'>
        <div>
          <SelectLeague
            options={uniqueTournaments}
            // shownValue={statsTournament?.name}
            valueGetter={setSelectedTournament}
            size='full'
            label='name'
          ></SelectLeague>
        </div>

        <div>
          <Select
            options={ssOptions}
            size='full'
            label='name'
            valueGetter={setSelectedSeason}
            shownValue={selectedSeason?.name || selectedSeason?.id}
            classes='w-32'
          ></Select>
        </div>
      </div>
      <div className='relative'>
        <StandingStableAMF
          uniqueTournament={selectedTournament}
          selectedSeason={selectedSeason}
          isTeam
          teamPageId={idTeam || ''}
        />
      </div>
    </div>
  );
};
