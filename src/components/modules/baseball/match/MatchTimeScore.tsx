import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

import { SportEventDto, StatusDto } from '@/constant/interface';
import { formatTime } from '@/utils';

import vi from '~/lang/vi';
import {
  genDisplayedTimeBB,
  isMatchHaveStatBB,
  isMatchInprogressBB,
  MatchBaseballState,
  renderStatusMatchBaseball,
} from '@/utils/baseballUtils';
import { useMatchTimestamp } from '@/components/modules/baseball/match/MatchTimeStamp';
import { useMinuteMatchLiveStore } from '@/stores/minute-match-live';

interface MatchTimeScore {
  status?: StatusDto;
  isScoreNotAvailable: boolean;
  i18n: any;
  match: SportEventDto;
  isTimeThird?: boolean;
  currentPeriodStartTimestamp?: number;
  isClub?: boolean;
}

const MatchTimeScore: React.FC<MatchTimeScore> = ({
  isScoreNotAvailable,
  i18n = vi,
  match,
  currentPeriodStartTimestamp,
  status: statusLive,
  isClub,
}) => {
  const { id, startTimestamp, status, time, scores = {} } = match;
  const { remainTime } = time || {};
  const { addMore } = useMinuteMatchLiveStore();

  const { dateTimeZone, timeTimeZone } = useMatchTimestamp(
    startTimestamp,
    currentPeriodStartTimestamp,
    status,
    id,
    'baseball',
    addMore
  );

  const textStatusTime =
    genDisplayedTimeBB(
      startTimestamp,
      status,
      i18n,
      currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp
    ) || [];

  const isInprogress = isMatchInprogressBB(status.code);
  const [remainTimeShow, setRemainTimeShow] = useState<any>(0);

  useEffect(() => {
    setRemainTimeShow(remainTime);
    if (isInprogress) {
      if (remainTime > -1) {
        const intervalId = setInterval(() => {
          setRemainTimeShow((prev: any) => (prev > -1 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(intervalId);
      }
    }
  }, [match, isInprogress]);

  const { code } = statusLive || status;

  const isMatchPending = (code: number) => {
    return [MatchBaseballState.NOT_STARTED].includes(code);
  };

  const renderStatusMatch = useMemo(() => {
    if (scores) {
      switch (code) {
        case MatchBaseballState.NOT_STARTED:
          return `${textStatusTime[0]}`;
        case MatchBaseballState.ENDED:
        case MatchBaseballState.INTERRUPTED:
        case MatchBaseballState.CANCELED:
        case MatchBaseballState.CUT_IN_HALF:
          return `${textStatusTime[0]}`;
        default:
          return '';
      }
    }
  }, [code, scores]);

  if (!scores) {
    return <></>;
  }
  return (
    <div className='flex flex-1 flex-col place-content-center items-center justify-start gap-2'>
      <div className='flex flex-1 flex-col place-content-center items-center gap-y-1 font-oswald'>
        {!isMatchHaveStatBB(status.code) && (
          <>
            <div className='flex place-content-center text-center text-lg font-medium text-white lg:text-dark-text dark:text-white'>
              {textStatusTime[1]}
            </div>
            <div className='relative bottom-1 place-content-center text-center font-medium text-white lg:text-dark-text dark:lg:text-dark-draw'>
              <div className='font-oswald'>{renderStatusMatch}</div>
              {textStatusTime[2] && (
                <div className='font-oswald'>{textStatusTime[2]}</div>
              )}
            </div>
          </>
        )}
        <div
          className={clsx(
            'flex place-content-center text-center  font-medium',
            status.type === 'inprogress'
              ? 'font-semibold text-dark-orange'
              : 'text-minute dark:text-dark-green'
          )}
        >
          {!isMatchPending(status?.code) &&
            renderStatusMatchBaseball(timeTimeZone, i18n, status)}
        </div>
      </div>
      {!isScoreNotAvailable && isMatchHaveStatBB(status.code) && (
        <>
          <div
            className={`whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score ${
              isClub ? 'px-[10px]' : 'px-7'
            } py-1.5 font-oswald text-3xl font-black text-match-score dark:bg-transparent`}
          >
            {scores?.ft[0]} - {scores?.ft[1]}
          </div>
          <div className='text-center text-csm dark:text-white'>
            {/* {getCurrScore()}{' '}
            {scores?.pt &&
              `(${formatScore(`${scores?.pt[0]}`)} - ${formatScore(`${scores?.pt[1]}`)})`} */}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchTimeScore;
