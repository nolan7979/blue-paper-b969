import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep, Select } from '@/components/common';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { useBkbPlayerOfTeamData, useBkbPlayerStatsOverallData, useBkbPlayerStatsSeasonsData, useListMatchPlayerData } from '@/hooks/useBasketball';
import useTrans from '@/hooks/useTrans';
import { Player } from '@/models';
import axios from 'axios';
import i18nConfig from 'i18n.config';
import { GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/navigation';
import vi from '~/lang/vi';

import ArrowRight from '/public/svg/arrow-right.svg';
import StarBlank from '/public/svg/star-blank.svg';
import StarFill from '/public/svg/star-fill.svg';
//icon summary
import CalendarFill from '/public/svg/calendar-fill.svg';
import PHeight from '/public/svg/p-height.svg';
import StadiumGround from '/public/svg/stadium-ground.svg';
import TShirt from '/public/svg/t-shirt.svg';
import { formatTimestamp, getStatsLabel, roundNumber } from '@/utils';
import React, { useEffect, useState } from 'react';
import BkbMatchRowH2H from '@/components/modules/basketball/match/BkbMatchRowH2H';
import { EmptyEvent } from '@/components/common/empty';

import { usePlayerStore } from '@/stores/player-store';
import tw from 'twin.macro';
import { SelectLeague } from '@/components/common/selects/SelectLeague';

import Seo from '@/components/Seo';

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps = async (context: any) => {
  const { params = {}, locale = vi } = context;
  const { playerParams = [] } = params;
  const playerId = playerParams[playerParams.length - 1];

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/basketball/player/${playerId}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };

  const player = await axios
    .request(config)
    .then((response) => {
      return response.data.data || {};
    })
    .catch((error) => {
      return -1;
    });

  // const urlTransfers = `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${playerId}/transfer-history`;
  // const configTransfers = {
  //   method: 'get',
  //   maxBodyLength: Infinity,
  //   url: urlTransfers,
  //   headers: {},
  // };

  // const transfers = await axios
  //   .request(configTransfers)
  //   .then((response) => {
  //     return response.data.data.transferHistory || [];
  //   })
  //   .catch((error) => {
  //     return [];
  //   });

  if (player === -1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      player,
      // transfers,
      ...(await serverSideTranslations(
        locale || 'en',
        ['common', 'football'],
        i18nConfig as never
      )),
    },
    revalidate: 1800,
  };
};

interface Props {
  player: Player | any;
  transfers: any[];
}

