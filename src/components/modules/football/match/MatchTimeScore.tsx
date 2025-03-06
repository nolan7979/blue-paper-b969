import clsx from 'clsx';
import { memo, use, useEffect, useMemo, useRef, useState } from 'react';

import { useFootballTimeScore } from '@/hooks/useFootball/useFootballTimeScore';

import {
  IScore,
  MatchState,
  SportEventDto,
  StatusDto,
} from '@/constant/interface';
import { isMatchHaveStat, isMatchLive } from '@/utils';
import { cn } from '@/utils/tailwindUtils';

import vi from '~/lang/vi';
import Rectangle from '@/components/common/skeleton/Rectangle';

interface MatchTimeScore {
  homeScore: IScore;
  awayScore: IScore;
  status?: StatusDto;
  isScoreNotAvailable?: boolean;
  i18n: any;
  match: SportEventDto;
  isTimeThird?: boolean;
  currentPeriodStartTimestamp?: number;
  isSubPage?: boolean;
}

const MatchTimeScore: React.FC<MatchTimeScore> = memo(
  ({
    homeScore,
    awayScore,
    isScoreNotAvailable,
    i18n = vi,
    match,
    isTimeThird = false,
    currentPeriodStartTimestamp,
    status: statusLive,
    isSubPage = false,
  }) => {
    const homeScoreRef = useRef<number | undefined>(homeScore?.display);
    const awayScoreRef = useRef<number | undefined>(awayScore?.display);
    const [idMatch, setIdMatch] = useState<string | undefined>();
    const { id, startTimestamp, status } = match || {};

    const { first, second, third } = useFootballTimeScore(
      id,
      startTimestamp,
      statusLive || status,
      i18n,
      currentPeriodStartTimestamp || match?.time?.currentPeriodStartTimestamp
    );

    const { code } = statusLive || {};

    const renderScoreOfMatch = useMemo(() => {
      if (!homeScore || !awayScore) return '';
      const getScoreDisplay = (period: number) => {
        const periodKey = `period${period}` as keyof IScore;
        return `${homeScore[periodKey]}-${awayScore[periodKey]}`;
      };

      switch (code) {
        case MatchState.HalfTime:
        case MatchState.FirstHalf:
          return `(${getScoreDisplay(1)})`;
        case MatchState.SecondHalf:
        case MatchState.OverTime:
        case MatchState.PenaltyShootOut:
        case MatchState.End:
        case MatchState.AP:
        case MatchState.AET:
          return `(${getScoreDisplay(1)}, ${getScoreDisplay(2)})`;

        default:
          return '';
      }
    }, [code, homeScore, awayScore]);

    useEffect(() => {
      if (
        homeScoreRef.current === undefined ||
        awayScoreRef.current === undefined
      ) {
        homeScoreRef.current = homeScore?.display;
        awayScoreRef.current = awayScore?.display;
      }
    }, [homeScore?.display, awayScore?.display]);

    //Todo open this code when need effect score
    // useEffect(() => {
    //   const homeScoreDisplay = homeScore?.display;
    //   const awayScoreDisplay = awayScore?.display;
    //   if (idMatch !== id) {
    //     setIdMatch(id);
    //     return;
    //   }
    //   if (
    //     ((homeScoreRef.current !== undefined &&
    //       homeScoreRef.current !== homeScoreDisplay) ||
    //       (awayScoreRef.current !== undefined &&
    //         awayScoreRef.current !== awayScoreDisplay)) &&
    //     idMatch === id
    //   ) {
    //     homeScoreRef.current = homeScoreDisplay;
    //     awayScoreRef.current = awayScoreDisplay;
    //     const element = document.getElementById(`score-match-${id}`);
    //     const elementEffect = document.getElementById(`effect-score-${id}`);
    //     const audio = new Audio('/audio/goal.wav');

    //     if (element) {
    //       element.classList.add('hidden');
    //       elementEffect?.classList.remove('hidden');
    //       audio.play().catch((error) => {
    //         console.error('Failed to play audio:', error);
    //       });
    //       setTimeout(() => {
    //         element.classList.remove('hidden');
    //         elementEffect?.classList.add('hidden');
    //         audio.pause();
    //         audio.currentTime = 0;
    //       }, 4000);
    //     }
    //   }
    // }, [
    //   homeScore?.display,
    //   awayScore?.display,
    //   homeScoreRef.current,
    //   awayScoreRef.current,
    // ]);

    if (!homeScore || !awayScore || !status) {
      return (
        <div className='flex flex-col place-content-center items-center justify-start gap-1  lg:flex-1'>
          <div className='flex flex-1 flex-col place-content-center items-center gap-y-3'>
            <Rectangle classes='h-8 w-14' />
            <Rectangle classes='h-4 w-16 ' />
          </div>
        </div>
      );
    }
    return (
      <div className='flex flex-col place-content-center items-center justify-start gap-1  lg:flex-1'>
        <div className='flex flex-1 flex-col place-content-center items-center gap-y-1 font-oswald'>
          {/* <div className='flex place-content-center text-center text-xl font-bold'> */}
          <div
            test-id='time-score-match'
            className={cn('flex place-content-center text-center text-lg font-medium', {
              'text-white lg:text-dark-text dark:text-white ': !isSubPage,
              'dark:text-white text-dark-text': isSubPage,
            })}
          >
            {second}
          </div>
          <div
            test-id='status-score-match'
            className={cn(
              'relative bottom-1 flex  place-content-center text-center font-medium',
              status.type === 'inprogress' || isMatchHaveStat(status.code)
                ? 'font-semibold text-minute dark:text-dark-green'
                : 'lg:text-dark-text dark:lg:text-dark-draw',
              {
                'text-white lg:text-dark-text dark:text-dark-text': !isSubPage && !isMatchHaveStat(status.code),
                'text-dark-text': isSubPage,
              }
            )}
          >
            {first}
          </div>

          {!isMatchHaveStat(status.code) && (
            <div className='relative bottom-2 flex place-content-center text-center font-medium text-dark-text'>
              {third}
            </div>
          )}
        </div>
        {isMatchHaveStat(status.code) && (
          <>
            <div
              test-id='score-match'
              id={`score-match-${id}`}
              className='whitespace-nowrap rounded-lg border-2 border-match-score bg-dark-score px-3 py-0.5 font-oswald text-xl font-black text-match-score lg:rounded-xl lg:px-7 lg:py-1.5 lg:text-3xl'
            >
              {(homeScore as IScore).display} - {(awayScore as IScore).display}
            </div>
            <div
              id={`effect-score-${id}`}
              className='animate-blink hidden h-[52px] rounded-lg px-3 py-0.5 font-oswald text-xl lg:text-2xl'
            >
              <h2>{i18n.statsLabel.goals}</h2>
            </div>
            <div
              className='text-center text-csm text-white lg:text-black lg:dark:text-white'
              test-id='render-score-match'
            >
              {renderScoreOfMatch}
            </div>
          </>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.match?.id === nextProps.match?.id &&
      prevProps.homeScore === nextProps.homeScore &&
      prevProps.awayScore === nextProps.awayScore &&
      prevProps.isScoreNotAvailable === nextProps.isScoreNotAvailable &&
      prevProps?.status?.code === nextProps?.status?.code &&
      prevProps?.currentPeriodStartTimestamp ===
        nextProps?.currentPeriodStartTimestamp &&
      prevProps?.match?.time?.currentPeriodStartTimestamp ===
        nextProps?.match?.time?.currentPeriodStartTimestamp &&
      prevProps?.i18n === nextProps?.i18n &&
      prevProps?.isSubPage === nextProps?.isSubPage
    );
  }
);

MatchTimeScore.displayName = 'MatchTimeScore';

export default MatchTimeScore;
