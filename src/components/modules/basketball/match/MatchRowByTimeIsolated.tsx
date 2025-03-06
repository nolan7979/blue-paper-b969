/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { clsx } from 'clsx';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import { useConvertPath, useWindowSize } from '@/hooks';
import useTrans from '@/hooks/useTrans';

import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import ConnerColumn from '@/components/modules/football/CornerColumn';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import OddsColumn from '@/components/modules/football/match/MatchRowIsolated';
import MatchTimestamp from '@/components/modules/basketball/match/MatchTimeStamp';
import {
  TwBellColByTime,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import { useMatchStore, useMatchStore2nd, useOddsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useTestStore } from '@/stores/test-store';

import { audioArray } from '@/constant/audioArray';
import { SPORT } from '@/constant/common';
import {
  FinishedStates,
  MatchOdd,
  SportEventDtoWithStat,
} from '@/constant/interface';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import { isShowOdds } from '@/utils';
import { mappingOddsTestStore } from '@/utils/matchFilter';
import { timeStampFormat } from '@/utils/timeStamp';
import { useLocale } from '@/hooks/useLocale';
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
  const { OddAsianHandicap, OddOverUnder } = useTestStore();
  const { showOdds, selectedBookMaker, oddsType } = useOddsStore();

  const matchOddsStore = mappingOddsTestStore({
    OddAsianHandicap: OddAsianHandicap,
    OddOverUnder: OddOverUnder,
    matchMapping: match.is_id!,
    bookMakerId: selectedBookMaker?.id.toString(),
  });
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
    homeYellowCards = 0,
    awayYellowCards = 0,
    homeRedCards = 0,
    awayRedCards = 0,
    homeCornerKicks,
    awayCornerKicks,
    id,
    time,
    status,
    tournament,
  } = match || {};

  const { currentPeriodStartTimestamp, remainTime } = time || {};
  const i18n = useTrans();
  const path = useConvertPath();
  const isSelectedMatch = selectedMatch == id && showSelectedMatch;

  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();
  const { currentLocale } = useLocale(i18n.language);


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
        match?.tournament?.id,
        match?.tournament.category?.name || '',
        match?.tournament?.name || '',
        match?.uniqueTournament?.name || '',
        sport
      );
      setIsFollowed(true);
    }
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
    status.type === 'finished' || FinishedStates.includes(status.code);

  const isFootball = sport === SPORT.FOOTBALL;

  if (!match || Object.keys(match).length === 0) return <></>;

  return (
    <TwMatchRow
      className={`dark:bg-primary-gradient dark:border-linear-box cursor-pointer rounded-md px-2 py-2.5 bg-white text-csm  ${
        isSelectedMatch ? ' !border-logo-blue' : ''
      }`}
    >
      <MatchTimestamp
        type='time'
        remainTime={remainTime}
        startTimestamp={startTimestamp}
        status={status}
        id={id}
        currentPeriodStartTimestamp={currentPeriodStartTimestamp}
        competition={tournament}
        showTime={showTime}
        sport={sport}
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
            <div className=' ml-1 flex items-center gap-0.5'>
              {awayRedCards > 0 && showRedCard && (
                <RedCard numCards={awayRedCards} size='xs' />
              )}
              {awayYellowCards > 0 && showYellowCard && (
                <YellowCard numCards={awayYellowCards} size='xs' />
              )}
            </div>
          </div>
        </TwTeamNameCol>

        {isShowOdds(path) && showOdds && (
          <OddsColumn
            i18n={i18n}
            theme={theme}
            oddsType={oddsType}
            matchOdds={matchOdds}
            matchTestStore={matchOddsStore}
          ></OddsColumn>
        )}

        <div className='flex items-center gap-x-1'>
          {Object.keys(match?.homeScore).length !== 0 &&
            Object.keys(match?.awayScore).length !== 0 && status?.code != 1 && (
              <MatchScoreColumn
                code={status.code}
                homeScore={match?.homeScore.display!}
                awayScore={match?.awayScore.display!}
              />
            )}
          {isFootball && (
            <ConnerColumn
              homeConner={homeCornerKicks > 0 ? homeCornerKicks : 0}
              awayConner={awayCornerKicks > 0 ? awayCornerKicks : 0}
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
