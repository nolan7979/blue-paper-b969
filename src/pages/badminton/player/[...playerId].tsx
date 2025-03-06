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
import { BreadCrumbSep } from '@/components/common';

import Seo from '@/components/Seo';
import Avatar from '@/components/common/Avatar';
import MatchRowLeague from '@/components/modules/badminton/competition/MatchRowLeague';
import LeagueRow from '@/components/modules/badminton/components/LeagueRow';
import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { formatTimestamp, getSlug } from '@/utils';
import { getFavoriteType, getSportType, groupByUniqueTournamentShow } from '@/utils/matchFilter';
import React from 'react';
import StarBlank from '/public/svg/star-blank.svg';

import { useRouter } from 'next/router';

import { EmptyEvent } from '@/components/common/empty';
import Link from 'next/link';
import BadmintonCoach from '/public/svg/badminton-coach.svg';
import BadmintonPlays1 from '/public/svg/badminton-plays1.svg';
import BadmintonTurnedPro from '/public/svg/badminton-turnedPro.svg';
import CalendarFill from '/public/svg/calendar-fill.svg';
import PHeight from '/public/svg/p-height.svg';
import RightArrowSVG from '/public/svg/right-arrow.svg';
import { useFollowStore } from '@/stores/follow-store';
import { StarYellowNew } from '@/components/icons/StarYellowNew';

