import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { useMessage } from '@/hooks/useFootball/useMessage';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import {
  TwBellCol,
  TwMatchRow,
} from '@/components/modules/football/tw-components';
import ExcludeSVG from '~/svg/exclude.svg';

import { useMatchStore, useSitulations } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useMatchNotify } from '@/stores/notification-store';

import Button from '@/components/buttons/Button';
import Transition from '@/components/common/Transition';
import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import {
  MatchScoreColumn,
  MatchTimeStamp,
  Score,
} from '@/components/modules/tennis';
import { audioArray } from '@/constant/audioArray';
import {
  FinishedStatesTennis,
  MatchOdd,
  MatchStateTennis,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { isMatchNotStartedTennis } from '@/utils';
import { timeStampFormat } from '@/utils/timeStamp';
import TennisBallSVG from '/public/svg/tennis-ball.svg';
import { SPORT } from '@/constant/common';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

export interface IMatchRowIsolatedProps {
  match: SportEventDtoWithStat;
  homeSound: string;
  matchOdds?: MatchOdd | undefined;
  i18n?: any;
  theme?: string;
  isSimulator?: boolean;
  isDetail?: boolean;
  sport?: string;
  handleClick: (e: SportEventDtoWithStat) => void;
}

export const MatchRowIsolated: React.FC<IMatchRowIsolatedProps> = ({
  match,
  homeSound,
  i18n,
  handleClick,
  isDetail,
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
    slug,
    tournament,
    serve,
    scores = {},
  } = match || {};

  let getFT = null;
  let getPT = null;
  let getScoresRest = null;
  if (scores) {
    const {
      ft = ['0', '0'] as any,
      pt = ['0', '0'] as any,
      ...scoresRest
    } = scores;
    getFT = ft;
    getPT = pt;
    getScoresRest = scoresRest;
  }

  const { currentPeriodStartTimestamp, remainTime } = time || {};
  const matchDetailRef = useRef<any>(null);

  const { mutate } = useMessage();
  const {
    matches: matchesNotify,
    addMore: addMoreMatchNotify,
    removeId,
  } = useMatchNotify();
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();
  const { setSitulations } = useSitulations();

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
        match?.tournament?.id,
        match?.tournament.category?.name || '',
        match?.tournament?.name || '',
        match?.uniqueTournament?.name || '',
        SPORT.TENNIS,
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

  const handleOpenMatchLive = (e: any) => {
    e.stopPropagation();
    setSitulations(match.id);
  };

  const isHideScore = [
    MatchStateTennis.Ended,
    MatchStateTennis.Retired,
    MatchStateTennis.Retired1,
    MatchStateTennis.Retired2,
  ].includes(status?.code || 100);

  const isDark = theme === 'dark';

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

        // setShouldExecuteAction(false);
      }, 5000);

      // setShouldExecuteAction(true);

      return () => clearTimeout(timer);
    }
  }, [isBellOn, homeSound]);

  const isFinished =
    status?.type === 'finished' || FinishedStatesTennis.includes(status?.code);

  if (!match || Object.keys(match).length === 0)
    return <MatchSkeletonMapping />;
  return (
    <TwMatchRow
      test-id='match-row'
      id={match.id}
      ref={matchDetailRef}
      className={clsx(
        'dark:border-linear-box cursor-pointer border border-line-default bg-white py-2.5 text-csm dark:border-none dark:bg-primary-gradient',
        {
          'dark:!border-all-blue': isSelectedMatch,
        }
      )}
      onClick={() => handleClick(match)}
    >
      <MatchTimeStamp
        type='league'
        startTimestamp={startTimestamp}
        status={status}
        id={id}
        i18n={i18n}
        currentPeriodStartTimestamp={currentPeriodStartTimestamp}
        competition={tournament}
        showTime={false}
      />
      <div className='flex w-1/4 flex-1 items-center gap-2  '>
        <div className='flex w-20 flex-1 flex-col justify-between gap-1.5'>
          <div className=' flex items-center gap-2' test-id='club1-info'>
            <div className='' test-id='club1-logo'>
              <AvatarTeamCommon
                team={homeTeam}
                sport={SPORT.TENNIS}
                size={20}
                onlyImage
              />
            </div>
            <div className='my-auto shrink truncate text-csm font-normal text-black dark:text-white min-w-16'>
              {homeTeam?.name}
            </div>
            {serve == 1 && (
              <Transition className='flex justify-center items-center'>
                <div className='flex h-3 w-3 items-center justify-center'>
                  <TennisBallSVG className='h-3 w-3' />
                </div>
              </Transition>
            )}
          </div>
          <div className=' flex gap-2' test-id='club2-info'>
            <div test-id='club2-logo'>
              <AvatarTeamCommon
                team={awayTeam}
                sport={SPORT.TENNIS}
                size={20}
                onlyImage
              />
            </div>
            <div className='my-auto shrink truncate text-csm font-normal text-black dark:text-white'>
              {awayTeam?.name}
            </div>
            {serve == 2 && (
             <Transition className='flex justify-center items-center'>
                <div className='flex h-3 w-3 items-center justify-center'>
                  <TennisBallSVG className='h-3 w-3' />
                </div>
              </Transition>
            )}
          </div>
        </div>

        {/* {isShowOdds(path) && showOdds && !isDetail && (
          <OddsColumn
            matchOdds={matchOdds}
            i18n={i18n}
            oddsType={oddsType}
            theme={theme}
            matchTestStore={matchOddsStore}
          />
        )} */}

        <div className='flex items-center gap-x-1' test-id='score-info'>
          {!isDetail &&
            isSimulator &&
            !isMatchNotStartedTennis(match?.status?.code) && (
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
          {!isMatchNotStartedTennis(status?.code) && getScoresRest && getFT && (
            <>
              {!isHideScore && <Score scores={scores} status={status} />}
              <MatchScoreColumn
                code={status?.code}
                homeScore={getFT[0]}
                awayScore={getFT[1]}
              />
            </>
          )}
        </div>
      </div>
      <TwBellCol className={clsx({ '!justify-center': isFinished })}>
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
      </TwBellCol>
    </TwMatchRow>
  );
};
