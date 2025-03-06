/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';

import { useWindowSize } from '@/hooks';
import { useConvertPath } from '@/hooks/useConvertPath';
import useTrans from '@/hooks/useTrans';

import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { RedCard, YellowCard } from '@/components/modules/cricket/Cards';
import MatchTimestamp from '@/components/modules/cricket/match/MatchTimeStamp';
import {
  TwBellColByTime,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/cricket/tw-components';
import { TwTeamName } from '@/components/modules/cricket/tw-components/TwFBHome';

import { useMatchStore, useMatchStore2nd, useOddsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useTestStore } from '@/stores/test-store';

import { Score } from '@/components/modules/volleyball/match/Score';
import { SPORT } from '@/constant/common';
import {
  FinishedStates,
  MatchOdd,
  SportEventDtoWithStat,
} from '@/constant/interface';
import MatchScoreColumn from '@/modules/cricket/liveScore/components/MatchScoreColumn';
import { mappingOddsTestStore } from '@/utils/matchFilter';
import { timeStampFormat } from '@/utils/timeStamp';
import { isMatchNotStarted } from '@/utils';
import ConnerColumn from '@/components/modules/cricket/CornerColumn';

import { BellIcon } from '@/components/modules/cricket/match/BellIcon';
import { checkEnded } from '@/utils/cricketUtils';
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
  sport = SPORT.CRICKET,
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

  const changeBellOn = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isBellOn) {
      setIsBellOn(false);
    } else {
      setIsBellOn(true);
    }
  };

  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
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
    awayRedCards = 0,
    id,
    time,
    status,
    // tournament,
    uniqueTournament,
    scores = {},
    homeCornerKicks,
    awayCornerKicks,
    homeScore = {},
    awayScore = {},
  } = match || {};
  const { ft } = scores || {};
  const { currentPeriodStartTimestamp } = time || {};
  const i18n = useTrans();
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
    } else if (`${id}` !== `${selectedMatch}`) {
      setMatchDetails(match);
      setShowSelectedMatch(true);
      setSelectedMatch(`${id}`);
    }
  };
  const isFinished =
    status.type === 'finished' || FinishedStates.includes(status.code);

  const getTextWon = useCallback(() => {
    const { winby, margin, result } = match.extraScores?.results || {};
    return `${
      result === 1 ? match.homeTeam?.name : match.awayTeam?.name
    } won by ${margin !== 0 ? margin : ''} ${
      margin === 0 ? '' : winby === 1 ? 'runs' : 'witckets'
    } `;
  }, [match]);

  if (!match || Object.keys(match).length === 0) return <></>;

  const memoizedMatchRow = useMemo(
    () => (
      <TwMatchRow
        className={`border-linear-box cursor-pointer flex-col bg-white rounded-md px-2 py-2.5 text-csm dark:bg-primary-gradient  ${
          isSelectedMatch ? ' !border-logo-blue' : ''
        }`}
        onClick={handleClick}
      >
        <div className='flex'>
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
          <TwTeamScoreCol className='flex w-1/4 cursor-pointer items-center'>
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
              <MatchScoreColumn
                code={status.code}
                scores={scores}
                homeScore={homeScore}
                awayScore={awayScore}
                extraScores={match?.extraScores?.innings || []}
              />
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
        </div>
        {checkEnded(status?.code || 1) && (
          <p className='mt-2 border-t border-primary-mask pt-2 text-dark-text'>
            {getTextWon()}
          </p>
        )}
      </TwMatchRow>
    ),
    [
      isSelectedMatch,
      uniqueTournament,
      startTimestamp,
      status,
      status.code,
      id,
      currentPeriodStartTimestamp,
      showTime,
      handleClick,
      homeTeam,
      homeRedCards,
      showRedCard,
      homeYellowCards,
      showYellowCard,
      awayTeam,
      match,
      homeCornerKicks,
      awayCornerKicks,
      isFinished,
      isBellOn,
      changeBellOn,
      changeFollow,
      isFollowed,
      scores,
      homeScore,
      awayScore,
      getTextWon,
    ]
  );

  return memoizedMatchRow;
};
