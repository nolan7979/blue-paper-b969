import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useMessage } from '@/hooks/useFootball/useMessage';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import {
  TwBellCol,
  TwMatchRow,
} from '@/components/modules/football/tw-components';

import { useMatchStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useMatchNotify } from '@/stores/notification-store';

import Transition from '@/components/common/Transition';
import {
  MatchScoreColumn,
  MatchTimeStamp,
  Score,
} from '@/components/modules/table-tennis';
import { audioArray } from '@/constant/audioArray';
import { SPORT } from '@/constant/common';
import { MatchOdd, SportEventDtoWithStat } from '@/constant/interface';
import {
  checkInProgessMatch,
  isMatchEndTableTennis,
  isMatchNotStartedTableTennis,
} from '@/utils/tableTennisUtils';
import { timeStampFormat } from '@/utils/timeStamp';
import TableTennisBallSVG from '/public/svg/table-tennis-racket.svg';
import { FormBadge } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

export interface IMatchRowIsolatedProps {
  match: SportEventDtoWithStat;
  homeSound: string;
  matchOdds?: MatchOdd | undefined;
  i18n?: any;
  theme?: string;
  isSimulator?: boolean;
  isDetail?: boolean;
  sport?: string;
  showFormBadge?: boolean;
  playerId?: string;
  handleClick: (e: SportEventDtoWithStat) => void;
}

