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

interface MatchTimeScore {
  homeScore: IScore;
  awayScore: IScore;
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

  const textStatusTime =
    genDisplayedTimeTTennis(
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
      <div className='flex flex-col place-content-center items-center gap-y-1 font-oswald'>
        {!isMatchHaveStatTableTennis(code) && (
          <>
            <div
              test-id='time-score-match'
              className='flex place-content-center text-center text-lg font-medium text-white lg:text-dark-text dark:text-white'
            >
              {textStatusTime[1]}
            </div>
            <div className='relative text-center font-oswald text-white lg:text-dark-text dark:lg:text-dark-draw'>
              <div>{textStatusTime[0]}</div>
              {textStatusTime[2] && <div>{textStatusTime[2]}</div>}
            </div>
          </>
        )}
        {formatTime_sub(status?.code) && (
          <div
            className={clsx(
              'flex place-content-center text-center font-medium',
              checkInProgessMatch(status?.code)
                ? 'font-semibold text-dark-green lg:text-minute lg:dark:text-dark-green'
                : 'text-white lg:text-dark-dark-blue lg:dark:text-dark-green'
            )}
          >
            {formatTime_sub(status?.code)}
          </div>
        )}
      </div>
      {scores?.ft && status?.code != 1 && (
        <div className='whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score px-7 py-1.5 font-oswald text-3xl font-black text-match-score dark:bg-transparent lg:mb-4'>
          {scores?.ft[0]} - {scores?.ft[1]}
        </div>
      )}
    </div>
  );
};

export default MatchTimeScore;
