import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import {
  TwBellCol,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import { useMessage } from '@/hooks/useFootball/useMessage';

import { useMatchStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useMatchNotify } from '@/stores/notification-store';

import { audioArray } from '@/constant/audioArray';
import { SPORT } from '@/constant/common';
import {
  MatchOdd,
  SportEventDtoWithStat
} from '@/constant/interface';
import { getSlug, isInProgessMatchHockey, isMatchesEndedHockey, isMatchesHaveScoreHockey } from '@/utils';
import { timeStampFormat } from '@/utils/timeStamp';

import MatchTimestamp from '@/components/modules/hockey/match/MatchTimeStamp';
import { Score } from '@/components/modules/hockey/match/Score';
import { useMatchScores } from '@/hooks/useHockey/useMatchScores';
import MatchScoreColumn from '@/modules/hockey/liveScore/components/MatchScoreColumn';
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
  i18n,
  isDetail,
  sport = SPORT.BASKETBALL,
  onClick,
}) => {
  const { showSelectedMatch, selectedMatch } = useMatchStore();
  const { homeTeam, awayTeam, startTimestamp = 0, id, time, status, uniqueTournament } = match || {};

  const { currentPeriodStartTimestamp } = time || {};
  const { runSeconds, countDown, updateTime, remainTime } = match?.timer || {};
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
  const matchScores = useMatchScores(match);

  const memoziedScore = useMemo(() => {
    const { scores, scoresRest } = getScores(matchScores);
    return {
      scores,
      scoresRest,
    };
  }, [matchScores]) as { scores: number[], scoresRest: Record<string, any> };

  const changeFollow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isFollowed) {
      removeMatches(id);
      setIsFollowed(false);
    } else {
      if (!uniqueTournament) return;
      addMatches(
        id,
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
      }, 5000);

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

  const isFinished = isMatchesEndedHockey(status.code);

  if (!match || Object.keys(match).length === 0)
    return <MatchSkeletonMapping />;
  return (
    <TwMatchRow
      id={match.id}
      className={clsx(
        'dark:border-linear-box cursor-pointer bg-white py-2.5 text-csm  dark:bg-primary-gradient border border-line-default dark:border-0',
        {
          'dark:!border-all-blue': isSelectedMatch,
        }
      )}
      onClick={() => onClick && onClick(match)}
    >
      <MatchTimestamp
        type='league'
        startTimestamp={startTimestamp}
        status={status}
        id={id}
        i18n={i18n}
        currentPeriodStartTimestamp={currentPeriodStartTimestamp}
        remainTime={remainTime}
        competition={uniqueTournament}
        showTime={false}
        runSeconds={runSeconds}
        countDown={countDown}
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

export const getScores = (scores: any): { scores: number[] | string, scoresRest: any } => {
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
