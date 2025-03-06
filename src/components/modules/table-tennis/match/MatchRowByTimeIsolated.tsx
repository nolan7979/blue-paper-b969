import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { useWindowSize } from '@/hooks';

import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import {
  TwBellColByTime,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import { useMatchStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import {
  getScores,
  MatchScoreColumn,
  MatchTimeStamp,
  Score,
} from '@/components/modules/table-tennis';
import { audioArray } from '@/constant/audioArray';
import { SPORT } from '@/constant/common';
import {
  MatchOdd,
  SportEventDtoWithStat
} from '@/constant/interface';
import { checkInProgessMatch, isMatchEndTableTennis, isMatchNotStartedTableTennis } from '@/utils/tableTennisUtils';
import { timeStampFormat } from '@/utils/timeStamp';
import TableTennisBallSVG from '/public/svg/table-tennis-racket.svg';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

interface IMatchRowByTimeIsolated {
  match: SportEventDtoWithStat;
  homeSound: string;
  matchOdds?: MatchOdd;
  page: string;
  showTime?: boolean;
  theme?: string;
}

export const MatchRowByTimeIsolated: React.FC<IMatchRowByTimeIsolated> = ({
  match,
  homeSound,
  showTime = false,
}) => {
  const matchId = match?.id;
  const { width } = useWindowSize();
  const router = useRouter();

  const matchFollowed = useFollowStore((state) => state.followed.match);
  const [isFollowed, setIsFollowed] = useState(() => {
    const isMatchFollowed = matchFollowed.some(
      (item: any) => item.matchId === matchId
    );
    return isMatchFollowed;
  });
  const [isBellOn, setIsBellOn] = useState<boolean>(false);

  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
  } = useMatchStore();

  const {
    homeTeam,
    awayTeam,
    startTimestamp = 0,
    id,
    time,
    status,
    serve = 0,
    uniqueTournament,
  } = match || {};

  const { currentPeriodStartTimestamp } = time || {};
  const isSelectedMatch = selectedMatch == id && showSelectedMatch;

  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();

  const memoziedScore = useMemo(() => {
    const { scores, scoresRest } = getScores(match.scores);
    return {
      scores,
      scoresRest,
    };
  }, [match.scores]) as { scores: number[], scoresRest: Record<string, any> };


  const changeFollow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isFollowed) {
      removeMatches(matchId);
      setIsFollowed(false);
    } else {
      addMatches(
        matchId,
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

  const changeBellOn = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isBellOn) {
      setIsBellOn(false);
    } else {
      setIsBellOn(true);
    }
  };
  const handleClick = () => {
    if (width < 1024) {
      router.push(`/${SPORT.TABLE_TENNIS}/match/${match?.slug}/${match.id}`);
    } else {
      const isCurrentMatchSelected = `${id}` === `${selectedMatch}`;
      if (isCurrentMatchSelected) {
        setShowSelectedMatch(false);
        setSelectedMatch(null);
      } else {
        setShowSelectedMatch(true);
        setSelectedMatch(`${id}`);
      }
    }
  };
  const isFinished = isMatchEndTableTennis(status?.code);


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


  if (!match || Object.keys(match).length === 0) return <></>;

  return (
    <TwMatchRow
      id={id}
      className={`dark:border-linear-box cursor-pointer rounded-md bg-white px-2 py-2.5 text-csm dark:bg-primary-gradient  ${
        isSelectedMatch ? ' !border-logo-blue' : ''
      }`}
    >
      <MatchTimeStamp
        type='time'
        startTimestamp={startTimestamp}
        status={status}
        id={id}
        currentPeriodStartTimestamp={currentPeriodStartTimestamp}
        competition={uniqueTournament}
        showTime={showTime}
      />
      <TwTeamScoreCol
        className='flex w-1/4 cursor-pointer items-center'
        onClick={handleClick}
      >
        {/* Clubs + FT + PG + Odds */}
        <TwTeamNameCol className=''>
          <div className='flex gap-2'>
            <AvatarTeamCommon
              team={homeTeam}
              size={20}
              sport={SPORT.TABLE_TENNIS}
              onlyImage
            />
            <TwTeamName>
              <span>{homeTeam.name}</span>
            </TwTeamName>
            {serve === 1 && (
              <div className='h-3 w-3'>
                <TableTennisBallSVG className='h-3 w-3' />
              </div>
            )}
          </div>
          <div className='flex gap-2'>
            <AvatarTeamCommon
              team={awayTeam}
              size={20}
              sport={SPORT.TABLE_TENNIS}
              onlyImage
            />
            <TwTeamName>
              <span>{awayTeam.name}</span>
            </TwTeamName>
            {serve === 2 && (
              <div className='h-3 w-3'>
                <TableTennisBallSVG className='h-3 w-3' />
              </div>
            )}
          </div>
        </TwTeamNameCol>

        <div className='flex items-center gap-x-1' test-id='score-info'>
          {checkInProgessMatch(status?.code) && (
            <Score scores={memoziedScore.scoresRest} />
          )}
          {!isMatchNotStartedTableTennis(match?.status?.code) && (
            <MatchScoreColumn
              code={status.code}
              homeScore={memoziedScore.scores[0]}
              awayScore={memoziedScore.scores[1]}
            />
          )}
        </div>
      </TwTeamScoreCol>

      <TwBellColByTime
        className={clsx({
          '!justify-center': isFinished,
        })}
      >
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
      </TwBellColByTime>
    </TwMatchRow>
  );
};