import { MatchRowH2H } from '@/components/modules/badminton';
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
  listMatchHistory,
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

  const router = useRouter();
  const {locale} = router;

  const translatePlayer = (name:string) => {
    switch (locale) {
      case 'bn':
        return `খেলোয়াড় ${name} সম্পর্কে তথ্য`;
      case 'hi':
        return `खिलाड़ी ${name} के बारे में जानकारी`;
      case 'ja':
        return `プレイヤー${name}に関する情報`;
      case 'ko':
        return `선수 ${name}에 대한 정보`;
      case 'tr':
        return `Oyuncu ${name} hakkında bilgi`;
      case 'zh-CN':
        return `关于球员${name}的信息`;
      default:
        return `${i18n.player.about_player} ${name}`;
    }
  }

  if (!id) {
    return <></>;
  }

  return (
    <div>
      <Seo {...contentSEO(teamDetails)} />

      <div className='layout hidden lg:block'>
        <BreadCrumb className='no-scrollbar overflow-x-scroll py-5'>
          <BreadCumbLink href='/badminton' name={i18n.header.badminton} />
          <BreadCrumbSep />
          {/* <BreadCumbLink
            href={`/badminton/competition/${getSlug(firstTournament?.name)}/${firstTournament?.id}`}
            name={firstTournament?.name}
          />
          <BreadCrumbSep /> */}
          <BreadCumbLink
            href={`/badminton/competitor/${teamDetails?.name}/${teamDetails?.id}}`}
            name={teamDetails?.name}
            isEnd
          />
        </BreadCrumb>
      </div>
      <div className='flex w-full'>
        <div className='layout gap-6 flex transition-all duration-150 lg:flex-row'>
          <TwFilterCol className='flex-shrink-1 no-scrollbar sticky top-20 w-full max-w-[209px] lg:h-[91vh] lg:overflow-y-scroll'>
            <TwFilterTitle className='font-oswald'>
              {i18n.clubs.youMayBe}
            </TwFilterTitle>
            {/* <AllLeague leagueData={dataTeam} type="competitor" /> */}
            <Link
              href={`/${SPORT.BADMINTON}/player/${getSlug(teamDetails?.name)}/${teamDetails?.id}`}
              className='cursor-pointer bg-transparent '
            >
              <div className='item-hover flex cursor-pointer items-center justify-between pr-2  lg:py-2 lg:pl-2'>
                <div className='flex items-center'>
                  <Avatar
                    id={teamDetails?.id}
                    type={'team'}
                    width={36}
                    height={36}
                    isBackground={false}
                    rounded={false}
                    isSmall
                    sport={SPORT.BADMINTON}
                  />
                  <div className='flex flex-col gap-1'>
                    <span
                      className='mx-3 min-w-0 max-w-28 truncate text-left text-[13px] font-normal leading-5 text-black dark:text-white'
                      style={{ listStyle: 'outside' }}
                    >
                      {teamDetails?.short_name || teamDetails?.name}
                    </span>
                  </div>
                </div>
                <RightArrowSVG />
              </div>
            </Link>
          </TwFilterCol>
          <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
            <TwMainCol className='!col-span-2'>
              <div className='h-full overflow-hidden'>
                <div className='flex w-full flex-col'>
                  {/* <TeamCard clubData={teamDetails} /> */}
                  <SummaryPlayerCard player={teamDetails} />
                  <MatchCard listMatchHistory={listMatchHistory} playerDetail={teamDetails} />
                </div>
              </div>
            </TwMainCol>

            <TwQuickViewCol className='col-span-1 sticky top-20 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
              {teamDetails ? <>
                <div className='w-full rounded-md bg-white dark:bg-dark-card p-4'>
                  <h3 className=' uppercase text-[14px] text-black dark:text-white font-bold mb-4'>{translatePlayer(teamDetails?.name)}</h3>
                  <div className='text-csm text-black dark:text-white'>
                    <p>{i18n.qv.name}: {teamDetails?.name ? teamDetails?.name : '--'}</p>
                    <p>{i18n.player.nationality}: {teamDetails?.nationality ? teamDetails?.nationality : '--'}</p>
                    <p>{i18n.player.birthday}: {teamDetails?.birthday ? formatTimestamp(teamDetails?.birthday, 'yyyy-MM-dd') : '--'}</p>
                    <p>{i18n.player.height}: {teamDetails?.height ? teamDetails?.height : '--'}</p>
                    <p>{i18n.player.plays}: {teamDetails?.plays ? teamDetails?.plays : '--'}</p>
                  </div>
                </div>
              </> : <div className='bg-white dark:bg-dark-card rounded-md py-8'><EmptyEvent title={i18n.common.nodata} content={''} /></div>}
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
  const playerId = query.playerId || [];
  const currPlayerId = playerId.at(-1);
  const playerName = playerId[0];


  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' },
  });

  const getTeamDetails = () => instance.get(`badminton/player/${currPlayerId}`);
  const getListMatchHistory = () => instance.get(`badminton/player/${currPlayerId}/events/last/0`);

  const fetchData = async () => {
    const responses = await Promise.allSettled([
      getTeamDetails(),
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
    const listMatchHistory = resData[1];

    return {
      teamDetails: {
        id: currPlayerId,
        name: playerName,
        ...teamDetails
      },
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
      id: currPlayerId,
      sport: SPORT.BASEBALL,
      ...data,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    id: currPlayerId,
    sport: SPORT.BASEBALL,
    ...data,
  };
};

export default CompetitorDetailedPage;

const SummaryPlayerCard = ({ player }: any) => {
  const i18n = useTrans();

  const sportType = SPORT.BADMINTON;
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();

  const { playerFollowed } = useFollowStore((state) => ({
    playerFollowed: state.followed.players,
  })); // get player follow from state

  const { addPlayer, removePlayer } = useFollowStore();
  const [isFollowedPlayer, setIsFollowedPlayer] = useState(false);
  useEffect(() => {
    const playerSport = playerFollowed[sportType]
      ? playerFollowed[sportType]
      : [];
    const isFollowed = playerSport.some((item) => item?.id === player?.id);
    setIsFollowedPlayer(isFollowed);
  }, [player, playerFollowed, sportType]);
  const changeFollow = () => {
    const newPlayer = { id: player?.id, name: player.name, slug: player.slug };
    if (!isFollowedPlayer) {
      addPlayer(sportType, newPlayer);
    } else {
      removePlayer(sportType, newPlayer);
    }
    // if(session && Object.keys(session).length > 0) {
    //   const dataFavoriteId = {
    //     id: player?.id,
    //     sportType: getSportType(sportType),
    //     type: getFavoriteType('player'),
    //     isFavorite: !isFollowedPlayer,
    //   }
    //   mutate({session, dataFavoriteId})
    // }
  };
  return (
    <div className='mb-6 flex w-full flex-wrap overflow-hidden lg:rounded-lg dark-away-score lg:bg-transparent'>
      <div className='relative flex w-full items-center bg-transparent lg:bg-white lg:dark:bg-dark-stadium px-4 py-6 lg:w-1/2 lg:py-3'>
        <div className='absolute right-4 top-3' onClick={changeFollow}>
          {isFollowedPlayer ? <StarYellowNew className='h-6 w-6' /> :<StarBlank className='h-6 w-6' />}
        </div>
        <div className='flex items-center gap-3'>
          <Avatar id={player?.id} type='team' width={90} height={90} sport={SPORT.BADMINTON} />
          <div>
            <h3 className='mb-2 font-oswald text-2xl font-semibold capitalize text-white lg:text-black lg:dark:text-white'>
              {player?.name}
            </h3>
          </div>
        </div>
      </div>
      <div className='grid w-full grid-cols-2 grid-rows-3 bg-transparent lg:bg-white lg:dark:bg-dark-summary lg:w-1/2'>
        <div className='h-[68px] border-b border-player-summary px-4 py-3 lg:border-l'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary capitalize'>
            {i18n.player.nationality}
          </h4>
          {player?.country ? (
            <div className='flex items-center gap-2'>
              <Avatar
                id={player?.country?.id}
                type='country'
                width={24}
                height={24}
                rounded={false}
                isBackground={false}
                isSmall
              />
              <div className='flex flex-col items-start'>
                <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
                  {player?.country?.name}
                </b>
              </div>
            </div>
          ) : (
            <div className='font-semibold text-white'>--</div>
          )}
        </div>
        <div className='h-[68px] border-b border-l border-player-summary px-4 py-2'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary capitalize'>
            {i18n.player.birthday}
          </h4>
          <div className='flex items-start gap-2'>
            <CalendarFill className='h-6 w-6' />
            <div className='flex flex-col items-start'>
              <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
                {player?.birthday
                  ? formatTimestamp(player?.birthday, 'yyyy-MM-dd')
                  : '--'}
              </b>
              {player?.age && (
                <p className='text-[11px] text-light-secondary'>
                  {player?.age} {i18n.qv.age_unit}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className='h-[68px] border-b border-player-summary px-4 py-3 lg:border-l'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary capitalize'>
            {i18n.player.height}
          </h4>
          <div className='flex items-center gap-2'>
            <PHeight className='h-6 w-6' />
            <div className='flex flex-col items-start'>
              <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
                {player?.height ? player?.height : '--'} cm
              </b>
            </div>
          </div>
        </div>
        <div className='h-[68px] border-b border-l border-player-summary px-4 py-3'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary capitalize'>
            {i18n.player.plays}
          </h4>
          <div className='flex items-center gap-2'>
            <BadmintonPlays1 className='h-6 w-6' />
            <div className='flex flex-col items-start'>
              <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
                {player?.plays ? player?.plays : '--'}
              </b>
            </div>
          </div>
        </div>
        <div className='h-[68px] border-b border-l border-player-summary px-4 py-3'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary capitalize'>
            {i18n.player.turned_pro}
          </h4>
          <div className='flex items-center gap-2'>
            <BadmintonTurnedPro className='h-6 w-6' />
            <div className='flex flex-col items-start'>
              <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
                {player?.turnedPro ? player?.turnedPro : '--'}
              </b>
            </div>
          </div>
        </div>
        <div className='h-[68px] border-b border-l border-player-summary px-4 py-3'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary capitalize'>
            {i18n.competitor.coach}
          </h4>
          <div className='flex items-center gap-2'>
            <BadmintonCoach className='h-6 w-6' />
            <div className='flex flex-col items-start'>
              <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
                {player?.coach ? player?.coach : '--'}
              </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MatchCard = ({listMatchHistory, listMatchFuture, playerDetail}:any) => {
  const i18n = useTrans();
  const router = useRouter();
  const {locale} = router;
  const {events} = listMatchHistory;
  // const {events: eventFuture} = listMatchFuture;
  const allEvent = [...events]

  const dataMatch = allEvent ? groupByUniqueTournamentShow(allEvent) : [];
  const onClick = (match: SportEventDtoWithStat) => {
    window.location.href = `${locale != 'en' ? '/'+locale : ''}/badminton/match/${match.slug}/${match.id}`;
  };
  if (allEvent && allEvent.length == 0) return <div className='bg-white dark:bg-dark-card rounded-md py-8'><EmptyEvent title={i18n.common.nodata} content={''} /></div>
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
                    <MatchRowH2H
                      h2hEvent={match}
                      h2HFilter={'home'}
                      teamId={playerDetail?.id || match?.homeTeam?.id}
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