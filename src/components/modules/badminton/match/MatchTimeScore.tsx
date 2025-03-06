import { SportEventDto, StatusDto } from '@/constant/interface';
import {
  MatchBadmintonState,
  genDisplayedTimeBadminton,
  isMatchCanceledBmt,
  isMatchHaveStatBadminton,
  isMatchInprogressBmt,
  isMatchNotStartedBmt,
  renderRoundOfMatchBadminton,
} from '@/utils';

import clsx from 'clsx';
import { useMemo } from 'react';
import en from '~/lang/en';

interface MatchTimeScore {
  scores?: any;
  status?: StatusDto;
  isScoreNotAvailable: boolean;
  i18n: any;
  match: SportEventDto;
  isTimeThird?: boolean;
  currentPeriodStartTimestamp?: number;
  isClub?: boolean;
}

export const MatchTimeScore: React.FC<MatchTimeScore> = ({
  scores,
  isScoreNotAvailable,
  i18n = en,
  match,
  isTimeThird = false,
  currentPeriodStartTimestamp,
  status: statusLive,
  isClub,
}) => {
  const { id, startTimestamp, status, time } = match;

  const textStatusTime =
    genDisplayedTimeBadminton(
      startTimestamp,
      status,
      i18n,
      currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp
    ) || [];

  const renderRoundOfMatch = renderRoundOfMatchBadminton(status);

  if (!scores) {
    return <></>;
  }

  return (
    <div className='flex flex-1 flex-col place-content-center items-center justify-start gap-2'>
      <div className='flex flex-col place-content-center items-center gap-y-1 font-oswald'>
        {isMatchNotStartedBmt(status.code) && (
          <>
            <div className='place-content-center text-center text-lg font-medium text-white lg:text-dark-text lg:dark:text-white '>
              {textStatusTime[1]}
            </div>
            <div className='relative bottom-1 place-content-center text-center font-medium text-white dark:text-dark-text lg:text-dark-text'>
              <div className='font-oswald'>{textStatusTime[0]}</div>
              {textStatusTime[2] && (
                <div className='font-oswald'>{textStatusTime[2]}</div>
              )}
            </div>
          </>
        )}
      </div>
      {(!isMatchCanceledBmt(status.code) ||
        isMatchInprogressBmt(status.code)) && (
        <div className='flex place-content-center text-center  font-medium text-dark-green lg:text-minute lg:dark:text-dark-green'>
          {renderRoundOfMatch}
        </div>
      )}
      {!isScoreNotAvailable && isMatchHaveStatBadminton(status.code) && (
        <div
          className={`whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score ${
            isClub ? 'px-[10px] text-2xl' : 'px-7 text-3xl'
          } py-1.5 font-oswald font-black text-match-score dark:bg-transparent`}
        >
          {scores.ft[0]} - {scores.ft[1]}
        </div>
      )}
    </div>
  );
};
