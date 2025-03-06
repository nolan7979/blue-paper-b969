import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import { useWindowSize } from '@/hooks';

import {
  FormBadge
} from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import {
  FirstCol,
  TwBellCol,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { useFollowStore, useMatchStore, useMatchStore2nd } from '@/stores';

import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import MatchTimestamp from '@/components/modules/badminton/match/MatchTimeStamp';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import { SPORT } from '@/constant/common';
import { FinishedStates, SportEventDtoWithStat } from '@/constant/interface';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import {
  isMatchHaveStatBadminton
} from '@/utils';
import clsx from 'clsx';
import { WrapperBorderLinearBox } from '@/components/modules/common/tw-components/TwWrapper';
import { timeStampFormat } from '@/utils/timeStamp';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { StarBlank } from '@/components/icons/StarBlank';

// const MatchTimeStamp = dynamic(() =>
//   import('@/components/modules/tennis').then((mod) => mod.MatchTimeStamp)
// );

export const MatchRowH2H = ({
  h2hEvent,
  h2HFilter,
  teamId,
  type2nd = false,
  showQuickView,
}: {
  h2hEvent: SportEventDtoWithStat;
  h2HFilter?: string;
  teamId?: string;
  type2nd?: boolean;
  showQuickView?: boolean;
}) => {
  const {
    id,
    homeTeam,
    awayTeam,
    winnerCode = 0,
    status,
    tournament,
    startTimestamp = 0,
    time,
    scores = {},
  } = h2hEvent;
  const { ft, ...scoresRest } = scores;

  const { currentPeriodStartTimestamp } = time || {};

  const { width } = useWindowSize();
  const router = useRouter();
  const { asPath, locale } = router;
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    // toggleShowSelectedMatch,
  } = useMatchStore();

  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const isFinished =
      status?.type === 'finished' || FinishedStates.includes(status.code);

  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { addMatches, removeMatches } = useFollowStore();
  const [isFollowed, setIsFollowed] = useState(() => {
    const isMatchFollowed = matchFollowed.some(
      (item: any) => item.matchId === id
    );
    return isMatchFollowed;
  });

  const isDetail = useMemo(() => {
    return asPath.includes('/match') || asPath.includes('/player');
  }, [asPath]);

  const {
    selectedMatch: selectedMatch2nd,
  } = useMatchStore2nd();

  const isSelectedMatch = useMemo(() => {
    return selectedMatch === id;
  }, [selectedMatch]);

  const isSelectMatch2nd = useMemo(() => {
    return selectedMatch2nd === id;
  }, [selectedMatch2nd]);

  let isWin = false;
  if (h2HFilter === 'home' || h2HFilter === 'away') {
    if (
      (teamId === homeTeam?.id && winnerCode === 1) ||
      (teamId === awayTeam?.id && winnerCode === 2)
    ) {
      isWin = true;
    }
  } else {
    isWin = false;
  }

  let isLoss = false;
  if (h2HFilter === 'home' || h2HFilter === 'away') {
    if (
      (teamId === homeTeam?.id && winnerCode === 2) ||
      (teamId === awayTeam?.id && winnerCode === 1)
    ) {
      isLoss = true;
    }
  } else {
    isLoss = false;
  }

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
        h2hEvent?.tournament?.id,
        h2hEvent?.tournament?.category?.name || '',
        h2hEvent?.tournament?.name || '',
        h2hEvent?.uniqueTournament?.name || '',
        SPORT.BADMINTON
      );
      setIsFollowed(true);
    }
  };

  return (
    <WrapperBorderLinearBox className=''>
      <li
        className={clsx(
          'flex cursor-pointer items-center gap-2 rounded-md  bg-white p-1.5 text-sm dark:bg-transparent',
          {
            'lg:!border-all-blue':
              isSelectedMatch && !type2nd && !!showQuickView,
          },
          {
            'lg:!border-all-blue':
              isSelectMatch2nd && type2nd && !!showQuickView,
          }
        )}
        onClick={() => {
          if (width < 1024 || isDetail) {
            // go to detailed page for small screens
            router.push(`/${SPORT.BADMINTON}/match/${h2hEvent?.slug}/${h2hEvent?.id}`); // TODO slug
          } else {
            if (`${id}` !== `${selectedMatch}`) {
              setShowSelectedMatch(true);
              setSelectedMatch(`${id}`);
            }
          }
        }}
      >
        <FirstCol className='w-fit px-1 md:px-2'>
          <MatchTimestamp
            type='league'
            startTimestamp={startTimestamp}
            status={status}
            id={id}
            currentPeriodStartTimestamp={currentPeriodStartTimestamp}
            competition={tournament}
            showTime={false}
          />
        </FirstCol>
        <TwTeamScoreCol className=' flex w-1/4 items-center '>
          <TwTeamNameCol className=''>
            <div className=' flex items-center gap-2' test-id='club1-info'>
              <div className=' min-w-5' test-id='club1-logo'>
                <HandleGroupAvatar team={homeTeam} sport={'badminton'} size={20} disabled></HandleGroupAvatar>
              </div>
              <TwTeamName>{homeTeam?.name}</TwTeamName>
            </div>
            <div className=' flex gap-2' test-id='club2-info'>
              <div className=' min-w-5' test-id='club2-logo'>
                <HandleGroupAvatar team={awayTeam} sport={'badminton'} size={20} disabled></HandleGroupAvatar>
              </div>
              <TwTeamName>{awayTeam?.name}</TwTeamName>
            </div>
          </TwTeamNameCol>

          <div className=' flex  justify-evenly space-x-2'>
            {isMatchHaveStatBadminton(status.code) && ft && ft.length > 0 && (
              <>
                {/* <Score scores={scoresRest} status={status} /> */}
                {
                  ft && <MatchScoreColumn
                    code={status.code}
                    homeScore={ft[0]}
                    awayScore={ft[1]}
                  />
                }
              </>
            )}

            {h2HFilter !== 'h2h' && isMatchHaveStatBadminton(status.code) && (
              <div className='flex place-content-center items-center justify-center px-2'>
                <FormBadge
                  isWin={isWin}
                  isLoss={isLoss}
                  isDraw={winnerCode === 3}
                  isSmall={true}
                />
              </div>
            )}
          </div>
          
          <TwBellCol className={clsx({ '!justify-center': isFinished })}>
            {/* {!isFinished && (
              <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
            )} */}
            <div onClick={(e) => changeFollow(e)} test-id='star-follow'>
              {isFollowed ? (
                <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
              ) : (
                <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
              )}
            </div>
          </TwBellCol>
        </TwTeamScoreCol>
      </li>
    </WrapperBorderLinearBox>
  );
};
