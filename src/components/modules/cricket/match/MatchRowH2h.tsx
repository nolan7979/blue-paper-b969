import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useWindowSize } from '@/hooks';

import ConnerColumn from '@/components/modules/cricket/CornerColumn';
import {
  FormBadge,
  SoccerTeam,
} from '@/components/modules/cricket/quickviewColumn/QuickViewComponents';
import {
  FirstCol,
  TwScoreCol,
  TwTeamScoreCol,
} from '@/components/modules/cricket/tw-components';
import { TwBorderLinearBox } from '@/components/modules/cricket/tw-components/TwCommon.module';

import { useMatchStore, useMatchStore2nd } from '@/stores';

import { SportEventDtoWithStat } from '@/constant/interface';
import MatchScoreColumn from '@/modules/cricket/liveScore/components/MatchScoreColumn';
import { Images, getImage, isMatchHaveStat, isMatchNotStarted } from '@/utils';
import clsx from 'clsx';
import MatchTimestamp from '@/components/modules/cricket/match/MatchTimeStamp';



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
  } = useMatchStore();

  const {
    selectedMatch: selectedMatch2nd,
    setShowSelectedMatch: setShowSelectedMatch2nd,
    setSelectedMatch: setSelectedMatch2nd,
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
    <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <li 
        test-id='match-h2h'
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
          if (width < 1024) {
            setSelectedMatch(`${id}`);
            // go to detailed page for small screens
            router.push(`/cricket/match/${h2hEvent?.slug}/${h2hEvent?.id}`); // TODO slug
            // window.location.href = `/match/${h2hEvent?.slug}/${h2hEvent?.id}`;
          } else {
            if (type2nd) {
              if (`${id}` === `${selectedMatch2nd}`) {
                // toggleShowSelectedMatch();
              } else {
                setShowSelectedMatch2nd(true);
                setSelectedMatch2nd(`${id}`);
              }
            } else {
              if (`${id}` === `${selectedMatch}`) {
                // toggleShowSelectedMatch();
              } else {
                setShowSelectedMatch(true);
                setSelectedMatch(`${id}`);
              }
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
              <div className='flex flex-col place-content-center' test-id='row1'>
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
                    <div
                      className='h-full min-w-[1.375rem] rounded-t-[4px]  pb-1 pt-[2px] text-msm font-bold text-all-blue  dark:text-white'
                      test-id='score-period1'
                    >
                      {homeScore.period1}
                    </div>
                    <div
                      className='h-full min-w-[1.375rem] rounded-b-[4px] pb-[2px] pt-1 text-msm font-bold text-all-blue  dark:text-white'
                      test-id='score-period2'
                    >
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
              <div className='flex place-content-center items-center justify-center px-2' test-id='status-code'>
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
