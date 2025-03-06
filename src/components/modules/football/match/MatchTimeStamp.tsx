import clsx from 'clsx';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  FirstCol,
  FirstColByTime,
  TwTimeCol,
  TwTimeColByTime,
} from '@/components/modules/football/tw-components';

import { useMinuteMatchLiveStore } from '@/stores/minute-match-live';

import { SPORT } from '@/constant/common';
import { IStatusCode, TournamentDto } from '@/constant/interface';
import {
  formatMatchTimestamp,
  getFirstLetters,
  isMatchHaveStat,
  isMatchLive,
} from '@/utils';

import MatchTimeBlinks from './MatchTimeBlinks';

interface IMatchTimestamp {
  type: string;
  startTimestamp: number;
  status: any;
  id: string; // Changed from any to string
  currentPeriodStartTimestamp: number;
  remainTime?: number;
  competition: TournamentDto;
  // only for matchByTime
  showTime: boolean;
  i18n?: any;
  sport?: string;
}

const useMatchTimestamp = (
  startTimestamp: number,
  currentPeriodStartTimestamp: number,
  status: IStatusCode,
  id: string,
  sport: string,
  addMore: (params: { id: string; minute: string }) => void,
  type?: string
) => {
  if (!status || status && Object.keys(status).length === 0) {
  }
  
  const [dateTimeZone, setDateTimeZone] = useState(() => {
    const [dateStr] = formatMatchTimestamp(
      startTimestamp,
      status || {},
      false,
      currentPeriodStartTimestamp || 0
    );
    return dateStr ?? '';
  });

  const [timeTimeZone, setTimeTimeZone] = useState(() => {
    const [, timeStr] = formatMatchTimestamp(
      startTimestamp,
      status || {},
      false,
      currentPeriodStartTimestamp || 0
    );
    return timeStr ?? '';
  });

  const updateTimestamps = useCallback(() => {
    const [newDateStr, newTimeStr] = formatMatchTimestamp(
      startTimestamp,
      status,
      false,
      currentPeriodStartTimestamp
    );


    setDateTimeZone(prevDate => (prevDate !== newDateStr ? newDateStr : prevDate));
    setTimeTimeZone(prevTime => prevTime !== newTimeStr ? newTimeStr : prevTime);

    if (newTimeStr !== timeTimeZone) {
      // Schedule the addMore call for the next tick
      setTimeout(() => {
        addMore({ id, minute: newTimeStr });
      }, 0);
    }

  }, [startTimestamp, status?.code, currentPeriodStartTimestamp, id, addMore, timeTimeZone]);

  const intervalIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const periodStartTimestamp = Number(currentPeriodStartTimestamp);

    if (periodStartTimestamp >= 0 || isMatchLive(status?.code)) {
      updateTimestamps();
      const intervalId = setInterval(updateTimestamps, 6000);
      intervalIdRef.current = intervalId;
      return () => clearInterval(intervalId);
    }
  }, [currentPeriodStartTimestamp, status?.code, updateTimestamps]);

  return { dateTimeZone, timeTimeZone };
};

