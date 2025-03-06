import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

import { IScore, SportEventDto, StatusDto } from '@/constant/interface';
import {
  formatTime,
  genDisplayedTimeVlb,
  isMatchEndedVlb,
  isMatchHaveStatVlb,
  isMatchInprogressVlb,
  MatchStateVolleyball,
} from '@/utils';

import vi from '~/lang/vi';

interface MatchTimeScore {
  status?: StatusDto;
  isScoreNotAvailable?: boolean;
  i18n: any;
  match: SportEventDto;
  isTimeThird?: boolean;
  currentPeriodStartTimestamp?: number;
  isClub?: boolean;
}

const MatchTimeScore: React.FC<MatchTimeScore> = ({
  isScoreNotAvailable = false,
  i18n = vi,
  match,
  currentPeriodStartTimestamp,
  status: statusLive,
  isClub,
}) => {
  const { startTimestamp, status, time, scores = {} } = match;
  const { remainTime } = time || {};

  const textStatusTime =
    genDisplayedTimeVlb(
      startTimestamp,
      status,
      i18n,
      currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp
    ) || [];

  const isInprogress = status.type === 'inprogress';
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

  const renderRoundOfMatch = useMemo(() => {
    if (scores) {
      switch (code) {
        case MatchStateVolleyball.FIRST_SET:
          return `S1`;
        case MatchStateVolleyball.SECOND_SET:
          return `S2`;
        case MatchStateVolleyball.THIRD_SET:
          return `S3`;
        case MatchStateVolleyball.FOURTH_SET:
          return `S4`;
        case MatchStateVolleyball.FIFTH_SET:
          return `S5`;
        case MatchStateVolleyball.ENDED:
          return `FT`;
        case MatchStateVolleyball.DELAYED:
          return `DELAYED`;
        case MatchStateVolleyball.CANCELED:
          return `CANCELED`;
        case MatchStateVolleyball.POSTPONED:
          return `POSTPONED`;
        case MatchStateVolleyball.INTERRUPTED:
          return `INTERRUPTED`;
        case MatchStateVolleyball.ABNORMAL:
          return `ABNORMAL`;
        default:
          return ``;
      }
    }
  }, [code, scores]);

  const getCurrScore = () => {
    const getKey = Object.keys(scores).filter(
      (key: string) => key !== 'ft' && key !== 'pt' && !key.includes('x')
    );
    if (getKey.length > 0) {
      return `${scores[`p${getKey.length}`][0]} - ${
        scores[`p${getKey.length}`][1]
      }`;
    }
    return '';
  };

  const formatScore = (score: string) => (score === '' ? '0' : score);

  const renderStatusMatch = useMemo(() => {
    if (scores) {
      switch (code) {
        case MatchStateVolleyball.NOT_STARTED:
          return `${textStatusTime[0]}`;
        case MatchStateVolleyball.ENDED:
        case MatchStateVolleyball.INTERRUPTED:
        case MatchStateVolleyball.CANCELED:
        case MatchStateVolleyball.CUT_IN_HALF:
        case MatchStateVolleyball.TO_BE_DETERMINED:
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
    <div className='flex flex-1 flex-col place-content-center items-center justify-center gap-2'>
      <div className='flex flex-1 flex-col place-content-center items-center gap-y-1 font-oswald'>
        {!isMatchHaveStatVlb(status.code) && (
          <>
            <div className='flex place-content-center text-center text-lg font-medium text-white lg:text-dark-text dark:text-white'>
              {textStatusTime[1]}
            </div>
            <div className='text-center text-white lg:text-dark-text dark:lg:text-dark-draw'>
              <div className='font-oswald'>{renderStatusMatch}</div>
              <div className='font-oswald'>{textStatusTime[2]}</div>
            </div>
          </>
        )}
        <div
          className={clsx(
            'flex place-content-center text-center font-medium',
            status.type === 'inprogress' ||
              isMatchInprogressVlb(status.code) ||
              isMatchEndedVlb(status.code)
              ? 'font-semibold text-dark-green dark:text-dark-green lg:text-minute'
              : ' text-dark-text lg:text-minute dark:lg:text-dark-text'
          )}
        >
          {isInprogress && formatTime(remainTimeShow)} {renderRoundOfMatch}
        </div>
      </div>
      {!isScoreNotAvailable && isMatchHaveStatVlb(status.code) && (
        <>
          <div
            className={`whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score ${
              isClub ? 'px-[10px]' : 'px-7'
            } py-1.5 font-oswald text-3xl font-black text-match-score dark:bg-transparent`}
          >
            {scores?.ft[0]} - {scores?.ft[1]}
          </div>
          <div className='text-center text-csm text-white lg:text-dark-text'>
            {getCurrScore()}{' '}
            {scores?.pt &&
              `(${formatScore(`${scores?.pt[0]}`)} - ${formatScore(
                `${scores?.pt[1]}`
              )})`}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchTimeScore;
