import clsx from 'clsx';
import React, { useState } from 'react';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import {
  TwBellCol,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import { SportEventDtoWithStat } from '@/constant/interface';
import MatchScoreColumn from '@/modules/baseball/liveScore/components/MatchScoreColumn';
import { useMatchStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { isMatchHaveStatBadminton } from '@/utils';
import { timeStampFormat } from '@/utils/timeStamp';

import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import MatchTimestamp from '@/components/modules/baseball/match/MatchTimeStamp';
import { SPORT } from '@/constant/common';
import { MatchBaseballState } from '@/utils/baseballUtils';

export interface IMatchRowLeagueProps {
  match: SportEventDtoWithStat;
  i18n?: any;
  onClick?: (e: SportEventDtoWithStat) => void;
  sport?: string;
}

export const MatchRowLeague: React.FC<IMatchRowLeagueProps> = ({
  match,
  i18n,
  sport,
  onClick,
}) => {
  const { showSelectedMatch, selectedMatch } = useMatchStore();
  const {
    homeTeam,
    awayTeam,
    startTimestamp = 0,
    id,
    time,
    status,
    uniqueTournament,
    scores,
  } = match;

  const { ft, ...scoresRest } = scores || {};
  const { currentPeriodStartTimestamp, remainTime } = time || {};
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();

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
      if (match?.uniqueTournament)
        addMatches(
          id,
          formattedTime,
          formattedDate,
          match?.uniqueTournament?.id,
          match?.uniqueTournament.category?.name || '',
          match?.uniqueTournament?.name || ''
        );
      setIsFollowed(true);
    }
  };
  const isFinished =
    status.type === 'finished' ||
    [MatchBaseballState.ENDED].includes(status.code);

  if (!match || Object.keys(match).length === 0)
    return <MatchSkeletonMapping />;
  return (
    <div
      data-testid='match-row' // Add the 'data-' prefix to the 'testId' prop
      id={match.id}
      className={clsx(
        'mb-2 flex cursor-pointer rounded-md border  border-line-default bg-white py-2.5 text-csm last:mb-0 hover:brightness-90 dark:border-0 dark:bg-primary-gradient dark:hover:brightness-150 md:px-2',
        {
          'dark:!border-all-blue': isSelectedMatch,
        }
      )}
      onClick={() => onClick && onClick(match)}
    >
      {uniqueTournament && (
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
          sport={sport}
        />
      )}

      <TwTeamScoreCol className=' flex w-1/4 items-center '>
        <TwTeamNameCol className=''>
          <div className=' flex items-center gap-2' test-id='club1-info'>
            <div className=' min-w-5' test-id='club1-logo'>
              <HandleGroupAvatar
                team={homeTeam}
                size={20}
                sport={SPORT.BADMINTON}
              />
            </div>
            <TwTeamName>{homeTeam?.name}</TwTeamName>
          </div>
          <div className=' flex gap-2' test-id='club2-info'>
            <div className=' min-w-5' test-id='club2-logo'>
              <HandleGroupAvatar
                team={awayTeam}
                size={20}
                sport={SPORT.BADMINTON}
              />
            </div>
            <TwTeamName>{awayTeam?.name}</TwTeamName>
          </div>
        </TwTeamNameCol>

        {isMatchHaveStatBadminton(status.code) && ft && ft.length > 0 && (
          <div className='flex items-center gap-x-1' test-id='score-info'>
            <MatchScoreColumn
              code={status.code}
              homeScore={ft[0]}
              awayScore={ft[1]}
            />
          </div>
        )}
      </TwTeamScoreCol>
      <TwBellCol className={clsx({ '!justify-center': isFinished })}>
        <div onClick={(e) => changeFollow(e)} test-id='star-follow'>
          {isFollowed ? (
            <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
          ) : (
            <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
          )}
        </div>
      </TwBellCol>
    </div>
  );
};

export default MatchRowLeague;
