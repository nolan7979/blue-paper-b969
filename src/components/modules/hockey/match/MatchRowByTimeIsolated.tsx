/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { clsx } from 'clsx';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { useWindowSize } from '@/hooks';
import useTrans from '@/hooks/useTrans';

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
import MatchTimestamp from '@/components/modules/hockey/match/MatchTimeStamp';

import { useFilterStore, useMatchStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { audioArray } from '@/constant/audioArray';
import { SPORT } from '@/constant/common';
import {
  FinishedStates,
  SportEventDtoWithStat
} from '@/constant/interface';
import { useLocale } from '@/hooks/useLocale';
import { timeStampFormat } from '@/utils/timeStamp';
import { isInProgessMatchHockey, isMatchesHaveScoreHockey } from '@/utils';
import { Score } from '@/components/modules/hockey/match/Score';
import { getScores } from '@/components/modules/hockey/match/MatchRowIsolated';
import MatchScoreColumn from '@/modules/hockey/liveScore/components/MatchScoreColumn';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

interface IMatchRowByTimeIsolated {
  match: SportEventDtoWithStat;
  homeSound?: string;
  page: string;
  showTime?: boolean;
  theme?: string;
  sport?: string;
}

export const MatchRowByTimeIsolated: React.FC<IMatchRowByTimeIsolated> = ({
  match,
  homeSound,
  showTime = false,
  sport = SPORT.FOOTBALL,
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
    uniqueTournament,
  } = match || {};

  const { currentPeriodStartTimestamp } = time || {};
  const { runSeconds, countDown, updateTime, remainTime } = match?.timer || {};
  const i18n = useTrans();
  const isSelectedMatch = selectedMatch == id && showSelectedMatch;
  const { dateFilter } = useFilterStore();
  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();
  const { currentLocale } = useLocale(i18n.language);

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
      useState;
      setIsFollowed(false);
    } else {
      addMatches(
        matchId,
        formattedTime,
        formattedDate,
        match.tournament?.id,
        match.tournament.category?.name || '',
        match.tournament?.name || '',
        match?.uniqueTournament?.name || '',
        sport
      );
      setIsFollowed(true);
    }
  };

  useEffect(() => {
    if (isBellOn && homeSound) {
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
      router.push(`${currentLocale}/${sport}/match/${match?.slug}/${match.id}`);
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
  const isFinished =
    status.type === 'finished' || FinishedStates.includes(status.code);

  const isFootball = sport === SPORT.FOOTBALL;

  if (!match || Object.keys(match).length === 0) return <></>;

  return (
    <TwMatchRow
      className={`dark:border-linear-box cursor-pointer rounded-md px-2 py-2.5 text-csm dark:bg-primary-gradient bg-white  ${isSelectedMatch ? ' !border-logo-blue' : ''
        }`}
    >
      <MatchTimestamp
        type='time'
        startTimestamp={startTimestamp}
        status={status}
        id={id}
        i18n={i18n}
        currentPeriodStartTimestamp={currentPeriodStartTimestamp}
        competition={uniqueTournament}
        remainTime={remainTime}
        showTime={showTime}
        sport={sport}
        runSeconds={runSeconds}
        dateFilter={dateFilter}
      />
      <TwTeamScoreCol
        className='flex w-1/4 cursor-pointer items-center'
        onClick={handleClick}
      >
        {/* Clubs + FT + PG + Odds */}
        <TwTeamNameCol className=''>
          <div className=' flex  gap-2'>
            <div>
              <AvatarTeamCommon
                team={homeTeam}
                size={20}
                sport={sport}
                onlyImage
              />
            </div>
            <TwTeamName>
              <span>{homeTeam.name}</span>
            </TwTeamName>
          </div>
          <div className='flex gap-2'>
            <div>
              <AvatarTeamCommon
                team={awayTeam}
                size={20}
                sport={sport}
                onlyImage
              />
            </div>
            <TwTeamName>
              <span>{awayTeam.name}</span>
            </TwTeamName>
          </div>
        </TwTeamNameCol>

        <div className='flex items-center gap-x-1'>
          {isInProgessMatchHockey(match.status.code) && <Score scores={memoziedScore.scoresRest} />}
          {isMatchesHaveScoreHockey(match?.status?.code) && (
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
        <div onClick={(e) => changeFollow(e)} test-id={`star-${isFollowed}}`}>
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
