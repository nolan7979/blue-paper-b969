import clsx from 'clsx';
import { useTheme } from 'next-themes';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useConvertPath } from '@/hooks/useConvertPath';
import { useMessage } from '@/hooks/useFootball/useMessage';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import {
  TwBellCol,
  TwMatchRow,
  TwOddsCol,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import {
  ISelectBookMaker,
  useMatchStore,
  useOddsStore,
  useSettingsStore,
} from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useMatchNotify } from '@/stores/notification-store';

import { INITIAL_COLORS } from '@/constant/colors';
import { SPORT } from '@/constant/common';
import {
  FinishedStates,
  MatchOdd,
  MatchOddTestStore,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { Colors, Odds, OddsRowProps } from '@/models/mathIsolated';
import MatchScoreColumn from '@/modules/volleyball/liveScore/components/MatchScoreColumn';
import { convertOdds, isMatchHaveStatVlb, MatchStateVolleyball } from '@/utils';
import { determineColor } from '@/utils/matchingColor';
import { timeStampFormat } from '@/utils/timeStamp';

import { Score } from '@/components/modules/tennis';
import MatchTimestamp from '@/components/modules/volleyball/match/MatchTimeStamp';
import ClosedSVG from '/public/svg/closed.svg';

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
    status.type === 'finished' || [MatchStateVolleyball.ENDED].includes(status.code);

  const isFootball = sport === SPORT.FOOTBALL;

  if (!match || Object.keys(match).length === 0)
    return <MatchSkeletonMapping />;
  return (
    <div
      data-testid='match-row' // Add the 'data-' prefix to the 'testId' prop
      id={match.id}
      className={clsx(
        'dark:bg-primary-gradient cursor-pointer bg-white py-2.5  text-csm flex rounded-md  md:px-2 hover:brightness-90 dark:hover:brightness-150 mb-2 last:mb-0 border border-line-default dark:border-0',
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
              <CustomLink
                href={
                  homeTeam?.slug
                    ? `/${sport}/competitor/${homeTeam?.slug}/${homeTeam?.id}`
                    : '/'
                } // TODO use slug
                target='_parent'
              >
                <Avatar
                  id={homeTeam?.id}
                  type='team'
                  isBackground={false}
                  rounded={false}
                  sport={sport}
                  width={20}
                  height={20}
                  isSmall
                />
              </CustomLink>
            </div>
            <TwTeamName>{homeTeam?.name}</TwTeamName>
          </div>
          <div className=' flex gap-2' test-id='club2-info'>
            <div className=' min-w-5' test-id='club2-logo'>
              <CustomLink
                href={
                  awayTeam?.slug
                    ? `/${sport}/competitor/${awayTeam?.slug}/${awayTeam?.id}`
                    : '/'
                }
                target='_parent'
              >
                <Avatar
                  id={awayTeam?.id}
                  type='team'
                  sport={sport}
                  isBackground={false}
                  rounded={false}
                  width={20}
                  height={20}
                  isSmall
                />
              </CustomLink>
            </div>
            <TwTeamName>{awayTeam?.name}</TwTeamName>
          </div>
        </TwTeamNameCol>

        {isMatchHaveStatVlb(status.code) && ft && ft.length > 0 && (
          <div className='flex items-center gap-x-1' test-id='score-info'>
            {/* <Score scores={scoresRest} status={status} /> */}

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