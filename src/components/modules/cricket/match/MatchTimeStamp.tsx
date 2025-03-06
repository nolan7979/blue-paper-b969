import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  FirstCol,
  FirstColByTime,
  TwTimeCol,
  TwTimeColByTime,
} from '@/components/modules/cricket/tw-components';

import { useMinuteMatchLiveStore } from '@/stores/minute-match-live';

import { SPORT } from '@/constant/common';
import { IStatusCode, TournamentDto } from '@/constant/interface';
import { getFirstLetters, isMatchHaveStat } from '@/utils';

import MatchTimeBlinks from './MatchTimeBlinks';
import { checkMatchStatus, formatMatchTimestamp } from '@/utils/cricketUtils';

interface IMatchTimestamp {
  type: string;
  startTimestamp: number;
  status: any;
  id: any;
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
  const [dateTimeZone, setDateTimeZone] = useState(() => {
    const [dateStr] = formatMatchTimestamp(startTimestamp, status?.code ?? 1);

    return dateStr;
  });
  const [timeTimeZone, setTimeTimeZone] = useState(() => {
    const [, timeStr] = formatMatchTimestamp(startTimestamp, status?.code ?? 1);
    return timeStr;
  });
  const updateTimestamps = useCallback(() => {
    const [newDateStr, newTimeStr] = formatMatchTimestamp(
      startTimestamp,
      status?.code ?? 1
    );

    if (newDateStr !== dateTimeZone) setDateTimeZone(newDateStr);
    if (timeTimeZone !== newTimeStr) setTimeTimeZone(newTimeStr);
  }, [startTimestamp, status, dateTimeZone, timeTimeZone]);

  useEffect(() => {
    updateTimestamps();
  }, [sport, startTimestamp, status, id]);

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
  sport = SPORT.CRICKET,
}: IMatchTimestamp) => {
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


  const renderTimeZone = (time: string): JSX.Element => {
    const timeArr =
      time && i18n && i18n.common[time as keyof typeof i18n.common]
        ? i18n.common[time as keyof typeof i18n.common]
        : time;

    const isTimeFormat = (value: string): boolean => {
      return /^\d{1,2}:\d{2}$/.test(value);
    };
    
    if (timeArr === '-') {
      return <></>;
    }
    return (
      <div className={`flex items-center justify-center`}>
        {(isTimeFormat(timeArr) && (
          <span className={`items-center text-center`}>{timeArr}</span>
        )) || <span className='max-w-16 truncate'>{timeArr}</span>}
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
              status.type === 'inprogress' || !checkMatchStatus(status.code)
                ? 'font-medium text-minute dark:text-dark-green'
                : 'text-black dark:text-white'
            )}
            test-id='time-match'
          >
            {renderTimeZone(timeTimeZone)}
          </span>
        </TwTimeCol>
      </FirstCol>
    );
  }, [dateTimeZone, status.type, status.code, timeTimeZone]);

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
                code={status.code || -1}
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
export default MatchTimestamp;
