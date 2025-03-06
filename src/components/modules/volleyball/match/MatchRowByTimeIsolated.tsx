/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useWindowSize } from '@/hooks';

import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import {
  TwBellColByTime,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import MatchTimestamp from '@/components/modules/volleyball/match/MatchTimeStamp';

import { useMatchStore, useMatchStore2nd } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { Score } from '@/components/modules/volleyball/match/Score';
import { SPORT } from '@/constant/common';
import {
  MatchOdd,
  SportEventDtoWithStat
} from '@/constant/interface';
import MatchScoreColumn from '@/modules/volleyball/liveScore/components/MatchScoreColumn';
import { isMatchHaveStatVlb, isMatchInprogressVlb, MatchStateVolleyball } from '@/utils';
import { timeStampFormat } from '@/utils/timeStamp';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

interface IMatchRowByTimeIsolated {
  match: SportEventDtoWithStat;
  showYellowCard: boolean;
  showRedCard: boolean;
  homeSound: string;
  matchOdds: MatchOdd;
  page: string;
  showTime?: boolean;
  theme?: string;
  sport?: string;
}

export const MatchRowByTimeIsolated: React.FC<IMatchRowByTimeIsolated> = ({
  match,
  showYellowCard,
  showRedCard,
  homeSound,
  matchOdds,
  showTime = false,
  theme,
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
    homeYellowCards = 0,
    homeRedCards = 0,
    id,
    time,
    status,
    uniqueTournament,
    scores
  } = match || {};
  const { ft, ...scoresRest } = scores || {};
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

  const handleClick = () => {
    if (width < 1024) {
      router.push(`/${sport}/match/${match?.slug}/${match?.id}`);
      // window.location.href = `/${sport}/match/${match.slug}/${match?.id}`;
    } else {
      const isCurrentMatchSelected = `${id}` === `${selectedMatch}`;
      if (isCurrentMatchSelected) {
        setShowSelectedMatch(false);
        setSelectedMatch(null);
        setShowSelectedMatch2nd(false);
        setSelectedMatch2nd(null);
      } else {
        setShowSelectedMatch2nd(true);
        setSelectedMatch2nd(`${id}`);
        setShowSelectedMatch(true);
        setSelectedMatch(`${id}`);
      }
    }
  };
  const isFinished =
    status.type === 'finished' || [MatchStateVolleyball.ENDED].includes(status.code);

  const isFootball = sport === SPORT.FOOTBALL;

  if (!match || Object.keys(match).length === 0) return <></>;

  return (
    <TwMatchRow
      className={`dark:border-linear-box cursor-pointer rounded-md px-2 py-2.5 text-csm dark:bg-primary-gradient bg-white  ${
        isSelectedMatch ? ' !border-logo-blue' : ''
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
          sport={sport}
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
            <div className=' ml-1 flex items-center gap-0.5'>
              {homeRedCards > 0 && showRedCard && (
                <RedCard numCards={homeRedCards} size='xs' />
              )}
              {homeYellowCards > 0 && showYellowCard && (
                <YellowCard numCards={homeYellowCards} size='xs' />
              )}
            </div>
          </div>
          <div className=' flex  gap-2'>
            <div>
              <AvatarTeamCommon
                team={awayTeam}
                size={20}
                sport={sport}
                onlyImage
              />
            </div>
            {/* <div className='my-auto shrink truncate font-thin'> */}
            <TwTeamName>
              {/* Chelsea */}
              <span>{awayTeam.name}</span>
            </TwTeamName>
          </div>
        </TwTeamNameCol>

        <div className='flex items-center gap-x-1'>
          {isMatchHaveStatVlb(match.status.code) && ft && ft.length > 0 && (
            <div className='flex items-center gap-x-1' test-id='score-info'>
              {isMatchInprogressVlb(match.status.code) && <Score scores={scoresRest} status={status} />}
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
        {/* {!isFinished && (
          <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
        )} */}
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
