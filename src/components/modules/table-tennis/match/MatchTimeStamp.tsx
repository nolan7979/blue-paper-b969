import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

import {
  FirstCol,
  FirstColByTime,
  TwTimeCol,
  TwTimeColByTime,
} from '@/components/modules/football/tw-components';

import { useMinuteMatchLiveStore } from '@/stores/minute-match-live';

import {
  InProgressStatesTennis,
  IStatusCode,
  TournamentDto
} from '@/constant/interface';
import { getDateFromTimestamp, getFirstLetters, isMatchInprogressTennis } from '@/utils';

import { checkInProgessMatch, formatMatchTimestampTableTennis, formatTime_sub, getCurrentRound, isMatchEndTableTennis, MatchStatusTableTennis } from '@/utils/tableTennisUtils';
import MatchTimeBlinks from './MatchTimeBlinks';
import { format, isSameDay } from 'date-fns';

interface IMatchTimestamp {
  type: string;
  startTimestamp: number;
  status: any;
  id: any;
  currentPeriodStartTimestamp: number;
  competition?: TournamentDto;
  // only for matchByTime
  showTime: boolean;
  i18n?: any;
}

const useMatchTimestamp = (
  startTimestamp: number,
  currentPeriodStartTimestamp: number,
  status: IStatusCode,
  id: string,
  addMore: (params: { id: string; minute: string }) => void
) => {

  const [dateTimeZone, setDateTimeZone] = useState(() => {
    const [dateStr] = formatMatchTimestampTableTennis(
      startTimestamp,
      status || {},
      false,
      currentPeriodStartTimestamp
    );
    return dateStr;
  });
  const [timeTimeZone, setTimeTimeZone] = useState(() => {
    const [, timeStr] = formatMatchTimestampTableTennis(
      startTimestamp,
      status || {},
      false,
      currentPeriodStartTimestamp || 0
    );
    return timeStr;
  });

  useEffect(() => {
    const updateTimestamps = () => {
      const [newDateStr, newTimeStr] = formatMatchTimestampTableTennis(
        startTimestamp,
        status,
        false,
        Number(currentPeriodStartTimestamp)
      );

      setDateTimeZone(newDateStr);
      setTimeTimeZone(newTimeStr);
      addMore({ id, minute: newTimeStr });
    };
    if (Number(currentPeriodStartTimestamp) >= 0) {
      updateTimestamps();
      const intervalId = setInterval(updateTimestamps, 60000);
      return () => clearInterval(intervalId);
    }
  }, [startTimestamp, currentPeriodStartTimestamp, status, id, addMore]);

  return { dateTimeZone, timeTimeZone };
};

export const MatchTimeStamp = ({
  type,
  startTimestamp,
  status,
  id,
  currentPeriodStartTimestamp,
  competition,
  showTime,
  i18n,
}: IMatchTimestamp) => {
  const { addMore } = useMinuteMatchLiveStore();

  const { dateTimeZone, timeTimeZone } = useMatchTimestamp(
    startTimestamp,
    currentPeriodStartTimestamp,
    status,
    id,
    addMore
  );
  const today = new Date();
  
  const formattedTime = format(getDateFromTimestamp(startTimestamp), 'HH:mm');
  const isToday = isSameDay(today, getDateFromTimestamp(startTimestamp));
  const isInprogress = isMatchInprogressTennis(status?.code)

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
              'w-full min-w-[2.6875rem] truncate text-center text-csm font-normal capitalize',
              checkInProgessMatch(status?.code) || isMatchEndTableTennis(status?.code)
                ? 'font-medium text-minute dark:text-dark-green'
                : 'text-black dark:text-white'
            )}
            test-id='time-match'
          >
            {isInprogress ? (
              <TextGreen text={formatTime_sub(status?.code)}></TextGreen>
            ) : (
              timeTimeZone
            )}
          </span>
        </TwTimeCol>
      </FirstCol>
    );
  }, [dateTimeZone, status?.type, timeTimeZone]);

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
                dateTimeZone={!isToday ? dateTimeZone : ''}
                timeTimeZone={isInprogress ? <TextGreen text={formatTime_sub(status?.code)}></TextGreen> : timeTimeZone || formattedTime}
                isInprogress={isInprogress}
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

const TextGreen = ({ text }: { text: string }) => <span className='font-medium text-minute dark:text-dark-green block truncate capitalize'>{text}</span>
