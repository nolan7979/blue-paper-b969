import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

import {
  FirstCol,
  FirstColByTime,
  TwTimeCol,
  TwTimeColByTime,
} from '@/components/modules/football/tw-components';

import { useMinuteMatchLiveStore } from '@/stores/minute-match-live';

import MatchTimeBlinks from '@/components/modules/basketball/match/MatchTimeBlinks';
import { IStatusCode, TournamentDto } from '@/constant/interface';
import {
  MatchStateBasketBall,
  formatBkbMatchTimestamp,
  formatTime,
  getFirstLetters,
  isMatchHaveStatBkb,
  isMatchInprogressBkb,
  isMatchesEndedBkb,
} from '@/utils';
import { useMatchStore } from '@/stores';
import { format } from 'date-fns';

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
  runSeconds?: number;
  countDown?: number;
}

const useMatchTimestamp = (
  startTimestamp: number,
  currentPeriodStartTimestamp: number,
  status: IStatusCode,
  id: string,
  addMore: (params: { id: string; minute: string }) => void
) => {
  const [dateTimeZone, setDateTimeZone] = useState(() => {
    const [dateStr] = formatBkbMatchTimestamp(
      startTimestamp,
      status,
      false,
      currentPeriodStartTimestamp
    );
    return dateStr;
  });
  const [timeTimeZone, setTimeTimeZone] = useState(() => {
    const [, timeStr] = formatBkbMatchTimestamp(
      startTimestamp,
      status || {},
      false,
      currentPeriodStartTimestamp || 0
    );
    return timeStr;
  });
  useEffect(() => {
    const updateTimestamps = () => {
      const [newDateStr, newTimeStr] = formatBkbMatchTimestamp(
        startTimestamp,
        status,
        false,
        Number(currentPeriodStartTimestamp)
      );

      if (newDateStr !== dateTimeZone) setDateTimeZone(newDateStr);
      if (timeTimeZone !== newTimeStr) setTimeTimeZone(newTimeStr);
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
  runSeconds,
  countDown,
}: IMatchTimestamp) => {
  const { addMore } = useMinuteMatchLiveStore();
  const { selectedMatch, setSelectedRealTimeRemainTime } = useMatchStore();

  const { dateTimeZone, timeTimeZone } = useMatchTimestamp(
    startTimestamp,
    currentPeriodStartTimestamp,
    status,
    id,
    addMore
  );

  const isInprogress = isMatchInprogressBkb(status?.code);
  const [remainTimeShow, setRemainTimeShow] = useState(remainTime);
  const { code } = status;
  const date = new Date(startTimestamp * 1000);
  const formattedTime = format(date, 'HH:mm');
  useEffect(() => {
    if (
      remainTime > -1 &&
      isInprogress &&
      runSeconds === 1 &&
      countDown === 1
    ) {
      const intervalId = setInterval(() => {
        setRemainTimeShow((prev) => (prev > -1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [remainTime, isInprogress]);

  useEffect(() => {
    if (selectedMatch == id) {
      setSelectedRealTimeRemainTime(remainTimeShow);
    }
  }, [selectedMatch, remainTimeShow]);

  const renderTimeZone = (time: string): JSX.Element => {
    const timeArr =
      time && i18n && i18n.common[time as keyof typeof i18n.common]
        ? i18n.common[time as keyof typeof i18n.common]
        : time;

    const isTimeFormat = (value: string): boolean => {
      return /^\d{1,2}:\d{2}$/.test(value);
    };

    return (
      <div className={`flex items-center justify-center`}>
        {(isTimeFormat(timeArr) && remainTime > 0 && (
          <span className={`items-center text-center`}>{timeArr}</span>
        )) || <span className='max-w-16 truncate'>{timeArr}</span>}
      </div>
    );
  };

  // sorted by league
  const renderTimestamp = useMemo(() => {
    return (
      <FirstCol className='px-1 md:px-2'>
        <div className='hidden' test-id={`time-match-${id}`}>{formattedTime}</div>
        <TwTimeCol dir='ltr' className='flex h-full flex-col gap-1'>
          <span
            className='text-cms flex items-center space-x-2 font-normal text-black dark:text-white'
            test-id='date-match'
          >
            <span>{dateTimeZone}</span>
          </span>

          <div className='flex items-center justify-center space-x-0'>
            <span
              className={clsx(
                'w-full min-w-[2.6875rem] truncate text-center text-csm font-normal',
                status.type === 'inprogress' || isMatchHaveStatBkb(code)
                  ? 'font-medium text-minute dark:text-dark-green'
                  : 'text-black dark:text-white'
              )}
              test-id='time-match'
            >
              {!isInprogress && renderTimeZone(timeTimeZone)}
              {isInprogress && formatTime(remainTimeShow)}
            </span>
          </div>
        </TwTimeCol>
      </FirstCol>
    );
  }, [dateTimeZone, isInprogress, remainTimeShow, status.type, timeTimeZone]);

  // sorted by time
  const renderCompetitionCode = useMemo(() => {
    return (
      <FirstColByTime>
        <div className='hidden' test-id={`time-match-${id}`}>{formattedTime}</div>
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
                isInprogress={isInprogress}
                remainTime={isInprogress ? remainTimeShow : -1}
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
    remainTimeShow,
    isInprogress,
    timeTimeZone,
    competition,
  ]);

  return type !== 'time' ? renderTimestamp : renderCompetitionCode;
};
export default MatchTimestamp;