const PlayerDetailPage: NextPage<Props> = ({
  player,
  // transfers = [],
}: Props) => {

  const i18n = useTrans();
  const {
    id: playerId,
    name: playerName,
    team,
  } = player || {
    team: { id: '', team: { id: '', name: '' } },
  };
  const { id: teamId, name: teamName } = team;

  const { data } = useBkbPlayerOfTeamData(teamId);
  const { data: matchData } = useListMatchPlayerData(playerId)

  const contentSEO = (playerName?: any) => {
    if (!playerName) {
      return {
        templateTitle: i18n.seo.player.title.replaceAll('{playerName}', ''),
        description: i18n.seo.player.description.replaceAll('{playerName}', ''),
      };
    }

    const templateTitle = i18n.seo.player.title.replaceAll(
      '{playerName}',
      playerName
    );
    const description = i18n.seo.player.description.replaceAll(
      '{playerName}',
      playerName
    );

    return {
      templateTitle,
      description,
    };
  };

  if (!player) {
    return <Seo {...contentSEO()} />;
  }

  return (
    <>
      {/*<FootBallMenu />*/}
      <Seo {...contentSEO(playerName)} />
      <div className='layout hidden lg:block'>
        <BreadCrumb className='no-scrollbar overflow-x-scroll py-5'>
          <BreadCumbLink href='/basketball' name={i18n.header.basketball} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/basketball/competitor/${teamName}/${teamId}`}
            name={teamName}
          />
          <BreadCrumbSep />
          <BreadCumbLink href={`/basketball/player/${playerId}`} name={playerName} isEnd />
        </BreadCrumb>
      </div>
      <div className='pb-8'>
        <div className='layout flex flex-col gap-6 lg:flex-row'>
          <div className='w-[208px] hidden lg:block'>
            <TeamComponent teamName={teamName} teamId={teamId} />
            {
              data && data.length > 0 && data.map((item:any) => <PlayerRow player={item.player} key={item.player.id} />)
            }
          </div>
          <div className='flex-1'>
            {/* summary player */}
            <SummaryPlayerCard player={player} team={team} />

            {/* the list match */}
            <div className='w-full bg-dark-card lg:rounded-lg p-4'>
              {matchData && matchData.length > 0 ? (
                <>
                  <h2 className='text-[14px] font-bold text-white uppercase mb-4'>{i18n.titles.matches}</h2>
                  <ul className='space-y-1.5 lg:pr-1'>
                    {matchData.map((match: any, matchIdx: any) => {
                        return (
                          <React.Fragment key={`match-${match?.id}`}>
                            {matchIdx === 0 && (
                              <LeagueHeader
                                match={match}
                              />
                            )}
                            <BkbMatchRowH2H
                              h2hEvent={match}
                              teamId={match.id}
                              h2HFilter='h2h'
                            />
                          </React.Fragment>
                        );
                      }
                    )}
                  </ul>
                </>
              ) : <EmptyEvent title='No data available' content='' />}
            </div>
          </div>
          <div className='w-full lg:w-[385px]'>
            <div className='w-full bg-dark-card lg:rounded-lg p-4'>
              <PlayerStatsSeasonFilters player={player} />
              <PlayerStatsOverallSection player={player} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerDetailPage;

const TeamComponent = ({teamName, teamId}:any) => (
  <div className='flex items-center gap-2 p-2 border-b border-dark-time-tennis'>
    <CustomLink
      href={`/basketball/competitor/${teamName}/${teamId}`}
      target='_parent'
    >
      <Avatar
        id={teamId}
        type='team'
        width={40}
        height={40}
        rounded={false}
        isBackground={false}
      />
    </CustomLink>
    <span className='font-medium text-white uppercase font-oswald text-sm'>{teamName}</span>
  </div>
)

const PlayerRow = ({player}:any) => {
  const router = useRouter();
  return (
  <div className='flex items-center gap-2 p-2 border-b border-dark-time-tennis relative cursor-pointer' onClick={() => router.push(`/basketball/player/${player?.slug}/${player?.id}`)}>
    <Avatar
      id={player?.id}
      type='player'
      width={40}
      height={40}
    />
    <div>
      <h3 className='text-[13px] text-white'>{player?.name}</h3>
      <div className='flex gap-1'>
        <span className='text-[11px] text-white'>{player?.shirt_number}</span>
        <span className='text-[11px] text-light-secondary'>{player?.position}</span>
      </div>
    </div>
    <ArrowRight className="absolute right-2 text-white" />
  </div>
)}

const SummaryPlayerCard = ({player, team}:any) => {

  const i18n = useTrans(); 
  return(
    <div className='flex w-full flex-wrap lg:rounded-lg overflow-hidden mb-6'>
      <div className='w-full lg:w-1/2 bg-dark-stadium px-4 py-6 lg:py-3 relative flex items-center'>
        <div className='absolute right-4 top-3'>
          <StarBlank className='w-6 h-6' />
        </div>
        <div className='flex items-center gap-3'>
          <Avatar
            id={player?.id}
            type='player'
            width={90}
            height={90}
          />
          <div>
            <h3 className='text-2xl font-semibold font-oswald capitalize text-white mb-2'>{player?.name}</h3>
            <div className='flex gap-3'>
              <CustomLink
                href={`/basketball/competitor/${team?.name}/${team?.id}`}
                target='_parent'
              >
                <Avatar
                  id={team?.id}
                  type='team'
                  width={40}
                  height={40}
                  rounded={false}
                  isBackground={false}
                />
              </CustomLink>
              <div>
                <h4 className='font-medium text-white capitalize text-[13px]'>{team?.name}</h4>
                <p className=' text-[11px] text-light-secondary'>{i18n.player.ArrivingContract}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 bg-dark-summary grid grid-cols-2 grid-rows-3">
          <div className='h-[68px] lg:border-l border-b border-player-summary px-4 py-3'>
            <h4 className='text-[11px] text-light-secondary mb-[6px]'>{i18n.player.nationality}</h4>
            {player?.country ? (<div className='flex gap-2 items-center'>
              <Avatar
                id={player?.country?.id}
                type='country'
                width={24}
                height={24}
                rounded={false}
                isBackground={false}
              />
              <div className='flex flex-col items-start'>
                <b className='text-[13px] text-white font-semibold'>{player?.country?.name}</b>
              </div>
            </div>) : <div className='font-semibold text-black dark:text-white'>--</div>}
          </div>
          <div className='h-[68px] border-l border-b border-player-summary px-4 py-2'>
            <h4 className='text-[11px] text-light-secondary mb-[6px]'>{i18n.player.birthday}</h4>
            <div className='flex gap-2 items-start'>
              <CalendarFill className='w-6 h-6' />
              <div className='flex flex-col items-start'>
                <b className='text-[13px] text-white font-semibold'>{player?.birthday ? formatTimestamp(player?.birthday, 'yyyy-MM-dd') : '--'}</b>
                {player?.age && <p className='text-[11px] text-light-secondary'>{player?.age} {i18n.qv.age_unit}</p>}
              </div>
            </div>
          </div>
          <div className='h-[68px] lg:border-l border-b border-player-summary px-4 py-3'>
            <h4 className='text-[11px] text-light-secondary mb-[6px]'>{i18n.player.height}</h4>
            <div className='flex gap-2 items-center'>
              <PHeight className='w-6 h-6' />
              <div className='flex flex-col items-start'>
                <b className='text-[13px] text-white font-semibold'>{player?.height ? player?.height : '--'} cm</b>
              </div>
            </div>
          </div>
          <div className='h-[68px] border-l border-b border-player-summary px-4 py-3'>
            <h4 className='text-[11px] text-light-secondary mb-[6px]'>{i18n.player.shirtNo}</h4>
            <div className='flex gap-2 items-center'>
              <TShirt className='w-6 h-6' />
              <div className='flex flex-col items-start'>
                <b className='text-[13px] text-white font-semibold'>{player?.shirt_number ? player?.shirt_number : '--'}</b>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-start-3 h-[68px] px-4 py-3">
            <h4 className='text-[11px] text-light-secondary mb-[6px]'>{i18n.qv.position}</h4>
            <div className='flex gap-2 items-center'>
              <StadiumGround className='w-6 h-6' />
              <div className='flex flex-col items-start'>
                <b className='text-[13px] text-white font-semibold'>{player?.position ? player?.position : '--'}</b>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

const LeagueHeader = ({match}:any) => {
  const {tournament} = match;
  return(
    <div className='flex items-center gap-3'>
      <CustomLink
        href={`/basketball/competition/${tournament?.slug}/${tournament?.id}`}
        target='_parent'
      >
        <Avatar
          id={tournament?.id}
          type='competition'
          width={32}
          height={32}
          rounded={false}
          isBackground={false}
        />
      </CustomLink>
      <div>
        <h3 className='text-white text-[11px]'>{tournament?.name}</h3>
        { tournament?.country ? (
          <div className='flex gap-1'>
            <Avatar
              id={tournament?.country?.id}
              type='country'
              width={16}
              height={10}
              rounded={false}
              isBackground={false}
            />
            <span className='text-light-secondary uppercase text-[11px]'>{tournament?.country?.name ? tournament?.country?.name : '-'}</span>
          </div>
        ) : '--'}
      </div>
    </div>
  )
}

const PlayerStatsSeasonFilters = ({ player }: { player: any }) => {
  const { data, isLoading, isFetching } = useBkbPlayerStatsSeasonsData(player?.id);
  const [ssOptions, setSSOptions] = useState<any[]>([]);
  const [ssTypeOptions, setSSTypeOptions] = useState<any[]>([]);
  const { statsTournament, statsSeason, statsSeasonType, setStatsTournament, setStatsSeason, setStatsSeasonType } =
    usePlayerStore();

  const { uniqueTournamentSeasons = [], typesMap = {} } = data || {};

  useEffect(() => {
    const selectedTournaments = uniqueTournamentSeasons.filter(
      (record: any) => {
        return statsTournament?.id === record.uniqueTournament?.id;
      }
    );

    if (selectedTournaments.length) {
      const seasonOptions = selectedTournaments[0]?.seasons;
      if (seasonOptions.length) {
        setSSOptions(seasonOptions);
        setStatsSeason(seasonOptions[0]);
        const seasonTypeOptions = seasonOptions[0]?.scope;
        if (seasonTypeOptions.length) {
          setSSTypeOptions(seasonTypeOptions)
          setStatsSeasonType(seasonTypeOptions[0])
        }
      }
    }
  }, [statsTournament, setStatsSeason, uniqueTournamentSeasons, setSSOptions, setSSTypeOptions]);

  if (isLoading || isFetching || !data || !uniqueTournamentSeasons.length) {
    return <></>;
  }

  const uniqueTournaments = uniqueTournamentSeasons.map((record: any) => {
    return record.uniqueTournament;
  });

  return (
    <div className='grid grid-cols-3 gap-[6px] mb-4'>
      <div>
        <SelectLeague
          options={uniqueTournaments}
          valueGetter={setStatsTournament}
          // shownValue={statsTournament?.name}
          size='full'
          label='shortName'
        ></SelectLeague>
      </div>

      <div>
        {ssOptions.length && (
          <Select
            options={ssOptions}
            size='full'
            label='year'
            valueGetter={setStatsSeason}
            shownValue={statsSeason?.year || statsSeason?.name}
          ></Select>
        )}
      </div>

      <div>
        {ssTypeOptions.length && (
          <Select
            options={ssTypeOptions}
            size='full'
            valueGetter={setStatsSeasonType}
            shownValue={statsSeasonType?.name || statsSeasonType?.id}
          ></Select>
        )}
      </div>
    </div>
  );
};


export const BoxStatsItem = tw.div`rounded-md px-4 py-2 pt-0 mb-4 h-[70px]`;
export const TwStatsUl = tw.ul``;
export const TwStatsLi = tw.li`flex justify-between`;

const PlayerStatsOverallSection = ({ player }: { player: any }) => {
  const { statsSeason, statsSeasonType } = usePlayerStore();
  const i18n = useTrans();

  const {
    data: overallStats,
  } = useBkbPlayerStatsOverallData(
    player?.id,
    statsSeasonType?.id,
    statsSeason?.id
  );

  const staticArr = ['points','rebounds','assists','steals']

  if (!overallStats) {
    return <><EmptyEvent title='No data available' content='' /></>;
  }

  return (
    <div>
      <div className='grid grid-cols-4 gap-3'>
        {staticArr.map((it:any) => (
          <div key={it} className='text-center'>
            <h4 className='text-[13px] text-white font-bold uppercase mb-3'>{it}</h4>
            <BoxStatsItem className='dark:border-linear-box bg-white dark:bg-primary-gradient flex flex-col justify-center'>
              <div className='text-[13px] text-white font-bold'>{overallStats[it]}</div>
              {/* <div className='text-[13px] text-light-secondary font-bold'># 27</div> */}
            </BoxStatsItem>
          </div>
        ))}
      </div>
      <TwStatsUl className='divide-list pb-2.5'>
        {Object.keys(overallStats).filter((filItem:any) => !staticArr.includes(filItem)).map((stat: any, idx: number) => {
          return (
            <TwStatsLi key={idx} className=' item-hover p-1.5 text-[13px]'>
              <span>{i18n.statsLabel?.[stat as keyof Object] ? i18n.statsLabel?.[stat as keyof Object] : stat}</span>
              <span className='text-white'>{overallStats[stat] ? roundNumber(overallStats[stat]) : '-'}</span>
            </TwStatsLi>
          );
        })}
      </TwStatsUl>
    </div>
  );
};