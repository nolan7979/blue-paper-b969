/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { clsx } from 'clsx';
import React, { memo, useCallback, useMemo, useState } from 'react';

// import { useWindowSize } from '@/hooks';
// import { useConvertPath } from '@/hooks/useConvertPath';
// import useTrans from '@/hooks/useTrans';

import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import MatchTimestamp from '@/components/modules/snooker/match/MatchTimeStamp';
import {
  TwBellColByTime,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import { useFollowStore } from '@/stores/follow-store';
// import { useTestStore } from '@/stores/test-store';

// import { Score } from '@/components/modules/volleyball/match/Score';
import { SPORT } from '@/constant/common';
import {
  FinishedStates,
  MatchOdd,
  SportEventDtoWithStat,
} from '@/constant/interface';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
// import { mappingOddsTestStore } from '@/utils/matchFilter';
import { timeStampFormat } from '@/utils/timeStamp';

import { BellIcon } from '@/components/modules/football/match/BellIcon';
import { getScores } from '@/components/modules/table-tennis/match';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

interface IMatchRowByTimeIsolated {
  match: SportEventDtoWithStat;
  page: string;
  showTime?: boolean;
  theme?: string;
  sport?: string;
  showSelectedMatch?: boolean;
  selectedMatch?: string | null;
  onClick?: (e: SportEventDtoWithStat) => void;
}

export const MatchRowByTimeIsolated: React.FC<IMatchRowByTimeIsolated> = memo(
  ({
    match,
    showTime = false,
    theme,
    sport = SPORT.SNOOKER,
    showSelectedMatch,
    selectedMatch,
    onClick,
  }) => {
    // const { OddAsianHandicap, OddOverUnder } = useTestStore();
    // const { showOdds, selectedBookMaker, oddsType } = useOddsStore();

    // const matchOddsStore = mappingOddsTestStore({
    //   OddAsianHandicap: OddAsianHandicap,
    //   OddOverUnder: OddOverUnder,
    //   matchMapping: match.is_id!,
    //   bookMakerId: selectedBookMaker?.id.toString(),
    // });
    const matchId = match?.id;

    const matchFollowed = useFollowStore((state) => state.followed.match);
    const [isFollowed, setIsFollowed] = useState(() => {
      const isMatchFollowed = matchFollowed.some(
        (item: any) => item.matchId === matchId
      );
      return isMatchFollowed;
    });
    const [isBellOn, setIsBellOn] = useState<boolean>(false);

    const changeBellOn = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (isBellOn) {
        setIsBellOn(false);
      } else {
        setIsBellOn(true);
      }
    };

    const {
      homeTeam,
      awayTeam,
      startTimestamp = 0,
      id,
      time,
      status,
      uniqueTournament,
    } = match || {};
    // const { ft, ...scoresRest } = scores || {};
    const { currentPeriodStartTimestamp } = time || {};
    const memoziedScore = useMemo(() => {
      const { scores, scoresRest } = getScores(match?.scores);
      return {
        scores,
        scoresRest,
      };
    }, [match?.scores]) as { scores: number[]; scoresRest: Record<string, any> };
    // const i18n = useTrans();
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
            match?.uniqueTournament?.name || '',
            match?.tournament?.name || '',
            sport
          );
        setIsFollowed(true);
      }
    };

    const handleMatchClick = useCallback(() => {
      if (onClick) {
        onClick(match);
      }
    }, [onClick, match]);
    const isFinished =
      status.type === 'finished' || FinishedStates.includes(status.code);


    if (!match || Object.keys(match).length === 0) return <></>;
    const memoizedMatchRow = useMemo(
      () => (
        <TwMatchRow className='dark:border-linear-box cursor-pointer rounded-md bg-white px-2 py-2.5 text-csm dark:bg-primary-gradient'>
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
            onClick={handleMatchClick}
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
              {
                status?.type == "finished" && <MatchScoreColumn
                  code={status.code}
                  homeScore={memoziedScore.scores[0]}
                  awayScore={memoziedScore.scores[1]}
                />
              }
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
            <div
              onClick={(e) => changeFollow(e)}
              test-id={`star-${isFollowed}}`}
            >
              {isFollowed ? (
                <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
              ) : (
                <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
              )}
            </div>
          </TwBellColByTime>
        </TwMatchRow>
      ),
      [
        match?.id,
        match?.scores,
        match?.status?.code,
        isSelectedMatch,
        uniqueTournament,
        startTimestamp,
        status,
        id,
        currentPeriodStartTimestamp,
        showTime,
        onClick,
        homeTeam,
        awayTeam,
        match,
        isFinished,
        isBellOn,
        changeBellOn,
        changeFollow,
        isFollowed,
      ]
    );

    return memoizedMatchRow;
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.match?.id === nextProps.match?.id &&
      prevProps?.match?.scores?.display === nextProps.match?.scores?.display &&
      prevProps?.match?.status?.code === nextProps.match?.status?.code
    );
  }
);
