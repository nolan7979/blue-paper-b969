import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { SportEventDto, StatusDto } from '@/constant/interface';
import { formatTime } from '@/utils';

import vi from '~/lang/vi';
import {
  checkEndedAMfootball,
  checkInProgressMatchAMFootball,
  formatMatchTimestampAMFootball,
  formatTimeAMFootball,
  genDisplayedTimeAMFootball,
  isMatchHaveStatAMFootball,
  isMatchInprogressAMFootball,
  otherStatusMatchAMFootball,
} from '@/utils/americanFootballUtils';

interface MatchTimeScore {
  scores: any;
  status?: StatusDto;
  isScoreNotAvailable: boolean;
  i18n: any;
  match: SportEventDto;
  isTimeThird?: boolean;
  currentPeriodStartTimestamp?: number;
  isClub?: boolean;
}

const MatchTimeScore: React.FC<MatchTimeScore> = ({
  scores,
  isScoreNotAvailable,
  i18n = vi,
  match,
  isTimeThird = false,
  currentPeriodStartTimestamp,
  status: statusLive,
  isClub,
}) => {
  const { id, startTimestamp, status, time } = match;
  const { remainTime } = time || {};

  const [, otherStatus] = formatMatchTimestampAMFootball(
    match.startTimestamp,
    match.status?.code
  );

  const isInprogress = isMatchInprogressAMFootball(status?.code);
  const isEndMatch = checkEndedAMfootball(status?.code);

  const [remainTimeShow, setRemainTimeShow] = useState<any>(0);

  const textStatusTime =
    genDisplayedTimeAMFootball(
      startTimestamp,
      status,
      i18n,
      currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp
    ) || [];

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
      return formatTimeAMFootball(code);
    }
  }, [code, scores]);

  if (!scores) {
    return <></>;
  }
  return (
    <div className='flex flex-1 flex-col place-content-center items-center justify-start gap-2 font-oswald'>
      <div className='flex flex-1 flex-col place-content-center items-center gap-y-1'>
        {!isMatchHaveStatAMFootball(status?.code) && (
          <>
            <div className='flex place-content-center text-center text-lg font-medium text-white lg:text-dark-text dark:text-white'>
              {textStatusTime[1]}
            </div>
            <div className='relative bottom-1 place-content-center text-center font-medium text-white lg:text-dark-text dark:lg:text-dark-draw'>
              <div className='font-oswald'>{textStatusTime[0]}</div>
              {textStatusTime[2] && <div className='font-oswald'>{textStatusTime[2]}</div>}
            </div>
          </>
        )}
      </div>
      <div
        className={clsx(
          'flex place-content-center text-center  font-medium',
          checkInProgressMatchAMFootball(status?.code) ||
            isMatchHaveStatAMFootball(status?.code)
            ? 'font-semibold text-minute lg:dark:text-dark-green '
            : 'text-black dark:text-white'
        )}
      >
        {isEndMatch && 'FT'}
        {isInprogress && renderRoundOfMatch}
        {!isEndMatch &&
          !isInprogress &&
          otherStatusMatchAMFootball(status?.code) &&
          otherStatus}
      </div>

      {!isScoreNotAvailable && isMatchHaveStatAMFootball(status?.code) && (
        <>
          <div
            className={`whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score ${
              isClub ? 'px-[10px]' : 'px-7'
            } py-1.5 font-oswald ${
              isClub ? 'text-xl' : 'text-3xl'
            } font-black text-match-score dark:bg-transparent`}
          >
            {scores?.ot?.[0] || scores?.ft[0]} -{' '}
            {scores?.ot?.[1] || scores?.ft[1]}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchTimeScore;
