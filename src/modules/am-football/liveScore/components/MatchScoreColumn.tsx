import { TwScoreCol } from '@/components/modules/football/tw-components';

import { isMatchNotStarted, isNumber } from '@/utils';
import { isMatchEndAMFootball } from '@/utils/americanFootballUtils';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface IMatchScoreColum {
  code: number;
  homeScore?: number;
  awayScore?: number;
}
const MatchScoreColumn: React.FC<IMatchScoreColum> = ({
  code,
  awayScore,
  homeScore,
}) => {
  const renderColorScore = useMemo(() => {
    if (homeScore !== undefined && awayScore !== undefined) {
      const isDraw = homeScore === awayScore;
      const isHomeWinning = homeScore > awayScore;
      const isAwayWinning = awayScore > homeScore;

      return (
        <>
          <ScoreDisplay
            score={homeScore}
            isHome={true}
            isWinning={isHomeWinning}
            isDraw={isDraw}
          />
          <ScoreDisplay
            score={awayScore}
            isHome={false}
            isWinning={isAwayWinning}
            isDraw={isDraw}
          />
        </>
      );
    }
  }, [homeScore, awayScore]);

  return (
    <TwScoreCol className='!w-full justify-between'>
      {renderColorScore}
    </TwScoreCol>
  );
};
export default MatchScoreColumn;

const ScoreDisplay: React.FC<{
  score: number;
  isHome: boolean;
  isWinning: boolean;
  isDraw: boolean;
}> = ({ score, isHome, isWinning, isDraw }) => {
  const baseClasses =
    'h-full min-w-[1.375rem] text-xs flex items-center justify-center';
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
        test-id='score-away'
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
