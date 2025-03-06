import clsx from 'clsx';
import { useMemo } from 'react';

import {
  IScore,
  MatchStateTennis,
  SportEventDto,
  StatusDto,
} from '@/constant/interface';

import React from 'react';
import vi from '~/lang/vi';
import {
  checkInProgessMatch,
  formatTime_sub,
  genDisplayedTimeTTennis,
  isMatchHaveStatTableTennis,
} from '@/utils/tableTennisUtils';
import { formatMatchTimestampAMFootball } from '@/utils/americanFootballUtils';
import {
  formatMatchTimestampSnooker,
  formatTime_sub_snooker,
  genDisplayedTimeSnooker,
  isMatchHaveStatSnooker,
} from '@/utils';

interface MatchTimeScore {
  homeScore: string | number;
  awayScore: string | number;
  status?: StatusDto;
  isScoreNotAvailable: boolean;
  i18n: any;
  match: SportEventDto;
  isTimeThird?: boolean;
  currentPeriodStartTimestamp?: number;
  isFeaturedMatch?: boolean;
}

const MatchTimeScore: React.FC<MatchTimeScore> = ({
  homeScore,
  awayScore,
  isScoreNotAvailable,
  i18n = vi,
  match,
  isTimeThird = false,
  currentPeriodStartTimestamp,
  status: statusLive,
  isFeaturedMatch,
}) => {
  const { id, startTimestamp, status, time, scores } = match as any;
  const { code } = statusLive || status || {};

  const [dateStr] = formatMatchTimestampSnooker(startTimestamp, status?.code);

  const textStatusTime =
    genDisplayedTimeSnooker(
      startTimestamp,
      status,
      i18n,
      currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp
    ) || [];
  if (!scores) {
    return <></>;
  }
  return (
    <div className='flex flex-1 flex-col place-content-center items-center justify-center gap-3'>
      <div className='flex flex-1 flex-col place-content-center items-center gap-y-1 font-oswald'>
        {!isMatchHaveStatSnooker(code) && (
          <>
            <div
              test-id='time-score-match'
              className='place-content-center text-center text-lg font-medium text-dark-text dark:text-white'
            >
              {textStatusTime[1]}
            </div>
            <div className='relative bottom-1 place-content-center text-center font-medium text-white lg:text-dark-text dark:text-white'>
              <div>{textStatusTime[0]}</div>
              {textStatusTime[2] && <div>{textStatusTime[2]}</div>}
            </div>
          </>
        )}
      </div>
      {status?.code == 16 && (
        <div className='flex place-content-center text-center font-oswald font-medium text-white lg:text-dark-dark-blue lg:dark:text-dark-green'>
          {formatTime_sub_snooker(status?.code)}
        </div>
      )}
      {!isScoreNotAvailable && isMatchHaveStatSnooker(status?.code) && (
        <>
          <div
            className={clsx(
              'flex place-content-center text-center font-oswald font-medium',
              checkInProgessMatch(status?.code)
                ? 'font-semibold text-dark-green lg:text-minute lg:dark:text-dark-green'
                : 'text-white lg:text-dark-dark-blue lg:dark:text-dark-green'
            )}
          >
            {formatTime_sub_snooker(status?.code)}
          </div>
          <div className='whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score px-7 py-1.5 font-oswald text-3xl font-black text-match-score dark:bg-transparent lg:mb-4'>
            {homeScore} - {awayScore}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchTimeScore;
