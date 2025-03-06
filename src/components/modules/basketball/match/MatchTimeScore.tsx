import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

import { IScore, SportEventDto, StatusDto } from '@/constant/interface';
import {
  formatTime,
  genDisplayedTimeBkb,
  isMatchHaveStatBkb,
  isMatchInprogressBkb,
  MatchStateBasketBall,
} from '@/utils';

import vi from '~/lang/vi';
import { useMatchStore } from '@/stores';

interface MatchTimeScore {
  homeScore: IScore;
  awayScore: IScore;
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
  status: statusLive,
}) => {
  const { id, startTimestamp, status, time } = match;
  const { remainTime, runSeconds, countDown } = time || {};

  const { selectedRealTimeRemainTime } = useMatchStore();

  const isInprogress = isMatchInprogressBkb(status?.code);
  const [remainTimeShow, setRemainTimeShow] = useState<any>(0);

  const textStatusTime =
    genDisplayedTimeBkb(
      startTimestamp,
      status,
      i18n,
      currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp
    ) || [];

  useEffect(() => {
    setRemainTimeShow(selectedRealTimeRemainTime || remainTime);
    if (
      remainTime > -1 &&
      isInprogress &&
      runSeconds === 1 &&
      countDown === 1
    ) {
      const intervalId = setInterval(() => {
        setRemainTimeShow((prev: any) => (prev > -1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [match, isInprogress, selectedRealTimeRemainTime, runSeconds, countDown]);

  const { code } = statusLive || status;

  const renderRoundOfMatch = useMemo(() => {
    if (homeScore && awayScore) {
      switch (code) {
        case MatchStateBasketBall.FirstHalf:
          return `Q1`;
        case MatchStateBasketBall.FirstHalfOver:
          return `Q1 Ended`;
        case MatchStateBasketBall.SecondHalf:
          return `Q2`;
        case MatchStateBasketBall.SecondHalfOver:
          return `Q2 Ended`;
        case MatchStateBasketBall.ThirdHalf:
          return `Q3`;
        case MatchStateBasketBall.ThirdHalfOver:
          return `Q3 Ended`;
        case MatchStateBasketBall.FourHalf:
          return `Q4`;
        case MatchStateBasketBall.OverTime:
          return `OT`;
        case MatchStateBasketBall.ToBeDetermined:
          return 'Pending';
        case MatchStateBasketBall.Extension:
          return 'Extension';
        case MatchStateBasketBall.Interrupted:
          return 'Interrupted';
        case MatchStateBasketBall.Cancelled:
          return 'Canceled';
        case MatchStateBasketBall.Ended:
        case MatchStateBasketBall.CutInHalf:
          return `FT`;
        default:
          return '';
      }
    }
  }, [code, homeScore, awayScore]);

  const renderStatusMatch = useMemo(() => {
    if (homeScore && awayScore) {
      switch (code) {
        case MatchStateBasketBall.NotStarted:
          return `${textStatusTime[0]}`;
        case MatchStateBasketBall.Ended:
        case MatchStateBasketBall.Interrupted:
        case MatchStateBasketBall.Cancelled:
        case MatchStateBasketBall.Extension:
        case MatchStateBasketBall.CutInHalf:
        case MatchStateBasketBall.ToBeDetermined:
          return `${textStatusTime[0]}`;
        default:
          return '';
      }
    }
  }, [code, homeScore, awayScore, textStatusTime]);

  const renderScoreOfMatch = useMemo(() => {
    if (homeScore && awayScore) {
      switch (code) {
        case MatchStateBasketBall.FirstHalf:
        case MatchStateBasketBall.FirstHalfOver:
          return `(${(homeScore as IScore)?.period1}-${
            (awayScore as IScore)?.period1
          })`;
        case MatchStateBasketBall.SecondHalf:
        case MatchStateBasketBall.SecondHalfOver:
          return `(${homeScore?.period1}-${awayScore?.period1}, ${homeScore?.period2}-${awayScore?.period2})`;
        case MatchStateBasketBall.ThirdHalf:
        case MatchStateBasketBall.ThirdHalfOver:
          return `(${homeScore?.period1}-${awayScore?.period1}, ${homeScore?.period2}-${awayScore?.period2}, ${homeScore?.period3}-${awayScore?.period3})`;
        case MatchStateBasketBall.FourHalf:
        case MatchStateBasketBall.OverTime:
        case MatchStateBasketBall.Ended:
        case MatchStateBasketBall.Interrupted:
        case MatchStateBasketBall.Cancelled:
        case MatchStateBasketBall.Extension:
        case MatchStateBasketBall.CutInHalf:
        case MatchStateBasketBall.ToBeDetermined:
          return `(${homeScore?.period1}-${awayScore?.period1}, ${homeScore?.period2}-${awayScore?.period2}, ${homeScore?.period3}-${awayScore?.period3}, ${homeScore?.period4}-${awayScore?.period4})`;
        default:
          return '';
      }
    }
  }, [code, homeScore, awayScore]);

  if (!awayScore && !homeScore) {
    return <></>;
  }
  return (
    <div
      className='flex flex-1 flex-col place-content-center items-center justify-start gap-2'
      test-id='match-score-basketball'
    >
      <div className='flex flex-1 flex-col place-content-center items-center gap-y-1 font-oswald'>
        {!isMatchHaveStatBkb(status.code) && (
          <>
            <div className='flex place-content-center text-center text-lg font-medium text-white lg:text-dark-text dark:text-white'>
              {textStatusTime[1]}
            </div>
            <div
              className='relative bottom-1 flex place-content-center text-center font-medium text-white lg:text-dark-text dark:lg:text-dark-draw'
              test-id='render-status-match'
            >
              {renderStatusMatch}
            </div>
            {textStatusTime[2] && (
              <div
                className='relative bottom-2 flex place-content-center text-center font-medium text-white lg:text-dark-text dark:lg:text-dark-draw'
                test-id='render-status-match'
              >
                {textStatusTime[2]}
              </div>
            )}
          </>
        )}
      </div>
      <div
        test-id='status-match-basketball'
        className={clsx(
          'flex place-content-center text-center  font-medium',
          status.type === 'inprogress'
            ? 'font-semibold text-dark-orange'
            : ' text-dark-green lg:text-dark-dark-blue lg:dark:text-dark-green '
        )}
      >
        {isInprogress && formatTime(remainTimeShow)} {renderRoundOfMatch}
      </div>
      {!isScoreNotAvailable && isMatchHaveStatBkb(status.code) && (
        <>
          <div
            className='whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score px-7 py-1.5 font-oswald text-3xl font-black text-match-score dark:bg-transparent'
            test-id='match-score'
          >
            {(homeScore as IScore).display} - {(awayScore as IScore).display}
          </div>
          {/* <div
            className='text-center text-csm text-black dark:text-white lg:text-dark-text'
            test-id='detail-score-basketball'
          >
            {renderScoreOfMatch}
          </div> */}
        </>
      )}
    </div>
  );
};

export default MatchTimeScore;
