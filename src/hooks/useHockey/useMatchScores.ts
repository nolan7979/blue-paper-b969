import { useMemo } from 'react';
import { isMatchNotStartedHockey } from '@/utils';
import { SportEventDtoWithStat } from '@/constant/interface';

const DEFAULT_PERIOD_SCORES = ['p1', 'p2', 'p3', 'p4'];

export const useMatchScores = (matchData: SportEventDtoWithStat) => {
  const matchScores = useMemo(() => {
    const originalData = matchData?.scores || {};
    if (!originalData || Object.keys(originalData).length === 0) {
      return {};
    }

    const isNotStarted = isMatchNotStartedHockey(matchData.status?.code);

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
      return originalData.ft ? { ...emptyScores, ft: originalData.ft } : emptyScores;
    }

    // Handle after penalty scores
    if (originalData.ap && originalData?.ot) {
      const ft = originalData.ap;
      const ap = [
        Number(originalData.ap[0]) - Number(originalData?.ot[0]),
        Number(originalData.ap[1]) - Number(originalData?.ot[1])
      ];
      const ot = [
        Number(originalData?.ot[0]) - Number(originalData.ft[0]),
        Number(originalData?.ot[1]) - Number(originalData.ft[1])
      ];
      return { ...periodScores, ot, ap, ft };
    }

    // Handle overtime scores
    if (originalData.ot) {
      const ft = originalData.ot;
      const ot = [
        Number(originalData.ot[0]) - Number(originalData.ft[0]),
        Number(originalData.ot[1]) - Number(originalData.ft[1])
      ];
      return { ...periodScores, ot, ft };
    }

    // Return regular time scores
    return originalData.ft ? { ...periodScores, ft: originalData.ft } : periodScores;

  }, [matchData?.scores, matchData?.status?.code]);

  return matchScores;
}; 