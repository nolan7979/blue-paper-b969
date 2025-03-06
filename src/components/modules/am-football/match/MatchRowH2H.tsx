import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { useWindowSize } from '@/hooks';

import {
  FormBadge,
  SoccerTeam,
} from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import {
  FirstCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { useMatchStore, useMatchStore2nd } from '@/stores';

import { SportEventDtoWithStat } from '@/constant/interface';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import { Images, getImage, isMatchNotStarted } from '@/utils';
import clsx from 'clsx';
import { SPORT } from '@/constant/common';
import { isMatchHaveStatAMFootball } from '@/utils/americanFootballUtils';
import { WrapperBorderLinearBox } from '@/components/modules/common/tw-components/TwWrapper';

const MatchTimeStamp = dynamic(
  () => import('@/components/modules/am-football/match/MatchTimeStamp')
);

const MatchRowH2H = ({
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
    uniqueTournament,
    startTimestamp = 0,
    time,
    scores
  } = h2hEvent;

  const { currentPeriodStartTimestamp } = time || {};

  const { width } = useWindowSize();
  const router = useRouter();
  const { asPath } = router;
  const isDetail = useMemo(() => {
    return asPath.includes('/match');
  }, [asPath]);
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
    <WrapperBorderLinearBox>
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
            router.push(`/${SPORT.AMERICAN_FOOTBALL}/match/${h2hEvent?.slug}/${h2hEvent?.id}`); // TODO slug
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
            competition={uniqueTournament}
            showTime={false}
          />
        </FirstCol>
        <TwTeamScoreCol className=' flex w-1/4 items-center '>
          <div className='dev2 w-full space-y-1'>
            <SoccerTeam
              logoUrl={`${getImage(Images.team, homeTeam?.id, true, SPORT.AMERICAN_FOOTBALL)}`}
              name={`${homeTeam.name}`}
              team={homeTeam}
              isLink={false}
            ></SoccerTeam>

            <SoccerTeam
              logoUrl={`${getImage(Images.team, awayTeam?.id, true, SPORT.AMERICAN_FOOTBALL)}`}
              name={`${awayTeam.name}`}
              team={awayTeam}
              isLink={false}
            ></SoccerTeam>
          </div>

          <div className=' flex  justify-evenly space-x-2'>
            {!isMatchNotStarted(status.code) && (
              <div className='flex flex-col place-content-center'>
                <MatchScoreColumn
                  code={status.code}
                  homeScore={scores?.ft?.[0]}
                  awayScore={scores?.ft?.[1]}
                />
              </div>
            )}
            {h2HFilter !== 'h2h' && isMatchHaveStatAMFootball(status.code) && (
              <div className='flex place-content-center items-center justify-center px-2'>
                <FormBadge
                  isWin={isWin}
                  isLoss={isLoss}
                  isDraw={winnerCode === 3}
                  isSmall={true}
                ></FormBadge>
              </div>
            )}
          </div>
        </TwTeamScoreCol>
      </li>
    </WrapperBorderLinearBox>
  );
};

export default MatchRowH2H;
