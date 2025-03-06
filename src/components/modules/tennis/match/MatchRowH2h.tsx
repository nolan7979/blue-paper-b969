import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { useWindowSize } from '@/hooks';

import { FormBadge } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import {
  FirstCol,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { useMatchStore, useMatchStore2nd } from '@/stores';

import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import { MatchScoreColumn, MatchTimeStamp } from '@/components/modules/tennis';
import { SportEventDtoWithStat } from '@/constant/interface';
import { isMatchHaveStatTennis, isMatchNotStartedTennis } from '@/utils';
import clsx from 'clsx';

export const MatchRowH2H = ({
  h2hEvent,
  h2HFilter,
  teamId,
  type2nd = false,
  showQuickView,
  isDetail = false,
}: {
  h2hEvent: SportEventDtoWithStat;
  h2HFilter?: string;
  teamId?: string;
  type2nd?: boolean;
  showQuickView?: boolean;
  isDetail?: boolean;
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
  const { ft = [0, 0], ...scoresRest } = scores || {};

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

  const { currentPeriodStartTimestamp } = time || {};

  const { width } = useWindowSize();
  const router = useRouter();
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    // toggleShowSelectedMatch,
  } = useMatchStore();

  const {
    selectedMatch: selectedMatch2nd,
    // toggleShowSelectedMatch,
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

  return (
    <TwBorderLinearBox className='dark:border-linear-box border border-line-default bg-white dark:border-0 dark:bg-primary-gradient'>
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
            setSelectedMatch(`${id}`);
            // go to detailed page for small screens
            router.push(`/tennis/match/${h2hEvent?.slug}/${h2hEvent?.id}`); // TODO slug
          } else {
            if (`${id}` !== `${selectedMatch}`) {
              setShowSelectedMatch(true);
              setSelectedMatch(`${id}`);
            }
          }
        }}
      >
        <FirstCol className='w-fit px-1 md:px-2'>
          <MatchTimeStamp
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
                <HandleGroupAvatar
                  team={homeTeam}
                  sport={'tennis'}
                  size={20}
                ></HandleGroupAvatar>
              </div>
              <TwTeamName>{homeTeam?.name}</TwTeamName>
            </div>
            <div className=' flex gap-2' test-id='club2-info'>
              <div className=' min-w-5' test-id='club2-logo'>
                <HandleGroupAvatar
                  team={awayTeam}
                  sport={'tennis'}
                  size={20}
                ></HandleGroupAvatar>
              </div>
              <TwTeamName>{awayTeam?.name}</TwTeamName>
            </div>
          </TwTeamNameCol>

          <div className=' flex  justify-evenly space-x-2'>
          {!isMatchNotStartedTennis(status?.code) && getScoresRest && getFT && (
              <>
                <MatchScoreColumn
                  code={status?.code}
                  homeScore={ft[0]}
                  awayScore={ft[1]}
                />
              </>
            )}

            {h2HFilter !== 'h2h' && isMatchHaveStatTennis(status?.code) && (
              <div
                className='flex place-content-center items-center justify-center px-2'
                test-id='status'
              >
                <FormBadge
                  isWin={isWin}
                  isLoss={isLoss}
                  isDraw={winnerCode === 3}
                  isSmall={true}
                />
              </div>
            )}
          </div>
        </TwTeamScoreCol>
      </li>
    </TwBorderLinearBox>
  );
};
