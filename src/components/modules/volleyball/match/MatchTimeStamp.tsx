import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

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
  MatchStateVolleyball,
  formatMatchTimestampVolleyball,
  getFirstLetters,
  isMatchInprogressVlb,
} from '@/utils';

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
  addMore: (params: { id: string; minute: string }) => void
) => {
  const [dateTimeZone, setDateTimeZone] = useState(() => {
    const [dateStr] = formatMatchTimestampVolleyball(
      startTimestamp,
      status || {},
      false,
      currentPeriodStartTimestamp
    );
    return dateStr;
  });
  const [timeTimeZone, setTimeTimeZone] = useState(() => {
    const [, timeStr] = formatMatchTimestampVolleyball(
      startTimestamp,
      status || {},
      false,
      currentPeriodStartTimestamp || 0
    );
    return timeStr;
  });

  useEffect(() => {
    const updateTimestamps = () => {
      const [newDateStr, newTimeStr] = formatMatchTimestampVolleyball(
        startTimestamp,
        status,
        false,
        Number(currentPeriodStartTimestamp)
      );

      if (dateTimeZone !== newDateStr) setDateTimeZone(newDateStr);
      if (timeTimeZone !== newTimeStr) setTimeTimeZone(newTimeStr);
      addMore({ id, minute: newTimeStr });
    };
    if (Number(currentPeriodStartTimestamp) >= 0) {
      updateTimestamps();
      const intervalId = setInterval(updateTimestamps, 60000);
      return () => clearInterval(intervalId);
    }
  }, [sport, startTimestamp, currentPeriodStartTimestamp, status, id, addMore]);

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
  remainTime = -1,
  sport = SPORT.FOOTBALL,
}: IMatchTimestamp) => {
  const { addMore } = useMinuteMatchLiveStore();

  const { dateTimeZone, timeTimeZone } = useMatchTimestamp(
    startTimestamp,
    currentPeriodStartTimestamp,
    status,
    id,
    sport,
    addMore
  );
  
  const isInprogress = isMatchInprogressVlb(status.code);
  const isFinished = [MatchStateVolleyball.ENDED].includes(status.code);

  const renderTimeZone = (time: string): JSX.Element => {
    const timeArr =
      time && i18n && i18n.common[time as keyof typeof i18n.common]
        ? i18n.common[time as keyof typeof i18n.common]
        : time;

    return (
      <div className='flex items-center justify-center gap-1'>
        <span className={clsx('items-center text-center font-medium', {
          'font-medium text-minute dark:text-dark-green': isInprogress || isFinished
        })}>{timeArr}</span>
      </div>
    );
  };

  // sorted by league
  const renderTimestamp = useMemo(() => {
    return (
      <FirstCol className='px-1 md:px-2'>
        <TwTimeCol dir='ltr' className='flex h-full flex-col gap-1'>
          <span
            className='text-cms flex items-center space-x-2 font-normal text-black dark:text-white'
            test-id='date-match'
          >
            {dateTimeZone}
          </span>
          <span
            className={clsx(
              'w-full min-w-[2.6875rem] text-center text-csm font-normal',
              {
                'font-medium text-minute dark:text-dark-green': isInprogress || isFinished
              }
            )}
            test-id='time-match'
          >
            {renderTimeZone(timeTimeZone)}
          </span>
        </TwTimeCol>
      </FirstCol>
    );
  }, [dateTimeZone, isInprogress, status.type, timeTimeZone]);

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
          <TwTimeColByTime className='flex flex-wrap items-center justify-center gap-1'>
            <span
              className='block font-normal text-black dark:text-white'
              test-id='date-match'
            >
              {dateTimeZone}
            </span>
            <span className='block truncate text-center'>
              {renderTimeZone(timeTimeZone)}
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
    isInprogress,
    timeTimeZone,
    competition,
  ]);

  return type !== 'time' ? renderTimestamp : renderCompetitionCode;
};
export default MatchTimestamp;
