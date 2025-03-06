/* eslint-disable @next/next/no-img-element */
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { Fragment, useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';

import {
  usePlayerLastMatchesData,
  usePlayerMatchStatsData,
} from '@/hooks/useFootball';

import { PlayerHeatmap } from '@/components/common';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import PlayerSkeleton from '@/components/common/skeleton/homePage/PlayerStatsPopup';
import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { RatingBadge } from '@/components/modules/football/RatingBadge';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import { useFollowStore } from '@/stores/follow-store';
import { usePlayerStore } from '@/stores/player-store';

import { SportEventDto } from '@/constant/interface';
import {
  formatMatchTimestamp,
  getSlug,
  getStatsLabel,
  roundNum,
  roundNumber,
  StatsLabel,
} from '@/utils';

import { EmptyEvent } from '@/components/common/empty';
import { TwSectionWrapper } from '@/components/modules/common';
import { SPORT } from '@/constant/common';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import useTrans from '@/hooks/useTrans';
import { cn } from '@/utils/tailwindUtils';
import { useSession } from 'next-auth/react';
import MessageBoxSVG from '/public/svg/message-box.svg';
import OneSVG from '/public/svg/one.svg';

export default function PlayerStatsWithPopUp({
  children,
  matchData,
  player,
  isHome = true,
  classes,
}: {
  children: any;
  matchData: any;
  player: any;
  isHome?: boolean;
  classes?: string;
}) {
  const { coupleQueue, enCoupleQueue } = usePlayerStore();

  return (
    <div
      onClick={() => {
        let shown = false;
        for (const couple of coupleQueue) {
          if (couple.player?.id === player?.id) {
            shown = true;
          }
        }
        if (!shown) {
          enCoupleQueue({ matchData, player, isHome });
        }
      }}
      className={`cursor-pointer ${classes ? classes : ''}`}
    >
      {children}
    </div>
  );
}

export const PlayerStatsPopUpContentContainer = () => {
  const { coupleQueue, removeQueueAt } = usePlayerStore();

  return (
    <div
      className={cn(
        'pointer-events-none fixed left-0 top-[25%] flex h-[75vh] justify-start gap-4 transition-all duration-500 ease-in-out lg:pl-4 w-auto',
        {
          'z-50': coupleQueue.length > 0,
          '-z-10 hidden': coupleQueue.length === 0,
        }
      )}
    >
      {coupleQueue.map((player, index: number) => {
        return (
          <React.Fragment key={`player-${index}`}>
            <Transition
              as={Fragment}
              show={coupleQueue.length > 0}
              enter='transform transition duration-[300ms]'
              enterFrom='opacity-0 scale-y-50'
              enterTo='opacity-100 scale-100'
              leave='transform transition ease-in-out duration-[300ms]'
              leaveFrom='opacity-100 scale-100 '
              leaveTo='opacity-0 scale-0 -translate-x-full translate-y-full'
            >
              <div className='pointer-events-auto relative z-10 w-[22.5rem] overflow-y-auto rounded-md bg-white shadow-[0px_4px_14px_0px_#00000040] no-scrollbar  dark:bg-dark-modal'>
                {/* {player && (
                  <div className='absolute left-0 top-0 z-0 w-full'>
                    <Image
                      alt='background'
                      loading='lazy'
                      className='h-auto w-full'
                      src='/images/football/players/arc_background.png'
                      height={96}
                      width={360}
                    />
                  </div>
                )} */}
                <PlayerStatsPopUpContent {...player} idxPopup={index} />
              </div>
            </Transition>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const PlayerStatsPopUpContent = ({
  player,
  matchData,
  isHome = true,
  idxPopup,
}: {
  matchData: SportEventDto;
  player: any;
  isHome: boolean;
  idxPopup: number;
}) => {
  const { status } = matchData;
  const { removeQueueAt } = usePlayerStore();
  return (
    <>
      {status.code! > 0 && (
        <StatsContent
          player={player}
          matchData={matchData}
          isHome={isHome}
          onClick={() => removeQueueAt(idxPopup)}
        />
      )}
      {status.code! === 0 && (
        <PlayerLastMatches
          player={player}
          onClick={() => removeQueueAt(idxPopup)}
        />
      )}
    </>
  );
};

const StatsContent = ({
  player,
  matchData,
  isHome = true,
  onClick,
}: {
  player: any;
  matchData: SportEventDto;
  isHome?: boolean;
  onClick: () => void;
}) => {
  const { addPlayer, removePlayer } = useFollowStore();
  const [isFollowedPlayer, setIsFollowedPlayer] = useState(false);
  const sportType = 'football';
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();
  const i18n = useTrans();
  const { playerFollowed } = useFollowStore((state) => ({
    playerFollowed: state.followed.players,
  })); // get playe

  const changeFollow = (player: any) => {
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

  const {
    data: playerStats,
    isLoading,
    isFetching,
    isError: isErrorStats,
  } = usePlayerMatchStatsData(matchData?.id, player?.id);

  useEffect(() => {
    const playerSport = playerFollowed[sportType]
      ? playerFollowed[sportType]
      : [];
    const isFollowed = playerSport.some((item) => item?.id === player?.id);
    setIsFollowedPlayer(isFollowed);
  }, [player, playerFollowed, sportType]);

  if (isLoading || isFetching)
    return (
      <>
        <PlayerSkeleton />
      </>
    );

  if (!playerStats || isErrorStats) {
    return <></>;
  }
  const { statistics } = playerStats;

  const mappingStats: { label: string; info: { [key: string]: any } }[] = [
    {
      label: 'matches',
      info: {
        first: statistics?.first,
        goals: statistics?.goals,
        penalty: statistics?.penalty,
        minutes_played: statistics?.minutes_played,
        red_cards: statistics?.red_cards,
        yellow_cards: statistics?.yellow_cards,
        assists: statistics?.assists,
        dribble: statistics?.dribble,
        dribble_succ: statistics?.dribble_succ,
        dispossessed: statistics?.dispossessed,
        fouls: statistics?.fouls,
        rating: statistics?.rating,
      },
    },
    {
      label: 'attack',
      info: {
        shots: statistics?.shots,
        shots_on_target: statistics?.shots_on_target,
        offsides: statistics?.offsides,
        fastbreaks: statistics?.fastbreaks,
        fastbreak_shots: statistics?.fastbreak_shots,
      },
    },
    {
      label: 'goalkeeper',
      info: {
        saves: statistics?.saves,
        good_high_claim: statistics?.good_high_claim,
      },
    },
    {
      label: 'pass',
      info: {
        passes: statistics?.passes,
        passes_accuracy: statistics?.passes_accuracy,
        long_balls: statistics?.long_balls,
        long_balls_accuracy: statistics?.long_balls_accuracy,
        key_passes: statistics?.key_passes,
        crosses: statistics?.crosses,
        crosses_accuracy: statistics?.crosses_accuracy,
        poss_losts: statistics?.poss_losts,
      },
    },
    {
      label: 'defence',
      info: {
        clearances: statistics?.clearances,
        blocked_shots: statistics?.blocked_shots,
        tackles: statistics?.tackles,
        interceptions: statistics?.interceptions,
        duels: statistics?.duels,
        duels_won: statistics?.duels_won,
      },
    },
  ];

  const { homeTeam, awayTeam, homeScore, awayScore } = matchData;
  const playerRating = roundNum(statistics?.rating || 0, 1);
  return (
    <div className=' relative z-10 space-y-2 no-scrollbar'>
      <div className='bg-secondary-gradient sticky top-0 z-10 flex flex-col items-center justify-center px-2.5 py-4'>
        <div className=' z-[11] flex h-5 w-full  justify-end'>
          <button className='rounded-full p-1' onClick={onClick}>
            <HiX className='h-4 w-4 fill-[#28465b]'></HiX>
          </button>
        </div>

        <div className='relative mx-auto  rounded-full border-4 border-all-blue'>
          <CustomLink href={`/football/player/${player?.id}`} target='_parent'>
            <Avatar
              id={player?.id}
              type='player'
              width={80}
              height={80}
              isSmall
            />
          </CustomLink>
          <div className='pointer-events-none absolute left-[50%] top-2 z-10 ml-12 w-max min-w-10 translate-x-[-50%] translate-y-0'>
            <RatingBadge
              className='!h-8 !w-auto px-2 !text-base'
              point={Number(playerRating) || 0}
            />
          </div>
        </div>
        <CustomLink href={`/football/player/${player?.id}`} target='_parent'>
          <div
            className='mb-2 truncate text-sm font-semibold leading-6'
            test-id='player-name'
          >
            {player.name}
          </div>
        </CustomLink>
      </div>
      <div className='space-y-4 px-2.5'>
        <div className='flex place-content-center items-center gap-x-4 rounded-full bg-light-match py-3 dark:bg-dark-match'>
          <div className='relative'>
            <MessageBoxSVG className='h-10 w-10' />
            <FaBell className='absolute right-0 top-0 h-5 w-5 text-logo-yellow' />
            <OneSVG className='absolute right-0 top-0 h-3 w-3 text-red-600' />
          </div>
          <div className='space-y-1.5'>
            <div className='text-csm font-semibold not-italic leading-5'>
              {i18n.player.receiveInfo}
            </div>
            <div className='flex items-center gap-3'>
              <button
                className={`flex items-center gap-1 rounded-full ${isFollowedPlayer ? 'bg-light-black' : 'bg-dark-button'
                  } px-3 py-2 text-csm font-medium not-italic leading-4 text-white`}
                onClick={() => changeFollow(player)}
              >
                {isFollowedPlayer ? (
                  <span>{i18n.activity.following}</span>
                ) : (
                  <span className='flex items-center gap-1'>
                    {i18n.activity.follow}
                  </span>
                )}
              </button>
              <span className='flex items-center gap-1 text-cxs font-medium'>
                <span className=' text-dark-win'>2.9k</span>
                <span className=' '>{i18n.activity.following_users}</span>
              </span>
            </div>
          </div>
        </div>

        <div className=''>
          <div className='flex items-center justify-start gap-1 truncate py-1 text-csm font-normal leading-4'>
            <div className='flex items-center'>
              <div>
                <SoccerTeam name={`${homeTeam.name}`} team={homeTeam} />
              </div>
            </div>
            <div className=''>
              {homeScore?.display} - {awayScore?.display}
            </div>
            <div className='flex items-center'>
              <SoccerTeam
                name={awayTeam.name}
                team={awayTeam}
                isReverse={true}
              />
            </div>
          </div>
        </div>

        {/* <div>
        <Image
          src={'/images/football/players/stadium_player.png'}
          alt='stadium'
          width={400}
          className='w-full'
          height={100}
        />
      </div> */}
        <div className='relative flex items-center justify-center'>
          <PlayerHeatmap
            playerId={player.id}
            isHome={isHome}
            matchId={matchData.id}
          />
        </div>

        <div className='space-y-2'>
          <ul className='space-y-1 px-1 pb-3'>
            {mappingStats.map((stat, idx) => {
              const countValuesStatsInfo = Object.values(stat.info).reduce(
                (acc, curr) => acc + curr,
                0
              );
              return (
                <li
                  key={idx}
                  className={clsx(
                    'flex flex-col justify-between',
                    countValuesStatsInfo > 0 ? 'py-1' : ''
                  )}
                >
                  <div className='truncate text-xs font-medium uppercase leading-4 text-dark-main dark:text-white'>
                    {countValuesStatsInfo > 0
                      ? getStatsLabel(stat.label as StatsLabel, i18n)
                      : null}
                  </div>
                  <div className='[&>*:not(:last-child)]:border-b'>
                    {Object.keys(stat.info).map((key, idx) => {
                      if (stat.info[key] > 0) {
                        return (
                          <div
                            key={`info-${key}`}
                            className='flex w-full justify-between border-dotted border-gray-600 py-1'
                          >
                            <div className='truncate  text-sm font-normal leading-4 text-dark-main dark:text-dark-text'>
                              {getStatsLabel(key as StatsLabel, i18n)}
                            </div>
                            <div
                              key={idx}
                              className='truncate text-sm leading-4 text-dark-draw dark:text-white'
                            >
                              {roundNumber(stat.info[key] as number)}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </li>
              );
            })}
            {/* {statistics &&
              Object?.keys(statistics)?.map((statKey: any, idx: number) => {
                const typedKey = statKey as StatsLabel;
                if (
                  typeof statKey === 'string' &&
                  typeof statistics[statKey] === 'number' && statistics[statKey] > 0
                ) {
                  return (
                    <li
                      key={idx}
                      className={clsx(
                        'item-hover flex items-center justify-between py-1'
                      )}
                    >
                      <div className='truncate  text-sm font-normal leading-4 text-dark-main dark:text-dark-text'>
                        {getStatsLabel(typedKey, i18n)}
                      </div>
                      <div className='truncate text-sm leading-4 text-dark-draw dark:text-dark-text'>
                        {roundNumber(statistics[statKey])}
                      </div>
                    </li>
                  );
                }
              })} */}
          </ul>
        </div>
      </div>
    </div>
  );
};

const PlayerLastMatches = ({
  player,
  onClick,
}: {
  player: any;
  onClick: () => void;
}) => {
  const {
    data: playerLastMatches,
    isLoading,
    isFetching,
    isError,
  } = usePlayerLastMatchesData(player?.id);
  const i18n = useTrans();
  if (isLoading || isFetching || isError) {
    return <></>;
  }

  const { events = [] } = playerLastMatches;

  if (events.length === 0) {
    return (
      <TwSectionWrapper>
        <EmptyEvent content={i18n.common.nodata} />
      </TwSectionWrapper>
    );
  }

  return (
    <>
      <div className=' bg-secondary-gradient sticky top-0 z-10 border-b border-b-dark-text/20 px-2.5 py-4'>
        <div className=' flex flex-col items-center justify-center gap-2 '>
          <div className=' z-[11] flex h-5 w-full  justify-end'>
            <button className='rounded-full p-1' onClick={onClick}>
              <HiX className='h-4 w-4 fill-[#28465b]'></HiX>
            </button>
          </div>
          <div className='mx-auto w-fit rounded-full border-4 border-all-blue'>
            <Avatar id={player?.id} type='player' width={80} height={80} />
          </div>
          <div className='flex flex-col place-content-center'>
            <CustomLink
              href={`/football/player/${getSlug(player.name)}/${player?.id}`}
              target='_parent'
            >
              <div
                className='truncate text-base font-bold leading-6'
                test-id='player-name-last-match'
              >
                {player.name}
              </div>
            </CustomLink>
          </div>
        </div>
      </div>
      <ul className='space-y-1'>
        {events
            .slice()
            .reverse()
            .map((match: any, idx: number) => {
              const {
                startTimestamp,
                homeTeam,
                awayTeam,
                homeScore,
                awayScore,
                status: matchStatus,
              } = match;

              const [first, second] = formatMatchTimestamp(
                startTimestamp,
                matchStatus,
                false
              );
              const slug = getSlug(homeTeam.name + '-' + awayTeam.name);
              return (
                <CustomLink
                  key={idx}
                  href={`/football/match/${slug}/${match?.id}`}
                  target='_parent'
                >
                  <li className='item-hover flex items-center py-1.5 '>
                    <div className='flex w-12 flex-col items-center truncate text-cxs font-normal leading-4 text-dark-text'>
                      <div>{first}</div>
                      <div>{second}</div>
                    </div>
                    <div className=' flex flex-1 truncate font-sans text-sm font-normal leading-4 text-dark-text'>
                      {/* Team name */}
                      <div className=' flex-1 flex-col justify-between space-y-1'>
                        <div className=' flex gap-2'>
                          <div className=''>
                            <CustomLink
                              href={`${SPORT.FOOTBALL}/competitor/${homeTeam.slug}/${homeTeam?.id}`} // TODO use slug
                              target='_parent'
                            >
                              <Avatar
                                id={homeTeam?.id}
                                type='team'
                                width={18}
                                height={18}
                                isBackground={false}
                                rounded={false}
                                isSmall
                              />
                            </CustomLink>
                          </div>
                          <TwTeamName>
                            <span>{homeTeam?.name}</span>
                          </TwTeamName>
                        </div>
                        <div className=' flex gap-2'>
                          <div className=' '>
                            <CustomLink
                              href={`${SPORT.FOOTBALL}/competitor/${awayTeam.slug}/${awayTeam?.id}`}
                              target='_parent'
                            >
                              <Avatar
                                id={awayTeam?.id}
                                type='team'
                                width={18}
                                height={18}
                                isBackground={false}
                                rounded={false}
                                isSmall
                              />
                            </CustomLink>
                          </div>
                          <div className='my-auto shrink truncate text-csm'>
                            {awayTeam?.name}
                          </div>
                        </div>
                      </div>
                      {/* Score */}
                      <div className='flex w-3 flex-col justify-between text-center text-csm'>
                        <div className=''>{homeScore.display}</div>
                        <div className=''>{awayScore.display}</div>
                      </div>
                    </div>
                    <div className='flex w-12 place-content-center items-center truncate  text-sm font-normal leading-4 text-dark-text'>
                      TBD
                    </div>
                  </li>
                </CustomLink>
              );
            })}
      </ul>
    </>
  );
};
