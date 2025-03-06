import { calculateTime } from '@/utils';
import React, { useEffect, useState } from 'react';

// Define a type for the component props
interface MatchTimeBlinksProps {
  dateTimeZone: string;
  timeTimeZone: string | JSX.Element;
  code: number;
  currentPeriodStartTimestamp: number;
  showTime: boolean;
}

const MatchTimeBlinks: React.FC<MatchTimeBlinksProps> = ({
  dateTimeZone,
  timeTimeZone,
  code,
  currentPeriodStartTimestamp,
  showTime,
}) => {
  const [currentTime, setCurrentTime] = useState<string | number>(
    calculateTime(code, currentPeriodStartTimestamp)
  );

  useEffect(() => {
    if (code > 0 && code < 60) {
      const intervalId = setInterval(() => {
        setCurrentTime((prevTime) =>
          calculateTime(code, currentPeriodStartTimestamp)
        );
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [code, currentPeriodStartTimestamp]);

  return (
    <div dir='ltr' className='space-x-1 text-xs font-normal'>
      {/* <span>{JSON.stringify(dateTimeZone)}</span> */}
      <span className='text-xs dark:text-dark-text'>{dateTimeZone}</span>
      <span className='text-dark-orange'>
        {currentTime === ''
          ? showTime && timeTimeZone !== '-' && timeTimeZone
          : currentTime}
      </span>
    </div>
  );
};

export default MatchTimeBlinks;