const MatchTimestamp = ({
  type,
  startTimestamp,
  status,
  id,
  currentPeriodStartTimestamp,
  competition,
  showTime,
  i18n,
  sport = SPORT.FOOTBALL,
}: IMatchTimestamp) => {
  if (!status || status && Object.keys(status).length === 0) {
  }
  const { addMore } = useMinuteMatchLiveStore();
  const { dateTimeZone, timeTimeZone } = useMatchTimestamp(
    startTimestamp,
    currentPeriodStartTimestamp,
    status,
    id,
    sport,
    addMore,
    type
  );

  const isInprogress = status?.type === 'inprogress' || isMatchLive(status?.code);

  const renderTimeZone = (time: string): JSX.Element => {
    const timeArr =
      time && i18n && i18n.common[time as keyof typeof i18n.common]
        ? i18n.common[time as keyof typeof i18n.common]
        : time;

    const isTimeFormat = (value: string): boolean => {
      return /^\d{1,2}:\d{2}$/.test(value);
    };
    // Check type of timeArr
    const shouldBlink = (): boolean => {
      if (
        timeArr == 'HT' ||
        timeArr == 'FT' ||
        timeArr == 'ET' ||
        timeArr == 'AET' ||
        timeArr == 'AP' ||
        timeArr == '-' ||
        timeArr == 'Postponed' ||
        timeArr == 'Cancelled' ||
        timeArr == 'Penalties' ||
        isTimeFormat(timeArr)
      )
        return false;
      return true;
    };
    if (timeArr === '-') {
      return <></>;
    }
    return (
      <div className={`flex items-center justify-center`}>
        {(isTimeFormat(timeArr) && (
          <span className={`items-center text-center`}>{timeArr}</span>
        )) || <span className='max-w-16 truncate'>{timeArr}</span>}
        {shouldBlink() && <span className='animate-blink'>'</span>}
      </div>
    );
  };

  // sorted by league
  const renderTimestamp = useMemo(() => {
    return (
      <FirstCol className='px-1 md:px-2'>
        <TwTimeCol dir='ltr' className='flex h-full flex-col gap-1'>
          <span
            className='text-cms font-normal text-black dark:text-white'
            test-id='date-match'
          >
            {dateTimeZone}
          </span>
          <span
            className={clsx(
              'w-full min-w-[2.6875rem] truncate text-center text-csm font-normal',
              status?.type === 'inprogress' || isMatchHaveStat(status?.code)
                ? 'font-medium text-minute dark:text-dark-green'
                : 'text-black dark:text-white'
            )}
            test-id='time-match'
          >
            {status?.code === 100 ? 'FT' : renderTimeZone(timeTimeZone)}
          </span>
        </TwTimeCol>
      </FirstCol>
    );
  }, [dateTimeZone, isInprogress, status?.code, timeTimeZone]);

  // sorted by time
  const renderCompetitionCode = useMemo(() => {
    return (
      <FirstColByTime>
        <div
          style={{
            backgroundColor:
              competition?.primary_color || competition?.secondary_color,
          }}
          className={clsx(
            'm-auto ml-0 w-full rounded-sm text-center uppercase text-white',
            {
              'bg-purple-800':
                !competition?.primary_color && !competition?.secondary_color,
              'dark:border-[0.5px] dark:border-dark-tickets': true,
            }
          )}
        >
          {competition?.code ||
            (competition?.name && getFirstLetters(competition.name))}
        </div>
        <FirstColByTime className='!p-0'>
          <TwTimeColByTime className='items-center justify-center'>
            <span className='truncate text-center'>
              <MatchTimeBlinks
                dateTimeZone={dateTimeZone}
                timeTimeZone={renderTimeZone(timeTimeZone)}
                code={status?.code || -1}
                currentPeriodStartTimestamp={currentPeriodStartTimestamp}
                showTime={showTime}
              />
            </span>
          </TwTimeColByTime>
        </FirstColByTime>
      </FirstColByTime>
    );
  }, [
    status,
    showTime,
    currentPeriodStartTimestamp,
    dateTimeZone,
    timeTimeZone,
    competition,
  ]);

  return type !== 'time' ? renderTimestamp : renderCompetitionCode;
};

export default memo(MatchTimestamp, (prevProps: IMatchTimestamp, nextProps: IMatchTimestamp) => {
  return (
    prevProps.type === nextProps.type &&
    prevProps.startTimestamp === nextProps.startTimestamp &&
    prevProps.status?.code === nextProps.status?.code &&
    prevProps.id === nextProps.id &&
    prevProps.currentPeriodStartTimestamp === nextProps.currentPeriodStartTimestamp &&
    prevProps.competition?.code === nextProps.competition?.code &&
    prevProps.competition?.name === nextProps.competition?.name &&
    prevProps.competition?.primary_color === nextProps.competition?.primary_color &&
    prevProps.competition?.secondary_color === nextProps.competition?.secondary_color &&
    prevProps.showTime === nextProps.showTime &&
    prevProps.sport === nextProps.sport
  );
});
