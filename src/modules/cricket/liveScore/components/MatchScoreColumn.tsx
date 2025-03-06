import { TwScoreCol } from '@/components/modules/football/tw-components';

import { isMatchNotStarted, isNumber } from '@/utils';
import { nonScoreStates } from '@/utils/cricketUtils';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface IMatchScoreColum {
  code: number;
  scores?: any;
  homeScore?: any;
  awayScore?: any;
  extraScores?: any[];
}
const MatchScoreColumn: React.FC<IMatchScoreColum> = ({
  code,
  scores,
  homeScore,
  awayScore,
  extraScores,
}) => {
  const scoreHomeOld =
    homeScore?.display === 0 ? 0 : homeScore?.display || homeScore?.current; // add
  const scoreAwayOld =
    awayScore?.display === 0 ? 0 : awayScore?.display || awayScore?.current; // add

  const { ft } = scores || {};
  const scoreHome = ft?.length > 1 ? ft[0] : scoreHomeOld || 0;
  const scoreAway = ft?.length > 1 ? ft[1] : scoreAwayOld || 0;

  const filterScores = (teamId: number) => {
    return extraScores?.filter((x: number[]) => x[0] === teamId) || [];
  };

  const formatScore = (
    scores: number[][],
    primaryIndex: number,
    secondaryIndex: number
  ) => {
    return scores?.length
      ? `${scores[0]?.[primaryIndex]}/${scores[0]?.[secondaryIndex]}`
      : '0';
  };

  const formatScoreOv = (scores: number[][], index: number) => {
    return scores?.length > 1
      ? `${scores[0]?.[index]} & ${scores[1]?.[index]}`
      : null;
  };

  const exHomeScore = filterScores(1);
  const exAwayScore = filterScores(2);

  const _homeScore = formatScore(exHomeScore, 1, 3);
  const _awayScore = formatScore(exAwayScore, 1, 3);

  const _homeScoreOv = formatScoreOv(exHomeScore, 1);
  const _awayScoreOv = formatScoreOv(exAwayScore, 1);

  const renderColorScore = useMemo(() => {
    if (homeScore !== undefined && awayScore !== undefined) {
      const isDraw = homeScore === awayScore;
      const isHomeWinning = scoreHome > scoreAway;
      const isAwayWinning = scoreAway > scoreHome;

      return (
        <>
          <ScoreDisplay
            score={_homeScoreOv || _homeScore}
            isHome={true}
            isWinning={isHomeWinning}
            isDraw={isDraw}
          />
          <ScoreDisplay
            score={_awayScoreOv || _awayScore}
            isHome={false}
            isWinning={isAwayWinning}
            isDraw={isDraw}
          />
        </>
      );
    }
  }, [homeScore, awayScore]);

  const memoizedTwScoreCol = useMemo(
    () => (
      <>
        <TwScoreCol className='!w-full justify-between'>
          {!nonScoreStates.includes(code) && renderColorScore}
        </TwScoreCol>

        {!nonScoreStates.includes(code) && (
          <div className='dark:text-white text-msm h-full flex flex-col gap-1'>
            <div>
              {exHomeScore[0]?.[2]
                ? `(${
                    Number.isInteger(exHomeScore[0][2])
                      ? `${exHomeScore[0][2]}.0`
                      : exHomeScore[0][2]
                  })`
                : ''}
            </div>
            <div>
              {exAwayScore[0]?.[2]
                ? `(${
                    Number.isInteger(exAwayScore[0][2])
                      ? `${exAwayScore[0][2]}.0`
                      : exAwayScore[0][2]
                  })`
                : ''}
            </div>
          </div>
        )}
      </>
    ),
    [code, renderColorScore, exHomeScore, exAwayScore]
  );

  return memoizedTwScoreCol;
};
export default MatchScoreColumn;

const ScoreDisplay: React.FC<{
  score: string;
  isHome: boolean;
  isWinning: boolean;
  isDraw: boolean;
}> = ({ score, isHome, isWinning, isDraw }) => {
  const baseClasses =
    'h-full min-w-[1.375rem] text-xs flex items-center justify-center px-1';
  const winningClasses = isWinning
    ? 'bg-light-score dark:bg-all-blue dark:text-white font-bold'
    : 'bg-light-home-score text-all-blue dark:text-white dark:dark-away-score';
  const drawClasses = isDraw
    ? 'bg-draw-blue text-white dark:bg-draw-blue py-[2px] font-bold'
    : '';
  const roundedClasses = isHome
    ? 'rounded-t-[4px] py-[2px]'
    : 'rounded-b-[4px] py-[2px]';

  if (isDraw) {
    return (
      <div
        className={twMerge(`${baseClasses} ${drawClasses} ${roundedClasses}`)}
        test-id='score-home'
      >
        {score}
      </div>
    );
  }
  return (
    <div
      className={twMerge(`${baseClasses} ${winningClasses} ${roundedClasses}`)}
      test-id='score-away'
    >
      {score}
    </div>
  );
};
