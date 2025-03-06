import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useWindowSize } from '@/hooks';

import ConnerColumn from '@/components/modules/football/CornerColumn';
import {
  FormBadge,
  SoccerTeam,
} from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import {
  FirstCol,
  TwScoreCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { useMatchStore } from '@/stores';

import MatchTimestamp from '@/components/modules/football/match/MatchTimeStamp';
import { SportEventDtoWithStat } from '@/constant/interface';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import { Images, getImage, isMatchHaveStat, isMatchNotStarted } from '@/utils';
import clsx from 'clsx';

const MatchRowH2H = ({
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
    homeScore,
    awayScore,
    winnerCode = 0,
    status,
    tournament,
    startTimestamp = 0,
    time,
  } = h2hEvent;

  const { currentPeriodStartTimestamp } = time || {};
  const { width } = useWindowSize();
  const router = useRouter();
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    // toggleShowSelectedMatch,
    setMatchDetails,
  } = useMatchStore();

  const baseClasses =
    'flex h-full min-w-[1.375rem] items-center justify-center rounded-t-[4px] py-[2px] text-xs  text-all-blue dark:text-white font-semibold';

  const isSelectedMatch = useMemo(() => {
    return selectedMatch === id;
  }, [selectedMatch]);

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
    <TwBorderLinearBox className='dark:border-linear-box border border-light-theme bg-white dark:border-0 dark:bg-primary-gradient'>
      <li
        test-id='match-h2h'
        id={h2hEvent.id}
        className={clsx(
          'flex cursor-pointer items-center gap-2 rounded-md  bg-white p-1.5 text-sm dark:bg-transparent',
          {
            'lg:!border-all-blue':
              isSelectedMatch && !type2nd && !!showQuickView,
          }
        )}
        onClick={() => {
          if (width < 1024 || isDetail) {
            router.push(`/football/match/${h2hEvent?.slug}/${h2hEvent?.id}`);
          } else {
            if (`${id}` !== `${selectedMatch}`) {
              setShowSelectedMatch(true);
              setMatchDetails(h2hEvent);
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
          <div className='dev2 w-full space-y-1' test-id='match-row'>
            <SoccerTeam
              logoUrl={`${getImage(Images.team, homeTeam?.id)}`}
              name={`${homeTeam.name}`}
              team={homeTeam}
            ></SoccerTeam>

            <SoccerTeam
              logoUrl={`${getImage(Images.team, awayTeam?.id)}`}
              name={`${awayTeam.name}`}
              team={awayTeam}
            ></SoccerTeam>
          </div>

          <div className=' flex  justify-evenly space-x-2'>
            {!isMatchNotStarted(status.code) && (
              <div
                className='flex flex-col place-content-center'
                test-id='row1'
              >
                <MatchScoreColumn
                  code={status.code}
                  homeScore={homeScore.display}
                  awayScore={awayScore.display}
                />
              </div>
            )}
            {!isMatchNotStarted(status.code) && (
              <>
                <div className='flex flex-col place-content-center items-center justify-center '>
                  <TwScoreCol className='!w-full justify-between'>
                    <div className={baseClasses} test-id='score-period1'>
                      {homeScore.period1}
                    </div>
                    <div className={baseClasses} test-id='score-period2'>
                      {awayScore.period1}
                    </div>
                  </TwScoreCol>
                </div>
                <ConnerColumn
                  homeConner={
                    !isMatchNotStarted(status.code) &&
                    homeScore?.corner &&
                    homeScore?.corner > 0
                      ? homeScore?.corner
                      : 0
                  }
                  awayConner={
                    !isMatchNotStarted(status.code) &&
                    awayScore?.corner &&
                    awayScore?.corner > 0
                      ? awayScore?.corner
                      : 0
                  }
                />
              </>
            )}

            {h2HFilter !== 'h2h' && isMatchHaveStat(status.code) && (
              <div
                className='flex place-content-center items-center justify-center px-2'
                test-id='status-code'
              >
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
    </TwBorderLinearBox>
  );
};

export default MatchRowH2H;
