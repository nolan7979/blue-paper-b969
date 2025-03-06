import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useWindowSize } from '@/hooks';
import { useConvertPath } from '@/hooks/useConvertPath';
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

import { useMatchStore, useMatchStore2nd } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import {
  MatchScoreColumn,
  MatchTimeStamp,
  Score,
} from '@/components/modules/tennis';
import { audioArray } from '@/constant/audioArray';
import { SPORT } from '@/constant/common';
import {
  FinishedStates,
  MatchOdd,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { useLocale } from '@/hooks/useLocale';
import { isMatchNotStartedTennis } from '@/utils';
import { timeStampFormat } from '@/utils/timeStamp';
import TennisBallSVG from '/public/svg/tennis-ball.svg';
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
    scores = {},
    serve = 0,
    tournament,
  } = match || {};

  let getFT = null
  let getScoresRest = null
  if (scores) {
    const { ft = [], ...scoresRest } = scores;
    getFT = ft;
    getScoresRest = scoresRest;
  }

  const { currentPeriodStartTimestamp } = time || {};
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
        SPORT.TENNIS,
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
      router.push(`${currentLocale}/${SPORT.TENNIS}/match/${match?.slug}/${match.id}`);
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

  if (!match || Object.keys(match).length === 0) return <></>;

  return (
    <TwMatchRow
      className={`dark:bg-primary-gradient dark:border-linear-box cursor-pointer rounded-md px-2 py-2.5 bg-white text-csm  ${isSelectedMatch ? ' !border-logo-blue' : ''
        }`}
    >
      <MatchTimeStamp
        type='time'
        startTimestamp={startTimestamp}
        status={status}
        id={id}
        currentPeriodStartTimestamp={currentPeriodStartTimestamp}
        competition={tournament}
        showTime={showTime}
      />
      <TwTeamScoreCol
        className='flex w-1/4 cursor-pointer items-center'
        onClick={handleClick}
      >
        {/* Clubs + FT + PG + Odds */}
        <TwTeamNameCol className=''>
          <div className='flex gap-2'>
            {/* <div className='min-w-8'>
              <CustomLink
                href={`/competitor/${homeTeam.slug}/${homeTeam?.id}`} // TODO use slug
                target='_parent'
                disabled
              >
                <Avatar
                  id={homeTeam?.id}
                  type='team'
                  height={20}
                  width={20}
                  isBackground={false}
                  rounded={false}
                  isSmall
                />
              </CustomLink>
            </div> */}
            <AvatarTeamCommon team={homeTeam} sport={SPORT.TENNIS} size={20} onlyImage />
            <TwTeamName>
              <span>{homeTeam.name}</span>
            </TwTeamName>
            {serve === 1 && (
              <div className='h-3 w-3'>
                <TennisBallSVG className='h-3 w-3' />
              </div>
            )}
          </div>
          <div className='flex gap-2'>
            {/* <CustomLink
              href={`/competitor/${awayTeam.name}/${awayTeam?.id}`}
              target='_parent'
              disabled
            >
              <Avatar
                id={awayTeam?.id}
                type='team'
                height={20}
                width={20}
                isBackground={false}
                isSmall
              />
            </CustomLink> */}
            <AvatarTeamCommon team={awayTeam} sport={SPORT.TENNIS} size={20} onlyImage />
            {/* <div className='my-auto shrink truncate font-thin'> */}
            <TwTeamName>
              {/* Chelsea */}
              <span>{awayTeam.name}</span>
            </TwTeamName>
            {serve === 2 && (
              <div className='h-3 w-3'>
                <TennisBallSVG className='h-3 w-3' />
              </div>
            )}
          </div>
        </TwTeamNameCol>

        {/* {isShowOdds(path) && showOdds && (
          <OddsColumn
            i18n={i18n}
            theme={theme}
            oddsType={oddsType}
            matchOdds={matchOdds}
            matchTestStore={matchOddsStore}
          ></OddsColumn>
        )} */}

        <div className='flex items-center gap-x-1'>
          {/* {Object.keys(match?.homeScore).length !== 0 &&
            Object.keys(match?.awayScore).length !== 0 && (
              <MatchScoreColumn
                code={status.code}
                homeScore={match?.homeScore.display!}
                awayScore={match?.awayScore.display!}
              />
            )} */}
          {/* <ConnerColumn
            homeConner={homeCornerKicks > 0 ? homeCornerKicks : 0}
            awayConner={awayCornerKicks > 0 ? awayCornerKicks : 0}
          /> */}

          {!isMatchNotStartedTennis(status?.code) && getScoresRest && getFT && (
            <>
              <Score scores={getScoresRest} status={status} />
              <MatchScoreColumn
                code={status?.code}
                homeScore={getFT[0]}
                awayScore={getFT[1]}
              />
            </>
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
