import { useMemo } from 'react';
import { isMatchNotStartedHockey } from '@/utils';
import { SportEventDtoWithStat } from '@/constant/interface';
import { isMatchNotStartedTableTennis } from '@/utils/tableTennisUtils';

const DEFAULT_PERIOD_SCORES = ['ft', 'p1', 'p2', 'p3'];

export const useMatchScoresTableTennis = (matchData: SportEventDtoWithStat) => {
  const matchScores = useMemo(() => {
    const originalData = matchData?.scores || {};
    if (!originalData || Object.keys(originalData).length === 0) {
      return {};
    }

    const isNotStarted = isMatchNotStartedTableTennis(matchData.status?.code);

    // Get period scores excluding special scores
    const periodScores = Object.entries(originalData)
      .filter(([key]) => !['ft', 'ot', 'ap'].includes(key))
      .reduce((obj, [key, value]) => ({
        ...obj,
        [key]: value
      }), {});

    // Handle not started matches
    if (isNotStarted) {
      const emptyScores = DEFAULT_PERIOD_SCORES.reduce((obj, key) => ({
        ...obj,
        [key]: '-'
      }), {});
      return originalData.ft && !isNotStarted ? { ...emptyScores, ft: originalData.ft } : emptyScores;
    }


    // Return regular time scores
    return originalData.ft ? { ft: originalData.ft, p1: [], p2: [], p3: [], ...periodScores } : periodScores;

  }, [matchData?.scores, matchData?.status?.code]);

  return matchScores;
}; 
