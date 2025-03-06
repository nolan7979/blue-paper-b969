import clsx from 'clsx';
import { useMemo } from 'react';

import {
  IScore,
  MatchStateTennis,
  SportEventDto,
  StatusDto,
} from '@/constant/interface';

import {
  formatMatchTimestampTennis,
  genDisplayedTimeTennis,
  isMatchHaveStatTennis,
  renderRoundOfMatchTennis,
} from '@/utils';
import React from 'react';
import vi from '~/lang/vi';

interface MatchTimeScore {
  status?: StatusDto;
  i18n: any;
  match: SportEventDto;
  isTimeThird?: boolean;
  currentPeriodStartTimestamp?: number;
  isFeaturedMatch?: boolean;
}

const MatchTimeScore: React.FC<MatchTimeScore> = ({
  i18n = vi,
  match,
  isTimeThird = false,
  status: statusLive,
  isFeaturedMatch,
  currentPeriodStartTimestamp,
}) => {
  const { id, startTimestamp, status, time, scores } = match as any;
  const { code } = statusLive || status || {};

  const [timeArr] = formatMatchTimestampTennis(
    startTimestamp,
    status || {},
    false,
    currentPeriodStartTimestamp
  );

  const renderRoundOfMatch = useMemo(() => {
    if (scores) {
      return renderRoundOfMatchTennis(code);
    }
    return ``;
  }, [code, scores, isFeaturedMatch, id]);

  const getCurrScore = () => {
    const getKey = Object.keys(scores).filter(
      (key: string) => key !== 'ft' && key !== 'pt' && !key.includes('x')
    );
    if (getKey.length > 0) {
      return `${scores[`p${getKey.length}`][0]} - ${
        scores[`p${getKey.length}`][1]
      }`;
    }
    return '';
  };

  const textStatusTime =
    genDisplayedTimeTennis(
      startTimestamp,
      status,
      i18n,
      currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp
    ) || [];

  if (!scores) {
    return <></>;
  }

  return (
    <div className='flex flex-1 flex-col place-content-center items-center justify-start gap-2 font-oswald'>
      {!isMatchHaveStatTennis(status.code) && (
        <>
          <div className='flex place-content-center text-center text-lg font-medium text-white lg:text-dark-text dark:text-white'>
            {textStatusTime[1]}
          </div>
          <div className='relative bottom-1 flex place-content-center text-center font-medium text-white lg:text-dark-text dark:lg:text-dark-draw'>
            <div className='font-oswald'>{textStatusTime[0]}</div>
          </div>
          {textStatusTime[2] && (
            <div className='relative bottom-2 flex place-content-center text-center font-medium text-white lg:text-dark-text dark:lg:text-dark-draw'>
              <div className='font-oswald'>{textStatusTime[2]}</div>
            </div>
          )}
        </>
      )}
      {!isFeaturedMatch && isMatchHaveStatTennis(status.code) && (
        <div className='flex flex-1 flex-col place-content-center items-center gap-y-1 font-oswald'>
          <div
            className={clsx(
              'flex place-content-center text-center font-medium',
              status.type === 'inprogress'
                ? 'font-semibold text-dark-orange'
                : 'text-white lg:text-dark-dark-blue lg:dark:text-dark-green'
            )}
          >
            {renderRoundOfMatch}
          </div>
        </div>
      )}

      {isMatchHaveStatTennis(status.code) && (
        <div className='whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score px-7 py-1.5 font-oswald text-3xl font-black text-match-score dark:bg-transparent'>
          {scores?.ft[0]} - {scores?.ft[1]}
        </div>
      )}
      <div className='hidden justify-center gap-1.5 text-center align-middle text-csm dark:text-white lg:flex'>
        {getCurrScore()}{' '}
        {/* <span>{dateTimeZone}</span>
          <span>{renderTimeZone(timeTimeZone)}</span> */}
        {isMatchHaveStatTennis(status.code) &&
          scores?.pt &&
          `(${scores?.pt[0] || 0} - ${scores?.pt[1] || 0})`}
      </div>
    </div>
  );
};

export default MatchTimeScore;
