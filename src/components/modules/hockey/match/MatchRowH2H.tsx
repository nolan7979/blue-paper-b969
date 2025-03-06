import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import { useWindowSize } from '@/hooks';

import {
  FormBadge,
  SoccerTeam,
} from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import {
  FirstCol,
  TwBellCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { useFollowStore, useMatchStore, useMatchStore2nd } from '@/stores';

import MatchTimestamp from '@/components/modules/hockey/match/MatchTimeStamp';
import { SPORT } from '@/constant/common';
import { FinishedStates, SportEventDtoWithStat } from '@/constant/interface';
import MatchScoreColumn from '@/modules/hockey/liveScore/components/MatchScoreColumn';
import { Images, getImage, isMatchesHaveScoreHockey } from '@/utils';
import clsx from 'clsx';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { StarBlank } from '@/components/icons/StarBlank';
import { timeStampFormat } from '@/utils/timeStamp';

const MatchRowH2H = ({
  h2hEvent,
  h2HFilter,
  teamId,
  type2nd = false,
  showQuickView,
}: {
  h2hEvent: SportEventDtoWithStat;
  h2HFilter?: string;
  teamId?: string;
  type2nd?: boolean;
  showQuickView?: boolean;
}) => {
  const {
    id,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    winnerCode = 0,
    status,
    uniqueTournament,
    startTimestamp = 0,
    time,
    scores
  } = h2hEvent;

  const { currentPeriodStartTimestamp } = time || {};

  const { width } = useWindowSize();
  const router = useRouter();
  const { asPath } = router;
  const isDetail = useMemo(() => {
    return asPath.includes('/match') || asPath.includes('/competitor');
  }, [asPath]);
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    // toggleShowSelectedMatch,
  } = useMatchStore();

  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const isFinished =
      status?.type === 'finished' || FinishedStates.includes(status.code);

  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { addMatches, removeMatches } = useFollowStore();
  const [isFollowed, setIsFollowed] = useState(() => {
    const isMatchFollowed = matchFollowed.some(
      (item: any) => item.matchId === id
    );
    return isMatchFollowed;
  });

  const {
    selectedMatch: selectedMatch2nd,
    // toggleShowSelectedMatch,
  } = useMatchStore2nd();

  const isSelectedMatch = useMemo(() => {
    return selectedMatch === id;
  }, [selectedMatch]);

  const isSelectMatch2nd = useMemo(() => {
    return selectedMatch2nd === id;
  }, [selectedMatch2nd]);

  let isWin = false;
  if (h2HFilter === 'home' || h2HFilter === 'away') {
    if (
      (teamId === homeTeam?.id && winnerCode === 1) ||
      (teamId === awayTeam?.id && winnerCode === 2)
    ) {
      isWin = true;
    }
  } else {
    isWin = false;
  }

  let isLoss = false;
  if (h2HFilter === 'home' || h2HFilter === 'away') {
    if (
      (teamId === homeTeam?.id && winnerCode === 2) ||
      (teamId === awayTeam?.id && winnerCode === 1)
    ) {
      isLoss = true;
    }
  } else {
    isLoss = false;
  }

  const changeFollow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isFollowed) {
      removeMatches(id);
      setIsFollowed(false);
    } else {
      addMatches(
        id,
        formattedTime,
        formattedDate,
        h2hEvent?.uniqueTournament?.id || '',
        h2hEvent?.tournament?.category?.name || '',
        h2hEvent?.tournament?.name || '',
        h2hEvent?.uniqueTournament?.name || '',
        SPORT.ICE_HOCKEY
      );
      setIsFollowed(true);
    }
  };

  return (
    <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <li
        className={clsx(
          'flex cursor-pointer items-center gap-2 rounded-md  bg-white p-1.5 text-sm dark:bg-transparent',
          {
            'lg:!border-all-blue':
              isSelectedMatch && !type2nd && !!showQuickView,
          },
          {
            'lg:!border-all-blue':
              isSelectMatch2nd && type2nd && !!showQuickView,
          }
        )}
        onClick={() => {
          const matchId = `${id}`;

          if (width < 1024 || isDetail) {
            router.push(`/hockey/match/${h2hEvent?.slug}/${h2hEvent?.id}`);
            return;
          } else if (matchId !== selectedMatch) {
            setShowSelectedMatch(true);
            setSelectedMatch(matchId);
          }
        }}
      >
        <FirstCol className='w-fit px-1 md:px-2'>
          <MatchTimestamp
            type='league'
            startTimestamp={startTimestamp}
            status={status}
            id={id}
            currentPeriodStartTimestamp={currentPeriodStartTimestamp}
            competition={uniqueTournament}
            showTime={false}
          />
        </FirstCol>
        <TwTeamScoreCol className=' flex w-1/4 items-center '>
          <div className='dev2 w-full space-y-1'>
            <SoccerTeam
              logoUrl={`${getImage(
                Images.team,
                homeTeam?.id,
                true,
                SPORT.ICE_HOCKEY
              )}`}
              name={`${homeTeam.name}`}
              team={homeTeam}
              isLink={false}
            ></SoccerTeam>

            <SoccerTeam
              logoUrl={`${getImage(
                Images.team,
                awayTeam?.id,
                true,
                SPORT.ICE_HOCKEY
              )}`}
              name={`${awayTeam.name}`}
              team={awayTeam}
              isLink={false}
            ></SoccerTeam>
          </div>

          <div className=' flex  justify-evenly space-x-2'>
            {isMatchesHaveScoreHockey(status.code) && (
              <div className='flex flex-col place-content-center'>
                <MatchScoreColumn
                  code={status.code}
                  homeScore={scores?.ft?.[0] || homeScore?.display || 0}
                  awayScore={scores?.ft?.[1] || awayScore?.display || 0}
                />
              </div>
            )}
            {h2HFilter !== 'h2h' && isMatchesHaveScoreHockey(status.code) && (
              <div className='flex place-content-center items-center justify-center px-2'>
                <FormBadge
                  isWin={isWin}
                  isLoss={isLoss}
                  isDraw={winnerCode === 3}
                  isSmall={true}
                ></FormBadge>
              </div>
            )}
          </div>
          <TwBellCol className={clsx({ '!justify-center': isFinished })}>
            {/* {!isFinished && (
              <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
            )} */}
            <div onClick={(e) => changeFollow(e)} test-id='star-follow'>
              {isFollowed ? (
                <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
              ) : (
                <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
              )}
            </div>
          </TwBellCol>
        </TwTeamScoreCol>
      </li>
    </TwBorderLinearBox>
  );
};

export default MatchRowH2H;
