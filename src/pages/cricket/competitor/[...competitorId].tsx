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

import { AllLeague } from '@/modules/cricket/competior/components';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep, Select } from '@/components/common';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { SelectLeague } from '@/components/common/selects/SelectLeague';
import LeagueRow from '@/components/modules/cricket/components/LeagueRow';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { getFavoriteType, getSportType, groupByUniqueTournamentShow } from '@/utils/matchFilter';
import React from 'react';
import StarBlank from '/public/svg/star-blank.svg';
import { SPORT } from '@/constant/common';
import { FeaturedMatch } from '@/components/modules/cricket/competition';
import { getSlug } from '@/utils';
import dynamic from 'next/dynamic';
import Seo from '@/components/Seo';
import { MatchRowIsolated } from '@/components/modules/cricket/match/MatchRowIsolated';
import { useFollowStore } from '@/stores/follow-store';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
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
  listMatchFuture:any;
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
  standingSeason,
  seasonBracket
}: Props) => {
  const { setSelectedStandingsTournament, setSelectedStandingsSeason } =
    useTeamStore();
  const i18n = useTrans();

  let firstSeason:any = {}
  if(seasonBracket && seasonBracket.length > 0) {
    firstSeason = seasonBracket[0]
  }

  const [selectedSeasonCup, setSelectedSeasonCup] = useState<any>(firstSeason || {})

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
  const [dataTeam, setDataTeam] = useState([])
  const getDataTeam = (data:any) => {
    const firstData = data.length > 0 ? data[0].rows : []
    setDataTeam(firstData.map((it:any) => it.team).filter((idFil:any) => idFil.id !== teamDetails.id))
  }

  if (!id) {
    return <></>;
  }

  return (
    <div>
      <Seo {...contentSEO(teamDetails)} />

      <div className='layout hidden lg:block'>
        <BreadCrumb className='no-scrollbar overflow-x-scroll py-5'>
          <BreadCumbLink href='/cricket' name={i18n.header.cricket} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/cricket/competition/${getSlug(firstTournament?.name)}/${firstTournament?.id}`}
            name={firstTournament?.name}
          />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/cricket/competitor/${teamDetails?.name}/${teamDetails?.id}}`}
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
            <AllLeague leagueData={dataTeam} type="competitor" />
          </TwFilterCol>
          <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
            <TwMainCol className='!col-span-2'>
              <div className='h-full overflow-hidden'>
                <div className='flex w-full flex-col'>
                  <TeamCard clubData={teamDetails} />
                  <LeagueCard tournaments={teamUniqueTournaments} />
                  <MatchCard listMatchHistory={listMatchHistory} listMatchFuture={listMatchFuture} />
                  <StandingCard standingSeason={standingSeason} idTeam={teamDetails.id} getDataTeam={getDataTeam} />
                </div>
              </div>
            </TwMainCol>

            <TwQuickViewCol className='col-span-1 sticky top-20 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
              <div className='flex w-full flex-col gap-6'>
                <FeaturedMatch match={featuredEvents || ({} as SportEventDtoWithStat)}/>
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

  const getTeamDetails = () => instance.get(`cricket/team/${teamId}`);
  const getFeaturedEvent = () => instance.get(`cricket/team/${teamId}/featured-events`);
  const getListMatchHistory = () => instance.get(`cricket/team/${teamId}/events/last/0`);
  const getTournaments = () => instance.get(`cricket/team/${teamId}/unique-tournaments`);
  const getStandingSeason = () => instance.get(`cricket/team/${teamId}/standings/seasons`);
  const getSeasonBracket = () => instance.get(`cricket/team/${teamId}/bracket/seasons`);
  const getListMatchFuture = () => instance.get(`cricket/team/${teamId}/events/next/0`);

  const fetchData = async () => {
    const responses = await Promise.allSettled([
      getTeamDetails(),
      getFeaturedEvent(),
      getTournaments(),
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
    const teamUniqueTournaments = resData[2];
    const listMatchHistory = resData[3];
    const standingSeason = resData[4];
    const seasonBracket = resData[5];
    const listMatchFuture = resData[6];

    return {
      teamDetails: {
        id: teamId,
        name: teamName,
        ...teamDetails
      },
      featuredEvents,
      teamUniqueTournaments,
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
      sport: SPORT.CRICKET,
      ...data,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    id: teamId,
    sport: SPORT.CRICKET,
    ...data,
  };
};

export default CompetitorDetailedPage;

const TeamCard = ({clubData}:any) => {
  const sportType = SPORT.CRICKET;
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
            sport={SPORT.CRICKET}
            isBackground={false}
            rounded={false}
          />
          <h3 className='text-2xl font-semibold font-oswald capitalize text-white lg:text-black lg:dark:text-white mb-2'>{clubData?.name}</h3>
        </div>
      </div>
  )
}

const LeagueCard = ({tournaments}:any) => {
  const i18n = useTrans();
  const uniqueTournaments = tournaments?.uniqueTournaments || [];
  if(uniqueTournaments && uniqueTournaments.length == 0) return <></>

  return (
   <div className='bg-white dark:bg-dark-wrap-match rounded-md mb-6'>
    <h2 className='font-bold text-[14px] text-white text-center uppercase px-4 py-[14px]'>{i18n.drawerMobile.tournaments}</h2>
    <div className='w-full flex items-start justify-center p-4 gap-10 flex-wrap'>
      {uniqueTournaments && uniqueTournaments.length > 0 && uniqueTournaments.map((it: {id: string, name: string}) => (
        <div className='flex flex-col items-center justify-center gap-3 w-[150px]' key={it?.id}>
          <CustomLink
            href={`/cricket/competition/${getSlug(it?.name)}/${it?.id}`}
            target='_parent'
          >
            <Avatar
              id={it?.id}
              type='competition'
              width={40}
              height={40}
              sport={SPORT.CRICKET}
              isBackground={false}
              rounded={false}
              className='basis-[40px] grow-0 shrink-0'
            />
            </CustomLink>
          <h3 className='text-[14px] font-semibold capitalize text-black dark:text-white text-center'>{it?.name}</h3>
        </div>
      ))}
    </div>
   </div>
  )
}

const MatchCard = ({listMatchHistory, listMatchFuture}:any) => {
  const i18n = useTrans();
  const {events} = listMatchHistory;
  const {events: eventFuture} = listMatchFuture;
  const allEvent = [...eventFuture, ...events]

  const dataMatch = allEvent ? groupByUniqueTournamentShow(allEvent) : [];
  const onClick = (match: SportEventDtoWithStat) => {
    window.location.href = `/cricket/match/${match.slug}/${match.id}`;
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
                      <LeagueRow
                        match={match}
                      />
                    )}
                    <MatchRowIsolated
                      key={match?.id}
                      match={match}
                      i18n={i18n}
                      onClick={onClick}
                      sport={SPORT.CRICKET}
                      homeSound=''
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

const StandingStableCricket = dynamic(
  () =>
    import('@/components/modules/cricket/competition').then(
      (mod) => mod.StandingStable
    ),
  { ssr: false }
);

const StandingCard = ({standingSeason, idTeam, getDataTeam}:any) => {

  const i18n = useTrans();

  const {tournamentSeasons} = standingSeason;
  const getFirstTournament = tournamentSeasons && tournamentSeasons.length > 0 ? tournamentSeasons[0] : {}
  const getFirstSeason = getFirstTournament && Object.keys(getFirstTournament).length > 0 ? getFirstTournament?.seasons[0] : {}
  const [selectedTournament, setSelectedTournament] = useState(getFirstTournament.uniqueTournament || {})
  const [selectedSeason, setSelectedSeason] = useState<any>(getFirstSeason || {})

  const [ssOptions, setSSOptions] = useState<any[]>(getFirstTournament.seasons);

  //call api standings
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' },
  });

  async function getStandings(idSeasons:any) {
    try {
      const response = await instance.get(`cricket/unique-tournament/season/${idSeasons}/standings`) as any;
      getDataTeam(response.data.data.standings)
    } catch (error) {
      console.error(error);
    }
  }
  //end call api standings

  const handleChangeLeague = (tourId:any) => {
    const findSeason = tournamentSeasons.find((tourItem:any) => tourItem?.uniqueTournament?.id === tourId)
    const firstItemSeasons = findSeason?.seasons[0]
    setSSOptions(findSeason?.seasons)
    setSelectedSeason(firstItemSeasons)
  }

  useEffect(() => {
    getStandings(selectedSeason?.id || getFirstTournament?.seasons?.[0]?.id || '')
  },[selectedSeason])


  useEffect(() => {
    handleChangeLeague(selectedTournament?.id)
  },[selectedTournament])

  const uniqueTournaments = tournamentSeasons.map((record: any) => {
    return record.uniqueTournament;
  });

  // if(!standingArr) return <></>

  return (
   <div className='bg-white dark:bg-dark-wrap-match rounded-md mb-10'>
    <h2 className='font-bold text-[14px] text-white uppercase p-4'>{i18n.menu.standings}</h2>
    <div className='p-4 pt-0 flex justify-start gap-2'>
      <div>
        {uniqueTournaments && uniqueTournaments.length > 0 && <SelectLeague
          options={uniqueTournaments}
          // shownValue={statsTournament?.name}
          valueGetter={setSelectedTournament}
          size='full'
          label='shortName'
        ></SelectLeague>}
      </div>

      <div>
        {ssOptions && ssOptions.length > 0 && <Select
          options={ssOptions}
          size='full'
          label='name'
          valueGetter={setSelectedSeason}
          shownValue={selectedSeason?.name || selectedSeason?.id}
          classes='w-32'
        ></Select>}
      </div>
    </div>
    <div className='relative'>
      <StandingStableCricket
        uniqueTournament={selectedTournament}
        selectedSeason={selectedSeason}
        isTeam
        teamPageId={idTeam || ''}
      />
    </div>
   </div>
  )
}