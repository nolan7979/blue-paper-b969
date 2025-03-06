import { useCallback, useMemo } from 'react';

import {
  IScore,
  MatchState,
  SportEventDto,
  StatusDto,
} from '@/constant/interface';

import vi from '~/lang/vi';
import {
  checkEnded,
  formatMatchTimestampCricket,
  genDisplayedTimeCricket,
  inningStates,
  inningStatesDetail,
  isMatchNotStartedCricket,
  matchStatesDetail,
} from '@/utils/cricketUtils';

interface MatchTimeScore {
  status?: StatusDto;
  i18n: any;
  match: SportEventDto;
  isClub?: boolean;
  currentPeriodStartTimestamp?: number;
}

const MatchTimeScore: React.FC<MatchTimeScore> = ({
  i18n = vi,
  match,
  status: statusLive,
  isClub,
  currentPeriodStartTimestamp,
}) => {
  const {
    homeScore = {},
    awayScore = {},
    scores = {},
    status = { code: 1 },
    extraScores = {},
  } = match;

  const { code = 1 } = statusLive || status;

  const label = useMemo(() => {
    return (
      matchStatesDetail[code] ||
      inningStates[code] ||
      inningStatesDetail[code] ||
      ''
    );
  }, [code]);

  const getTextWon = useCallback(() => {
    const { winby, margin, result } = extraScores?.results || {};
    return `${
      result === 1 ? match.homeTeam?.name : match.awayTeam?.name
    } won by ${margin !== 0 ? margin : ''} ${
      margin === 0 ? '' : winby === 1 ? 'runs' : 'witckets'
    } `;
  }, [match, extraScores]);

  const textStatusTime =
    genDisplayedTimeCricket(
      match?.startTimestamp,
      status,
      i18n,
      currentPeriodStartTimestamp || match.time?.currentPeriodStartTimestamp
    ) || [];

  const formattedScore = useMemo(() => {
    const filterScores = (teamId: number) => {
      return (
        extraScores?.innings?.filter((x: number[]) => x[0] === teamId) || []
      );
    };

    const formatScore = (scores: number[][], primaryIndex: number) => {
      return scores?.length ? `${scores[0]?.[primaryIndex]}` : '0';
    };

    const formatScoreOv = (scores: number[][], index: number) => {
      return scores?.length > 1
        ? `${scores[0]?.[index] + scores[1]?.[index]}`
        : null;
    };

    const exHomeScore = filterScores(1);
    const exAwayScore = filterScores(2);

    const _homeScore = formatScore(exHomeScore, 1);
    const _awayScore = formatScore(exAwayScore, 1);

    const _homeScoreOv = formatScoreOv(exHomeScore, 1);
    const _awayScoreOv = formatScoreOv(exAwayScore, 1);

    return `${_homeScoreOv || _homeScore || 0} - ${
      _awayScoreOv || _awayScore || 0
    }`;
  }, [extraScores, homeScore, scores, awayScore, match]);

  return (
    <div className='flex flex-col place-content-center items-center justify-start gap-1 lg:flex-1'>
      {label && (
        <div className='flex flex-1 flex-col place-content-center items-center gap-y-1 font-oswald'>
          <div
            test-id='time-score-match'
            className='flex place-content-center text-center font-medium uppercase text-dark-text'
          >
            {label}
          </div>
        </div>
      )}
      {(!isMatchNotStartedCricket(code) && (
        <div
          test-id='score-match'
          className={`whitespace-nowrap rounded-xl border-2 border-match-score bg-dark-score ${
            isClub ? 'px-[10px]' : 'px-7'
          } py-1.5 font-oswald ${
            isClub ? 'text-xl' : 'text-3xl'
          } font-black text-match-score dark:bg-transparent`}
        >
          {formattedScore}
        </div>
      )) || (
        <div className='flex flex-1 flex-col place-content-center items-center gap-y-1 font-oswald'>
          <div className='flex place-content-center text-center text-lg font-medium text-white lg:text-dark-text dark:text-white'>
            {textStatusTime[1]}
          </div>
          <div className='relative bottom-1 place-content-center text-center font-medium text-white lg:text-dark-text dark:lg:text-dark-draw'>
            <div>{textStatusTime[0]}</div>
            {textStatusTime[2] && <div>{textStatusTime[2]}</div>}
          </div>
        </div>
      )}
      <div
        className='text-center text-csm dark:text-white'
        test-id='render-score-match'
      >
        {checkEnded(code || 1) && (
          <p className='border-t border-primary-mask pt-2 text-light-secondary dark:text-white'>
            {getTextWon()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MatchTimeScore;
