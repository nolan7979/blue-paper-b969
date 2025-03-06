/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useWindowSize } from '@/hooks';

import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import MatchTimestamp from '@/components/modules/badminton/match/MatchTimeStamp';
import {
  TwBellColByTime,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import { useMatchStore, useMatchStore2nd } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { SPORT } from '@/constant/common';
import {
  FinishedStates,
  SportEventDtoWithStat
} from '@/constant/interface';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import { timeStampFormat } from '@/utils/timeStamp';

import { BellIcon } from '@/components/modules/football/match/BellIcon';
import Shuttlecock from '/public/svg/shuttlecock.svg';
import { MatchBadmintonState, isMatchHaveStatBadminton } from '@/utils';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

interface IMatchRowByTimeIsolated {
  match: SportEventDtoWithStat;
  page: string;
  showTime?: boolean;
  theme?: string;
  sport?: string;
}

export const MatchRowByTimeIsolated: React.FC<IMatchRowByTimeIsolated> = ({
  match,
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
    setShowSelectedMatch: setShowSelectedMatch2nd,
    setSelectedMatch: setSelectedMatch2nd,
  } = useMatchStore2nd();

  const {
    homeTeam,
    awayTeam,
    startTimestamp = 0,
    id,
    time,
    status,
    uniqueTournament,
    scores,
    serve
  } = match as any || {};
  const {...scoresRest } = scores || {};
  const ft = scores?.ft || ['',''];
  const { currentPeriodStartTimestamp } = time || {};
  const isSelectedMatch = selectedMatch == id && showSelectedMatch;

  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();

  const changeFollow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isFollowed) {
      removeMatches(matchId);
      useState;
      setIsFollowed(false);
    } else {
      if (uniqueTournament)
        addMatches(
          matchId,
          formattedTime,
          formattedDate,
          uniqueTournament?.id,
          uniqueTournament.category?.name || '',
          uniqueTournament?.name || '',
          match?.tournament?.name || '',
          sport
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
      router.push(`/${sport}/match/${match.slug}/${match?.id}`);
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


  if (!match || Object.keys(match).length === 0) return <></>;

  return (
    <TwMatchRow
      className={`dark:bg-primary-gradient border-linear-box cursor-pointer rounded-md px-2 py-2.5 bg-white text-csm  ${isSelectedMatch ? ' !border-logo-blue' : ''
        }`}
    >
      {uniqueTournament && (
        <MatchTimestamp
          type='time'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          competition={uniqueTournament}
          showTime={showTime}
        />
      )}
      <TwTeamScoreCol
        className='flex w-1/4 cursor-pointer items-center'
        onClick={handleClick}
      >
        {/* Clubs + FT + PG + Odds */}
        <TwTeamNameCol className=''>
          <div className=' flex  gap-2'>
            <div>
              <AvatarTeamCommon team={homeTeam} sport={SPORT.BADMINTON} size={20} onlyImage />
            </div>
            <TwTeamName className='flex gap-2 items-center'>
              <span className='block max-w-40 truncate lg:max-w-full'>{homeTeam.name}</span>
              {serve != '0' && serve == '1' && <Shuttlecock className="h-3 w-3" />}
            </TwTeamName>
          </div>
          <div className=' flex  gap-2'>
            <div>
              <AvatarTeamCommon team={awayTeam} sport={SPORT.BADMINTON} size={20} onlyImage />
            </div>
            {/* <div className='my-auto shrink truncate font-thin'> */}
            <TwTeamName className='flex gap-2 items-center'>
              {/* Chelsea */}
              <span className='block max-w-40 truncate lg:max-w-full'>{awayTeam.name}</span>
              {serve != '0' && serve == '2' && <Shuttlecock className="h-3 w-3" />}
            </TwTeamName>
          </div>
        </TwTeamNameCol>

        <div className='flex items-center gap-x-1'>
          {isMatchHaveStatBadminton(match?.status?.code) && ft && ft.length > 0 && (
            <div className='flex items-center gap-x-1' test-id='score-info'>
              <MatchScoreColumn
                code={status.code}
                homeScore={ft[0]}
                awayScore={ft[1]}
              />
            </div>
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
