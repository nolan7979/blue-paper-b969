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
  MatchStateTennis,
  TournamentDto,
} from '@/constant/interface';
import { formatMatchTimestampTennis, getFirstLetters, isMatchInprogressTennis, renderRoundOfMatchTennis } from '@/utils';

import MatchTimeBlinks from './MatchTimeBlinks';
import { SPORT } from '@/constant/common';

interface IMatchTimestamp {
  type: string;
  startTimestamp: number;
  status: any;
  id: any;
  currentPeriodStartTimestamp: number;
  competition: TournamentDto;
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
    const [dateStr] = formatMatchTimestampTennis(
      startTimestamp,
      status || {},
      false,
      currentPeriodStartTimestamp
    );
    return dateStr;
  });
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
  const isFinished = [MatchStateTennis.Ended].includes(status?.code);
  const isCanceled = [MatchStateTennis.Canceled].includes(status?.code);
  const isInprogress = isMatchInprogressTennis(status?.code)
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
        {!isFinished && status.code != 1 && (
          <span className={`items-center text-center text-minute dark:text-dark-green capitalize`}>{renderRoundOfMatchTennis(status?.code)}</span>
        )}
        {!isFinished && status.code == 1 && (
          <span className={`items-center text-center text-white capitalize`}>{timeArr} </span>
        )}
        {isFinished && (
          <span className='pl-0 text-center text-minute dark:text-dark-green'>FT</span>
        )}
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
              'w-full min-w-[2.6875rem] text-center text-csm font-normal capitalize',
              InProgressStatesTennis.includes(status?.code)
                ? 'font-medium text-minute dark:text-dark-green'
                : 'text-black dark:text-white'
            )}
            test-id='time-match'
          >
            {isInprogress ? <TextGreen text={renderRoundOfMatchTennis(status?.code)}></TextGreen> : renderTimeZone(timeTimeZone)}
            {/* {isCanceled && <TextGreen text={renderRoundOfMatchTennis(status?.code)}></TextGreen>} */}
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

const TextGreen = ({ text }: { text: string }) => <span className='font-medium text-minute dark:text-dark-green block truncate capitalize'>{text}</span>