export const MatchRowIsolated: React.FC<IMatchRowIsolatedProps> = ({
  match,
  homeSound,
  i18n,
  handleClick,
  isDetail,
  theme = 'light',
  isSimulator = true,
  showFormBadge = false,
  playerId = '',
}) => {
  const { showSelectedMatch, selectedMatch } = useMatchStore();
  const {
    homeTeam,
    awayTeam,
    startTimestamp = 0,
    id,
    time,
    status,
    slug,
    uniqueTournament,
    serve,
    scores = {},
    winnerCode,
  } = match || {};

  const memoziedScore = useMemo(() => {
    const { scores, scoresRest } = getScores(match.scores);
    return {
      scores,
      scoresRest,
    };
  }, [match.scores]) as { scores: number[]; scoresRest: Record<string, any> };

  const { currentPeriodStartTimestamp, remainTime } = time || {};
  const matchDetailRef = useRef<any>(null);

  const { mutate } = useMessage();
  const {
    matches: matchesNotify,
    addMore: addMoreMatchNotify,
    removeId,
  } = useMatchNotify();
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();

  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const [isBellOn, setIsBellOn] = useState<boolean>(matchesNotify.includes(id));
  const [isFollowed, setIsFollowed] = useState(() => {
    const isMatchFollowed = matchFollowed.some(
      (item: any) => item.matchId === id
    );
    return isMatchFollowed;
  });

  const isSelectedMatch = selectedMatch == id && showSelectedMatch;
  // to save local favorite

  const { isWin, isLoss } = useMemo(() => {
    let isWin = false;
    if (
      (playerId === homeTeam?.id && winnerCode === 1) ||
      (playerId === awayTeam?.id && winnerCode === 2)
    ) {
      isWin = true;
    }

    let isLoss = false;
    if (
      (playerId === homeTeam?.id && winnerCode === 2) ||
      (playerId === awayTeam?.id && winnerCode === 1)
    ) {
      isLoss = true;
    }

    return { isWin, isLoss };
  }, [playerId, homeTeam, awayTeam, winnerCode]);

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
        uniqueTournament?.id || '',
        uniqueTournament?.category?.name || '',
        uniqueTournament?.name || '',
        match?.tournament?.name || '',
        SPORT.TABLE_TENNIS
      );
      setIsFollowed(true);
    }
  };

  const changeBellOn = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isClickBlocked) {
      alert('Please wait before clicking again!');
      return;
    }
    setIsClickBlocked(true);
    if (isBellOn) {
      setIsBellOn(false);
      mutate({
        matchId: id,
        isSubscribe: false,
        locale: i18n ? i18n.language : 'en',
        type: 'match',
      });
      removeId(id);
    } else {
      setIsBellOn(true);
      mutate({
        matchId: id,
        isSubscribe: true,
        locale: i18n ? i18n.language : 'en',
        type: 'match',
      });
      addMoreMatchNotify(id);
    }

    setTimeout(() => {
      setIsClickBlocked(false);
    }, 2000);
  };

  useEffect(() => {
    if (isBellOn) {
      const timer = setTimeout(() => {
        const numericHomeSound = parseInt(homeSound, 10);

        if (!isNaN(numericHomeSound) && Number.isInteger(numericHomeSound)) {
          const audio = new Audio(audioArray[numericHomeSound - 1]);
          audio.play();
        }

        // setShouldExecuteAction(false);
      }, 5000);

      // setShouldExecuteAction(true);

      return () => clearTimeout(timer);
    }
  }, [isBellOn, homeSound]);

  useEffect(() => {
    if (isBellOn) {
      const timer = setTimeout(() => {
        const numericHomeSound = parseInt(homeSound, 10);

        if (!isNaN(numericHomeSound) && Number.isInteger(numericHomeSound)) {
          const audio = new Audio(audioArray[numericHomeSound - 1]);
          audio.play();
        }

        // setShouldExecuteAction(false);
      }, 5000);

      // setShouldExecuteAction(true);

      return () => clearTimeout(timer);
    }
  }, [isBellOn, homeSound]);

  const isFinished = isMatchEndTableTennis(status?.code);

  if (!match || Object.keys(match).length === 0)
    return <MatchSkeletonMapping />;

  return (
    <TwMatchRow
      test-id='match-row'
      id={match.id}
      ref={matchDetailRef}
      className={clsx(
        'dark:border-linear-box mb-2 cursor-pointer border border-line-default bg-white py-2.5 text-csm dark:border-none dark:bg-primary-gradient',
        {
          'dark:!border-all-blue': isSelectedMatch,
        }
      )}
      onClick={() => handleClick(match)}
    >
      <MatchTimeStamp
        type='league'
        startTimestamp={startTimestamp}
        status={status}
        id={id}
        i18n={i18n}
        currentPeriodStartTimestamp={currentPeriodStartTimestamp}
        competition={uniqueTournament}
        showTime={false}
      />
      <div className='flex w-1/4 flex-1 items-center gap-2 pl-2 '>
        <div className='flex w-20 flex-1 flex-col justify-between gap-1.5'>
          <div className=' flex items-center gap-2' test-id='club1-info'>
            <div className='min-w-5' test-id='club1-logo'>
              <AvatarTeamCommon
                team={homeTeam}
                size={20}
                sport={SPORT.TABLE_TENNIS}
                onlyImage
              />
            </div>
            <div className='my-auto shrink truncate text-csm font-normal text-black dark:text-white'>
              {homeTeam?.name}
            </div>
            {serve == 1 && (
              <Transition>
                <div className='flex h-3 w-3 items-center justify-center'>
                  <TableTennisBallSVG className='h-3 w-3' />
                </div>
              </Transition>
            )}
          </div>
          <div className=' flex gap-2' test-id='club2-info'>
            <div test-id='club2-logo'>
              <AvatarTeamCommon
                team={awayTeam}
                size={20}
                sport={SPORT.TABLE_TENNIS}
                onlyImage
              />
            </div>
            <div className='my-auto shrink truncate text-csm font-normal text-black dark:text-white'>
              {awayTeam?.name}
            </div>
            {serve == 2 && (
              <Transition>
                <div className='flex h-3 w-3 items-center justify-center'>
                  <TableTennisBallSVG className='h-3 w-3' />
                </div>
              </Transition>
            )}
          </div>
        </div>
        <div className='flex items-center gap-x-1' test-id='score-info'>
          {checkInProgessMatch(status?.code) && (
            <Score scores={memoziedScore.scoresRest} status={status} />
          )}
          {!isMatchNotStartedTableTennis(match?.status?.code) && (
            <MatchScoreColumn
              code={status.code}
              homeScore={memoziedScore.scores[0]}
              awayScore={memoziedScore.scores[1]}
            />
          )}
        </div>
        {showFormBadge &&
          !isMatchNotStartedTableTennis(match?.status?.code) && (
            <FormBadge
              isWin={isWin}
              isLoss={isLoss}
              isDraw={match?.winnerCode === 3}
              isSmall
            />
          )}
      </div>
      <TwBellCol className={clsx({ '!justify-center': isFinished })}>
        {!isFinished && (
          <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
        )}
        <div onClick={(e) => changeFollow(e)}>
          {isFollowed ? (
            <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
          ) : (
            <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
          )}
        </div>
      </TwBellCol>
    </TwMatchRow>
  );
};

export const getScores = (
  scores: any
): { scores: number[] | string; scoresRest: any } => {
  if (!scores) return { scores: [], scoresRest: [] };

  const scoreKeys = Object.keys(scores);
  const scoreEnded = scoreKeys.find((key) => key === 'ft');

  const scoresRest = scoreKeys.reduce((acc: any, key) => {
    if (key !== 'ft' && key !== 'pt') {
      acc[key] = scores[key];
    }
    return acc;
  }, {});

  if (!scoreEnded) return { scores: [0, 0], scoresRest };

  return {
    scores: scores[scoreEnded],
    scoresRest,
  };
};
