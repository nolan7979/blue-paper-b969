/* eslint-disable @next/next/no-img-element */
import { Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { HiX } from 'react-icons/hi';
import tw from 'twin.macro';

import {
  usePlayerLastMatchesData,
  usePlayerMatchStatsData,
} from '@/hooks/useFootball';

import CustomLink from '@/components/common/CustomizeLink';
import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import { usePlayerStore } from '@/stores/player-store';

import {
  formatMatchTimestamp,
  getFullPosition,
  getImage,
  getStatsLabel,
  Images,
  roundNumber,
  StatsLabel,
} from '@/utils';

export default function PlayerStatsWithPopUpb({
  children,
  matchData,
  player,
}: {
  children: any;
  matchData: any;
  player: any;
}) {
  const { isShowing1, setIsShowing1 } = usePlayerStore();
  const { isShowing2, setIsShowing2 } = usePlayerStore();
  const { isShowing3, setIsShowing3 } = usePlayerStore();
  const { couple1, couple2, setCuple1, setCuple2, setCuple3 } =
    usePlayerStore();

  return (
    <div
      onClick={() => {
        // TODO
        if (!isShowing1) {
          setIsShowing1(!isShowing1 && player?.id !== couple2?.player?.id);
          setCuple1({ matchData, player });
        } else if (!isShowing2) {
          setIsShowing2(!isShowing2 && player?.id !== couple1?.player?.id);
          setCuple2({ matchData, player });
        } else if (player?.id !== couple1?.player?.id) {
          setIsShowing2(true);
          setCuple2({ matchData, player });
        }
      }}
      className='cursor-pointer'
    >
      {children}
    </div>
  );
}

const PlayerStatsPopUpContentContainerb = () => {
  const { isShowing1, setIsShowing1 } = usePlayerStore();
  const { isShowing2, setIsShowing2 } = usePlayerStore();
  const { isShowing3, setIsShowing3 } = usePlayerStore();
  // const { couple1, couple2, couple3 } = usePlayerStore();

  return (
    <div
      className='pointer-events-none fixed left-0 top-[25%] flex h-[75vh] w-3/4 justify-start gap-4 pl-4 transition-all duration-500 ease-in-out'
      css={[
        (isShowing2 || isShowing1 || isShowing3) && tw`z-10`,
        !isShowing2 && !isShowing1 && !isShowing3 && tw`-z-10`,
      ]}
    >
      <Transition
        as={Fragment}
        show={isShowing1}
        enter='transform transition duration-[300ms]'
        enterFrom='opacity-0 scale-y-50'
        enterTo='opacity-100 scale-100'
        leave='transform transition ease-in-out duration-[300ms]'
        leaveFrom='opacity-100 scale-100 '
        // leaveTo='opacity-0 right-0'
        leaveTo='opacity-0 scale-0 -translate-x-full translate-y-full'
      >
        <div
          className='pointer-events-auto w-72 overflow-scroll rounded-md bg-light-match px-2.5 py-1.5 shadow-md dark:bg-dark-match'
          // css={[isShowing3 && isShowing2 && 'order-3']}
          css={[isShowing2 && tw`order-1`]}
        >
          <div className='flex justify-end'>
            <button
              className='rounded-full p-1'
              onClick={() => setIsShowing1(false)}
            >
              <HiX className='h-4 w-4'></HiX>
            </button>
            {/*  */}
          </div>
          {isShowing1 && (
            <>
              <PlayerStatsPopUpContent1></PlayerStatsPopUpContent1>
            </>
          )}
        </div>
      </Transition>

      <Transition
        as={Fragment}
        show={isShowing2}
        enter='transform transition duration-[300ms]'
        enterFrom='opacity-0 scale-y-50'
        enterTo='opacity-100 scale-100'
        leave='transform transition ease-in-out duration-[300ms]'
        leaveFrom='opacity-100 scale-100 '
        // leaveTo='opacity-0 right-0'
        leaveTo='opacity-0 scale-0 -translate-x-full translate-y-full'
      >
        <div
          className='pointer-events-auto w-72 overflow-scroll rounded-md bg-light-match px-2.5 py-1.5 shadow-md dark:bg-dark-match'
          css={[isShowing1 && tw`order-1`]}
        >
          <div className='flex justify-end'>
            <button
              className='rounded-full p-1'
              onClick={() => setIsShowing2(false)}
            >
              <HiX className='h-4 w-4'></HiX>
            </button>
          </div>
          {isShowing2 && (
            <>
              <PlayerStatsPopUpContent2></PlayerStatsPopUpContent2>
            </>
          )}
        </div>
      </Transition>

      <Transition
        as={Fragment}
        show={isShowing3}
        enter='transform transition duration-[300ms]'
        enterFrom='opacity-0 scale-y-50'
        enterTo='opacity-100 scale-100'
        leave='transform transition ease-in-out duration-[300ms]'
        leaveFrom='opacity-100 scale-100 '
        // leaveTo='opacity-0 right-0'
        leaveTo='opacity-0 scale-0 -translate-x-full translate-y-full'
      >
        <div
          className='pointer-events-auto w-72 overflow-scroll rounded-md bg-light-match px-2.5 py-1.5 shadow-md dark:bg-dark-match'
          css={[isShowing2 && isShowing1 && 'order-3']}
        >
          <div className='flex justify-end'>
            <button
              className='rounded-full p-1'
              onClick={() => setIsShowing3(false)}
            >
              <HiX className='h-4 w-4'></HiX>
            </button>
          </div>
          {isShowing3 && <PlayerStatsPopUpContent3></PlayerStatsPopUpContent3>}
        </div>
      </Transition>
    </div>
  );
};

const PlayerStatsPopUpContent1 = () => {
  const { couple1 } = usePlayerStore();
  const { player = {}, matchData = {} } = couple1 || {};
  const { status = {} } = matchData || {};
  const { code = '' } = status || {};

  const {
    data: playerStats = {},
    isLoading,
    isFetching,
    isError,
  } = usePlayerMatchStatsData(matchData?.id, player?.id);
  if (isLoading || isFetching) return <></>;

  return (
    <>
      {code >= 91 && (
        <StatsContent
          player={player}
          playerStats={playerStats}
          matchData={matchData}
        ></StatsContent>
      )}
      {code < 91 && <PlayerLastMatches player={player}></PlayerLastMatches>}
    </>
  );
};

const PlayerStatsPopUpContent2 = () => {
  const { couple2 } = usePlayerStore();
  const { player = {}, matchData = {} } = couple2 || {};
  const { status = {} } = matchData || {};
  const { code = '' } = status || {};

  const {
    data: playerStats = {},
    isLoading,
    isFetching,
    isError,
  } = usePlayerMatchStatsData(matchData?.id, player?.id);
  if (isLoading || isFetching) return <></>;

  return (
    <>
      {code >= 91 && (
        <StatsContent
          player={player}
          playerStats={playerStats}
          matchData={matchData}
        ></StatsContent>
      )}
      {code < 91 && <PlayerLastMatches player={player}></PlayerLastMatches>}
    </>
  );
};

const PlayerStatsPopUpContent3 = () => {
  const { couple3 } = usePlayerStore();

  const { player = {}, matchData = {} } = couple3 || {};

  const {
    data: playerStats = {},
    isLoading,
    isFetching,
    isError,
  } = usePlayerMatchStatsData(matchData?.id, player?.id);
  if (isLoading || isFetching) return <></>;

  return (
    <StatsContent
      player={player}
      playerStats={playerStats}
      matchData={matchData}
    ></StatsContent>
  );
};

const StatsContent = ({
  player,
  playerStats,
  matchData,
}: {
  player: any;
  playerStats: any;
  matchData: any;
}) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [err, setErr] = useState(false);

  const {
    player: playerInfo = {},
    statistics = {},
    team = {},
    position = '',
  } = playerStats || {};

  const {
    homeTeam = {},
    awayTeam = {},
    homeScore = {},
    awayScore = {},
  } = matchData || {};

  return (
    <div className=' space-y-2 overflow-scroll'>
      <div className=' flex gap-2 border-b border-b-dark-text/20 pb-2 '>
        <img
          src={
            isError
              ? '/images/football/players/unknown1.webp'
              : `${getImage(Images.player, player?.id)}`
          }
          width={48}
          height={48}
          alt=''
          onError={() => {
            setIsError(true);
          }}
          className='h-12 w-12 rounded-full object-contain'
        ></img>
        <div className='flex flex-col place-content-center'>
          <CustomLink href={`/football/player/${player?.id}`} target='_parent'>
            <div className='truncate text-base font-bold leading-6'>
              {player.name}
            </div>
          </CustomLink>

          <div className='flex items-center gap-1 text-ccsm font-normal leading-4 text-dark-text'>
            {team?.id && (
              <img
                src={`${
                  err
                    ? '/images/football/teams/unknown-team.png'
                    : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${team?.id}/image`
                }`}
                width={18}
                height={18}
                alt=''
                className='rounded-full'
                onError={() => setErr(true)}
              ></img>
            )}
            {playerInfo.position && (
              <div className=''>- {getFullPosition(playerInfo.position)}</div>
            )}
          </div>
        </div>
      </div>
      <div className=''>
        <div className='flex place-content-center items-center gap-2 truncate py-1 text-sm font-medium leading-4'>
          <div className='flex items-center'>
            <div>
              <SoccerTeam
                logoUrl={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${homeTeam?.id}/image`}
                name={`${homeTeam.name}`}
                team={homeTeam}
              ></SoccerTeam>
            </div>
          </div>
          <div className=''>
            {homeScore.display} - {awayScore.display}
          </div>
          <div className='flex items-center'>
            <SoccerTeam
              logoUrl={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${awayTeam?.id}/image`}
              name={awayTeam.name}
              team={awayTeam}
              isReverse={true}
            ></SoccerTeam>
          </div>
        </div>
      </div>
      <div className='space-y-2'>
        <div className='bg1 h-36 rounded-lg'></div>
        <ul className='divide-list px-1'>
          {Object.keys(statistics).map((statKey: any, idx: number) => {
            const typedKey = statKey as StatsLabel;
            if (
              typeof statKey === 'string' &&
              (typeof statistics[statKey] === 'string' ||
                typeof statistics[statKey] === 'number')
            ) {
              return (
                <li
                  key={idx}
                  className='item-hover flex items-center justify-between py-1'
                >
                  <div className='truncate  text-sm font-normal leading-4'>
                    {getStatsLabel(typedKey)}
                  </div>
                  <div className='truncate  text-sm font-normal leading-4'>
                    {roundNumber(statistics[statKey])}
                  </div>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

const PlayerLastMatches = ({ player }: { player: any }) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [err1, setErr1] = useState(false);
  const [err2, setErr2] = useState(false);

  const {
    data: playerLastMatches = {},
    isLoading,
    isFetching,
  } = usePlayerLastMatchesData(player?.id);

  if (isLoading || isFetching) {
    return <></>;
  }

  const {
    events = [],
    hasNextPage,
    incidentsMap,
    onBenchMap,
    playedForTeamMap,
    statisticsMap,
  } = playerLastMatches || {};

  return (
    <>
      <div className=' flex gap-2 border-b border-b-dark-text/20 pb-2 '>
        <img
          src={
            isError
              ? '/images/football/players/unknown1.webp'
              : `${getImage(Images.player, player?.id)}`
          }
          width={48}
          height={48}
          alt=''
          onError={() => {
            setIsError(true);
          }}
          className='h-12 w-12 rounded-full object-contain'
        ></img>
        <div className='flex flex-col place-content-center'>
          <CustomLink href={`/football/player/${player?.id}`} target='_parent'>
            <div className='truncate text-base font-bold leading-6'>
              {player.name}
            </div>
          </CustomLink>

          <div className='flex items-center gap-1 text-ccsm font-normal leading-4 text-dark-text'>
            {/* {team?.id && (
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${team?.id}/image`}
                width={18}
                height={18}
                alt=''
                className='rounded-full'
              ></img>
            )} */}
            {/* {playerInfo.position && (
              <div className=''>- {getFullPosition(playerInfo.position)}</div>
            )} */}
          </div>
        </div>
      </div>
      <ul className=''>
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
              status: matchStatus = {},
            } = match || {};

            const [first, second] = formatMatchTimestamp(
              startTimestamp,
              matchStatus,
              false
            );

            return (
              <CustomLink
                key={idx}
                href={`/match/football/${match?.id}`}
                target='_parent'
              >
                <li className='item-hover flex items-center py-1.5 '>
                  <div className='flex w-12 flex-col items-center truncate text-cxs font-normal leading-4 text-dark-text'>
                    <div>{first}</div>
                    <div>{second}</div>
                  </div>
                  <div className=' flex flex-1 truncate  text-sm font-normal leading-4 text-dark-text'>
                    {/* Team name */}
                    <div className=' flex-1 flex-col justify-between'>
                      <div className=' flex gap-2'>
                        <div className=''>
                          <CustomLink
                            href={`/competitor/${homeTeam.slug}/${homeTeam?.id}`}
                            target='_parent'
                          >
                            <img
                              src={`${
                                err1
                                  ? '/images/football/teams/unknown-team.png'
                                  : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${homeTeam?.id}/image`
                              }`}
                              alt='...'
                              width={18}
                              height={18}
                              onError={() => setErr1(true)}
                            ></img>
                          </CustomLink>
                        </div>
                        <TwTeamName>
                          <span>{homeTeam?.name}</span>
                        </TwTeamName>
                      </div>
                      <div className=' flex gap-2'>
                        <div className=' '>
                          <CustomLink
                            href={`/competitor/${awayTeam.slug}/${awayTeam?.id}`}
                            target='_parent'
                          >
                            <img
                              src={`${
                                err2
                                  ? '/images/football/teams/unknown-team.png'
                                  : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${awayTeam?.id}/image`
                              }`}
                              alt='...'
                              width={18}
                              height={18}
                              onError={() => setErr2(true)}
                            ></img>
                          </CustomLink>
                        </div>
                        <div className='my-auto shrink truncate text-csm font-thin'>
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
