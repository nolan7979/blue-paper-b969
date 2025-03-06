import { formatTime, isMatchesPausedHockey } from '@/utils';
import clsx from 'clsx';
import React from 'react';

// Define a type for the component props
interface MatchTimeBlinksProps {
  dateTimeZone: string;
  timeTimeZone: string | JSX.Element;
  code: number;
  currentPeriodStartTimestamp: number;
  showTime: boolean;
  remainTime: number;
  isInprogress: boolean;
  timeSub: number | string;
  isCurrentTime?: boolean;
}

const MatchTimeBlinks: React.FC<MatchTimeBlinksProps> = ({
  dateTimeZone,
  timeTimeZone,
  code,
  currentPeriodStartTimestamp,
  showTime,
  remainTime,
  isInprogress,
  timeSub,
  isCurrentTime,
}) => {

  return (
    <div dir='ltr' className={clsx('text-xs font-normal', {
      'flex flex-col': isInprogress,
      'flex space-x-1': !isInprogress
    })}>
      {!isCurrentTime && (
        <span className='text-xs dark:text-white'>
          {dateTimeZone}
        </span>
      )}
      <span className={clsx({
        'text-minute dark:text-dark-green': isInprogress,
        'dark:text-white': !isInprogress
      })}>
        {!isInprogress && (showTime && timeSub ? timeSub : timeTimeZone)}
        {isInprogress && (
          <>
            {timeSub}
            {remainTime > 0 && !isMatchesPausedHockey(code) && (
              <> - {formatTime(remainTime)}</>
            )}
          </>
        )}
      </span>
    </div>
  );
};

export default MatchTimeBlinks;
