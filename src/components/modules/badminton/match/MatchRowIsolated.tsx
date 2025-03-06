import clsx from 'clsx';
import React, { useState } from 'react';


import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import {
  TwBellCol,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import {
  useMatchStore,
  useSitulations
} from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import {
  MatchOdd,
  SportEventDtoWithStat
} from '@/constant/interface';
import { MatchBadmintonState, isMatchHaveStatBadminton, isMatchNotStartedBmt } from '@/utils';
import { timeStampFormat } from '@/utils/timeStamp';

// import { Score } from '@/components/modules/tennis';
import Button from '@/components/buttons/Button';
import MatchScoreColumn from '@/components/modules/badminton/components/MatchScoreColumn';
import MatchTimestamp from '@/components/modules/badminton/match/MatchTimeStamp';
import { Score } from '@/components/modules/badminton/match/Score';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import ExcludeSVG from '~/svg/exclude.svg';
import Shuttlecock from '/public/svg/shuttlecock.svg';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';
import { SPORT } from '@/constant/common';

export interface IMatchRowIsolatedProps {
  match: SportEventDtoWithStat;
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
  i18n,
  isDetail,
  sport,
  onClick,
  theme = 'light',
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
    uniqueTournament,
    scores,
    serve = '0',
  } = match as any;

  const { ft, ...scoresRest } = scores || {};
  const { currentPeriodStartTimestamp, remainTime } = time || {};

  const [isBellOn, setIsBellOn] = useState<boolean>(false);
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();
  const { setSitulations } = useSitulations();

  const [isFollowed, setIsFollowed] = useState(() => {
    const isMatchFollowed = matchFollowed.some(
      (item: any) => item.matchId === id
    );
    return isMatchFollowed;
  });

  const changeBellOn = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isBellOn) {
      setIsBellOn(false);
    } else {
      setIsBellOn(true);
    }
  };

  const isSelectedMatch = selectedMatch == id && showSelectedMatch;
  const isDark = theme === 'dark';

  const handleOpenMatchLive = (e: any) => {
    e.stopPropagation();
    setSitulations(match.id);
  };

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
          match?.uniqueTournament?.name || '',
          match?.tournament?.name || '',
          sport
        );
      setIsFollowed(true);
    }
  };
  const isFinished =
    status.type === 'finished' || [MatchBadmintonState.ENDED].includes(status.code);


  if (!match || Object.keys(match).length === 0)
    return <MatchSkeletonMapping />;
  return (
    <TwMatchRow
      data-testid='match-row' // Add the 'data-' prefix to the 'testId' prop
      id={match.id}
      className={clsx(
        'dark:bg-primary-gradient dark:border-linear-box cursor-pointer !border-none bg-white py-2.5 border border-line-default dark:border-0 text-csm',
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

      <TwTeamScoreCol className='flex items-center !pl-0'>
        <TwTeamNameCol className=''>
          <div className=' flex items-center gap-2' test-id='club1-info'>
            <div className='w-auto' test-id='club1-logo'>
              <AvatarTeamCommon team={homeTeam} sport={SPORT.BADMINTON} size={20} onlyImage />
            </div>
            <TwTeamName className='flex gap-2 items-center'><span className='block max-w-40 truncate lg:max-w-full'>{homeTeam?.name}</span> {serve != '0' && serve == '1' && <div><Shuttlecock className="h-3 w-3" /></div>}</TwTeamName>
          </div>
          <div className=' flex gap-2' test-id='club2-info'>
            <div className='w-auto' test-id='club2-logo'>
              <AvatarTeamCommon team={awayTeam} sport={SPORT.BADMINTON} size={20} onlyImage />
            </div>
            <TwTeamName className='flex gap-2 items-center'><span className='block max-w-40 truncate lg:max-w-full'>{awayTeam?.name}</span> {serve != '0' && serve == '2' && <div><Shuttlecock className="h-3 w-3" /></div>}</TwTeamName>
          </div>
        </TwTeamNameCol>
        {!isDetail &&
            isSimulator &&
            !isMatchNotStartedBmt(match?.status?.code) && (
              <Button
                style={{
                  background: isDark ? 'rgba(9, 55, 148, 0.28)' : '#EAEAEA',
                }}
                onClick={handleOpenMatchLive}
                className='hidden rounded-full border-none !p-1 lg:block'
                test-id='view-stimulation'
                aria-label='view-stimulation'
              >
                <ExcludeSVG className='text-black dark:text-white' />
              </Button>
            )}
        {isMatchHaveStatBadminton(status.code) && ft && ft.length > 0 && (
          <div className='flex items-center gap-x-1' test-id='score-info'>
            <Score scores={scoresRest} status={status} />

            <MatchScoreColumn
              code={status.code}
              homeScore={ft[0]}
              awayScore={ft[1]}
            />
          </div>
        )}
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