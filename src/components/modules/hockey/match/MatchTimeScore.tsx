import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { SportEventDto, StatusDto } from '@/constant/interface';
import {
  formatTime,
  genDisplayedTime,
  genDisplayedTimeHockey,
  isInProgessMatchHockey,
  isMatchesHaveScoreHockey,
  isMatchesPausedHockey,
} from '@/utils';

import { useMatchTimestampHockey } from '@/hooks/useHockey';
import { useMinuteMatchLiveStore } from '@/stores/minute-match-live';
import vi from '~/lang/vi';
import { useMatchStore } from '@/stores';

interface MatchTimeScore {
  homeScore: string | number;
  awayScore: string | number;
  status?: StatusDto;
  isScoreNotAvailable: boolean;
  i18n: any;
  match: SportEventDto;
  isTimeThird?: boolean;
  currentPeriodStartTimestamp?: number;
}

const MatchTimeScore: React.FC<MatchTimeScore> = ({
  homeScore,
  awayScore,
  isScoreNotAvailable,
  i18n = vi,
  match,
  isTimeThird = false,
  currentPeriodStartTimestamp,
}) => {
  const { addMore } = useMinuteMatchLiveStore();
  const { selectedRealTimeRemainTime } = useMatchStore();

  const { id, startTimestamp, status, timer } = match;
  const { remainTime = -1, runSeconds, countDown } = timer || {};

  const { dateTimeZone, timeTimeZone, timeSub } = useMatchTimestampHockey(
    startTimestamp,
    currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp,
    status,
    id,
    addMore
  );

  const textStatusTime =
    genDisplayedTimeHockey(
      startTimestamp,
      status,
      i18n,
      currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp
    ) || [];

  const isInprogress = status.type === 'inprogress';

  const [remainTimeShow, setRemainTimeShow] = useState<number>(0);

  useEffect(() => {
    setRemainTimeShow(selectedRealTimeRemainTime || remainTime);
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
  }, [
    remainTime,
    isInprogress,
    runSeconds,
    countDown,
    selectedRealTimeRemainTime,
  ]);

  return (
    <div className='flex flex-1 flex-col place-content-center items-center justify-start gap-2 font-oswald'>
      <div className='flex flex-1 flex-col place-content-center items-center gap-y-1'>
        {!isMatchesHaveScoreHockey(status.code) && (
          <>
            <div className='flex place-content-center text-center text-lg font-medium text-white lg:text-dark-text dark:text-white'>
              {textStatusTime[1]}
            </div>
            <div className='relative bottom-1 place-content-center text-center font-medium text-white lg:text-dark-text dark:lg:text-dark-draw'>
              <div className='font-oswald'>{textStatusTime[0]}</div>
              {textStatusTime[2] && (
                <div className='font-oswald'>{textStatusTime[2]}</div>
              )}
            </div>
          </>
        )}
        <div
          className={clsx(
            'flex place-content-center text-center font-medium',
            isInprogress || isMatchesHaveScoreHockey(status.code)
              ? ' text-dark-green lg:text-minute lg:dark:text-dark-green '
              : 'font-semibold text-dark-text'
          )}
        >
          {isInprogress || isMatchesHaveScoreHockey(status.code) && (
            <span className='flex gap-x-[1px]'>
              <span>{timeSub}</span>
              {remainTimeShow > 0 && !isMatchesPausedHockey(status.code) && (
                <span>-{formatTime(remainTimeShow)}</span>
              )}
            </span>
          )}
        </div>
        {isMatchesHaveScoreHockey(status.code) && (
          <div className='whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score px-7 py-1.5 font-oswald text-3xl font-black text-match-score dark:bg-transparent'>
            {homeScore} - {awayScore}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchTimeScore;
