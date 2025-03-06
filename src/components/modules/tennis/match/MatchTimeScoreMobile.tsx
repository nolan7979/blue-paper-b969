import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

import {
  IScore,
  IStatusCode,
  MatchState,
  MatchStateTennis,
  SportEventDto,
  StatusDto,
} from '@/constant/interface';

import vi from '~/lang/vi';
import React from 'react';
import { formatMatchTimestampTennis } from '@/utils';
import { formatDateWithYear } from '@/utils/dateUtils';

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
  isMobile?: boolean;
}

const MatchTimeScoreMobile: React.FC<MatchTimeScore> = ({
  homeScore,
  awayScore,
  isScoreNotAvailable,
  i18n = vi,
  match,
  isTimeThird = false,
  currentPeriodStartTimestamp,
  status: statusLive,
  isFeaturedMatch,
  isMobile = false,
}) => {
  const { id, startTimestamp, status, time, scores } = match as any;
  const useMatchTimestamp = (
    startTimestamp: number,
    currentPeriodStartTimestamp: number,
    status: IStatusCode,
    id: string,
  ) => {
    const [dateTimeZone, setDateTimeZone] = useState(() => formatDateWithYear(startTimestamp));
    const [timeTimeZone, setTimeTimeZone] = useState(() => {
      const [, timeStr] = formatMatchTimestampTennis(
        startTimestamp,
        status || {},
        false,
        currentPeriodStartTimestamp || 0
      );
      return timeStr;
    });
  
    useEffect(() => {
      const updateTimestamps = () => {
        const [newDateStr, newTimeStr] = formatMatchTimestampTennis(
          startTimestamp,
          status,
          false,
          Number(currentPeriodStartTimestamp)
        );
  
        setDateTimeZone(formatDateWithYear(startTimestamp));
        setTimeTimeZone(newTimeStr);
      };
      if (Number(currentPeriodStartTimestamp) >= 0) {
        updateTimestamps();
        const intervalId = setInterval(updateTimestamps, 60000);
        return () => clearInterval(intervalId);
      }
    }, [startTimestamp, currentPeriodStartTimestamp, status, id]);
  
    return { dateTimeZone, timeTimeZone };
  };

  const { dateTimeZone, timeTimeZone } = useMatchTimestamp(
    startTimestamp,
    currentPeriodStartTimestamp || 0,
    status,
    id,
  );

  const { code } = statusLive || status;

  const renderRoundOfMatch = useMemo(() => {
    if (scores) {
      switch (code) {
        case MatchStateTennis.FirstSet:
          return `S1`;
        case MatchStateTennis.SecondSet:
          return `S2`;
        case MatchStateTennis.ThirdSet:
          return `S3`;
        case MatchStateTennis.FourthSet:
          return `S4`;
        case MatchStateTennis.FifthSet:
          return `S5`;
        case MatchStateTennis.Ended:
          return `FT`;
        case MatchStateTennis.Delayed:
          return `DELAYED`;
        case MatchStateTennis.Canceled:
          return `CANCELED`;
        case MatchStateTennis.NotStarted:
          return `NOT STARTED`;
        case MatchStateTennis.Suspension:
          return `SUSPENSION`;
        case MatchStateTennis.Walkover:
        case MatchStateTennis.Walkover1:
        case MatchStateTennis.Walkover2:
          return `WALKOVER`;
        case MatchStateTennis.Retired:
        case MatchStateTennis.Retired1:
        case MatchStateTennis.Retired2:
          return `RETIRED`;
        case MatchStateTennis.Postponed:
          return `POSTPONED`;
        case MatchStateTennis.Interrupted:
          return `INTERRUPTED`;
        case MatchStateTennis.Abandoned:
          return `ABNORMAL`;
        default:
          return ``;
      }
    }
    return ``;
  }, [code, scores, isFeaturedMatch]);
  

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

  const formatScore = (score: string) => (score === '' ? '0' : score);

  const renderTimeZone = (time: string): JSX.Element => {
    const timeArr =
      time && i18n && i18n.common[time as keyof typeof i18n.common]
        ? i18n.common[time as keyof typeof i18n.common]
        : time;
    const isTimeFormat = (value: string): boolean => {
      return /^\d{1,2}:\d{2}$/.test(value);
    };

    return (
      <div className={`flex items-center justify-center gap-1`}>
        {isTimeFormat(timeArr) && (
          <span className={`items-center text-center text-white`}>{timeArr} </span>
        )}
      </div>
    );
  };

  if (!scores) {
    return <></>;
  }
  return (
    <div className='flex flex-1 flex-col place-content-center items-center justify-start gap-2'>
      <div className='flex gap-1.5 justify-center align-middle text-center text-csm dark:text-white mb-2'>
        <span>{dateTimeZone}</span>
        <span>{renderTimeZone(timeTimeZone)}</span>
      </div>
    </div>
  );
};

export default MatchTimeScoreMobile;
