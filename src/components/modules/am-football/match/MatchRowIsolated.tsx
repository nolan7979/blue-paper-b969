import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import { useMessage } from '@/hooks/useFootball/useMessage';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import MatchTimeStamp from '@/components/modules/am-football/match/MatchTimeStamp';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import {
  TwBellCol,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import {
  useMatchStore
} from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useMatchNotify } from '@/stores/notification-store';

import { audioArray } from '@/constant/audioArray';
import { SPORT } from '@/constant/common';
import {
  IScore,
  MatchOdd,
  SportEventDtoWithStat,
  TournamentDto
} from '@/constant/interface';
import MatchScoreColumn from '@/modules/am-football/liveScore/components/MatchScoreColumn';
import { timeStampFormat } from '@/utils/timeStamp';

import RenderIf from '@/components/common/RenderIf';
import { SubScore } from '@/components/modules/am-football/match/SubScore';
import {
  checkInProgressMatchAMFootball,
  isMatchEndAMFootball,
  isMatchHaveStatAMFootball,
  MatchStateAMFootball,
} from '@/utils/americanFootballUtils';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

export interface IMatchRowIsolatedProps {
  match: SportEventDtoWithStat;
  homeSound?: string;
  matchOdds?: MatchOdd | undefined;
  i18n?: any;
  theme?: string;
  isSimulator?: boolean;
  isDetail?: boolean;
  onClick?: (e: SportEventDtoWithStat) => void;
  sport?: string;
}

export const MatchRowIsolated: React.FC<IMatchRowIsolatedProps> = ({
  match,
  homeSound = '',
  matchOdds,
  i18n,
  isDetail,
  theme = 'light',
  sport = SPORT.AMERICAN_FOOTBALL,
  onClick,
  isSimulator = true,
}) => {
  const { showSelectedMatch, selectedMatch } = useMatchStore();

  const {
    homeTeam,
    awayTeam,
    startTimestamp = 0,
    id,
    time,
    status,
    uniqueTournament: tournament = {} as TournamentDto,
  } = match || {};

  const { currentPeriodStartTimestamp, remainTime } = time || {};

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
  const [homeScore, setHomeScore] = useState<IScore | object>(match?.homeScore);
  const [awayScore, setAwayScore] = useState<IScore | object>(match?.awayScore);
  const [isFollowed, setIsFollowed] = useState(() => {
    const isMatchFollowed = matchFollowed.some(
      (item: any) => item.matchId === id
    );
    return isMatchFollowed;
  });

  const isSelectedMatch = selectedMatch == id && showSelectedMatch;
  // to save local favorite

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
        tournament?.id,
        tournament?.category?.name || '',
        tournament?.name || '',
        match?.uniqueTournament?.name || '',
        sport,
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
    setHomeScore(match?.homeScore);
    setAwayScore(match?.awayScore);
  }, [homeScore, awayScore]);

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

      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isBellOn, homeSound]);

  const isFinished = isMatchEndAMFootball(status.code);

  const isMatchInProgress = checkInProgressMatchAMFootball(status.code);

  const mapScore = useMemo(
    () => ({
      [MatchStateAMFootball.FIRST_QUARTER]: match?.scores?.p1 || 0,
      [MatchStateAMFootball.FIRST_PAUSE]: match?.scores?.p1 || 0,
      [MatchStateAMFootball.SECOND_QUARTER]: match?.scores?.p2 || 0,
      [MatchStateAMFootball.SECOND_PAUSE]: match?.scores?.p2 || 0,
      [MatchStateAMFootball.THIRD_QUARTER]: match?.scores?.p3 || 0,
      [MatchStateAMFootball.THIRD_PAUSE]: match?.scores?.p3 || 0,
      [MatchStateAMFootball.FOURTH_QUARTER]: match?.scores?.p4 || 0,
      [MatchStateAMFootball.FOURTH_PAUSE]: match?.scores?.p4 || 0,
      [MatchStateAMFootball.OVERTIME]: match?.scores?.ot || 0,
    }),
    [match?.scores]
  );

  const isHasStat = isMatchHaveStatAMFootball(status.code);

  if (!match || Object.keys(match).length === 0)
    return <MatchSkeletonMapping />;
  
  return (
    <TwMatchRow
      data-testid='match-row' // Add the 'data-' prefix to the 'testId' prop
      id={match.id}
      className={clsx(
        'dark:border-linear-box cursor-pointer border border-line-default bg-white  py-2.5 text-csm dark:border-0 dark:bg-primary-gradient',
        {
          'dark:!border-all-blue': isSelectedMatch,
        }
      )}
      onClick={() => onClick && onClick(match)}
    >
      <MatchTimeStamp
        type='league'
        startTimestamp={startTimestamp}
        status={status}
        id={id}
        i18n={i18n}
        currentPeriodStartTimestamp={currentPeriodStartTimestamp}
        remainTime={remainTime}
        competition={tournament}
        showTime={false}
      />
      <TwTeamScoreCol className=' flex w-1/4 items-center '>
        <TwTeamNameCol className=''>
          <div className=' flex items-center gap-2' test-id='club1-info'>
            <div className=' min-w-5' test-id='club1-logo'>
              <AvatarTeamCommon
                team={homeTeam}
                size={20}
                sport={sport}
                onlyImage
              />
            </div>
            <TwTeamName>{homeTeam?.name}</TwTeamName>
          </div>
          <div className=' flex gap-2' test-id='club2-info'>
            <div test-id='club2-logo'>
              <AvatarTeamCommon
                team={awayTeam}
                size={20}
                sport={sport}
                onlyImage
              />
            </div>
            <TwTeamName>{awayTeam?.name}</TwTeamName>
          </div>
        </TwTeamNameCol>

        <div className='flex items-center gap-x-1' test-id='score-info'>
          <RenderIf isTrue={isMatchInProgress}>
            <SubScore
              homScore={
                (
                  mapScore[status.code as keyof typeof mapScore] as number[]
                )?.[0]
              }
              awayScore={
                (
                  mapScore[status.code as keyof typeof mapScore] as number[]
                )?.[1]
              }
            />
          </RenderIf>
          <RenderIf isTrue={isHasStat && !!match?.scores}>
            <MatchScoreColumn
              code={status.code}
              homeScore={
                match?.scores?.ot?.[0] ||
                (match?.scores?.ft && match?.scores?.ft[0]!)
              }
              awayScore={
                match?.scores?.ot?.[1] || match?.scores?.ft && match?.scores?.ft[1]!
              }
            />
          </RenderIf>
        </div>
      </TwTeamScoreCol>
      <TwBellCol className={clsx({ '!justify-center': isFinished })}>
        {!isFinished && (
          <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
        )}
        <div onClick={(e) => changeFollow(e)} test-id='star-follow'>
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

