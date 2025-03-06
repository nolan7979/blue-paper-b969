import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

import {
  FirstCol,
  FirstColByTime,
  TwTimeCol,
  TwTimeColByTime,
} from '@/components/modules/football/tw-components';

import { useMinuteMatchLiveStore } from '@/stores/minute-match-live';

import MatchTimeBlinks from '@/components/modules/hockey/match/MatchTimeBlinks';
import { TournamentDto } from '@/constant/interface';
import { useMatchTimestampHockey } from '@/hooks/useHockey';
import { useMatchStore } from '@/stores';
import {
  formatTime,
  getDateFromTimestamp,
  getFirstLetters,
  isInProgessMatchHockey
} from '@/utils';
import {
  isInProgessPausedMatchHockey,
  isMatchesHaveScoreHockey
} from '@/utils/hockeyUtils';
import { isSameDay } from 'date-fns';

interface IMatchTimestamp {
  type: string;
  startTimestamp: number;
  status: any;
  id: any;
  currentPeriodStartTimestamp: number;
  remainTime?: number;
  competition?: TournamentDto;
  // only for matchByTime
  showTime: boolean;
  i18n?: any;
  sport?: string;
  runSeconds?: number;
  countDown?: number;
  dateFilter?: Date;
}


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
  dateFilter,
}: IMatchTimestamp) => {
  const { addMore } = useMinuteMatchLiveStore();
  const { selectedMatch, setSelectedRealTimeRemainTime } = useMatchStore();
  //ToDo handle timeSub for hockey
  const { dateTimeZone, timeTimeZone, timeSub } = useMatchTimestampHockey(
    startTimestamp,
    currentPeriodStartTimestamp,
    status,
    id,
    addMore
  );

  const [remainTimeShow, setRemainTimeShow] = useState(remainTime);

  const { code } = status;
  const isInprogress = isInProgessMatchHockey(code);
  const isMatchesPausedHockey = isInProgessPausedMatchHockey(code);
  const matchDate = getDateFromTimestamp(startTimestamp);
  const currentDate = dateFilter ? new Date(dateFilter) : new Date();
  const isCurrentTime = isSameDay(matchDate, currentDate);

  useEffect(() => {
    if (remainTime > -1 && isInprogress && runSeconds === 1 && countDown === 1) {
      if (remainTimeShow <= 0) {
        setRemainTimeShow(remainTime);
      }
      const intervalId = setInterval(() => {
        setRemainTimeShow((prev) => (prev > -1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [remainTime, isInprogress, runSeconds, countDown]);

  useEffect(() => {
    if(selectedMatch == id) {
      setSelectedRealTimeRemainTime(remainTimeShow);
    }
  }, [selectedMatch, remainTimeShow])

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
        <TwTimeCol dir='ltr' className='flex h-full flex-col gap-1'>
          <span
            className='text-cms flex items-center space-x-2 font-normal text-black dark:text-white'
            test-id='date-match'
          >
            <span>{isInprogress ? timeSub : dateTimeZone}</span>
          </span>

          <div className='flex items-center justify-center space-x-0'>
            <span
              className={clsx(
                'w-full max-w-16 truncate text-center text-csm',
                `${isMatchesHaveScoreHockey(status.code)
                  ? 'text-minute dark:text-dark-green'
                  : 'dark:text-white'
                }`,
                { 'font-medium': isInprogress },
                { 'font-normal': !isInprogress }
              )}
              test-id='time-match'
            >
              {!isInprogress &&
                (!timeSub ? renderTimeZone(timeTimeZone) : timeSub)}
              {/* {isMatchesPausedHockey && (
                <span className='flex gap-x-[1px]'>
                  <span>{timeSub}</span>
                </span>
              )} */}
              {isInprogress && (
                <span className='flex gap-x-[1px]'>
                  {remainTimeShow > 0  && <span>{formatTime(remainTimeShow)}</span> || <span>Ended</span>}
                </span>
              )}
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
                timeSub={timeSub}
                isInprogress={isInprogress}
                remainTime={remainTimeShow}
                isCurrentTime={isCurrentTime}
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
    dateFilter,
  ]);

  return type !== 'time' ? renderTimestamp : renderCompetitionCode;
};
export default MatchTimestamp;
