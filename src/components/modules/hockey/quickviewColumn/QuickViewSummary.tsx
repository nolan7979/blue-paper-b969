/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';
import MatchTimeScore from '@/components/modules/hockey/match/MatchTimeScore';

import { useHomeStore } from '@/stores';

import { SportEventDtoWithStat } from '@/constant/interface';
import { isValEmpty } from '@/utils';

import { getScores } from '@/components/modules/hockey/match';
import { SPORT } from '@/constant/common';
import { useMatchScores } from '@/hooks/useHockey/useMatchScores';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

const QuickViewSummary = ({
  match,
  isDetail = false,
  isFeatureMatch,
}: {
  match: SportEventDtoWithStat;
  isDetail?: boolean;
  isFeatureMatch?: boolean;
}) => {
  const i18n = useTrans();
  const { setMatchLiveInfo } = useHomeStore();
  // const matchedMatch: SportEventDtoWithStat = matchesLive[match?.id];
  const { scores } = getScores(match?.scores);
  const [homeScore, setHomeScore] = useState<number | string>(scores[0]);
  const [awayScore, setAwayScore] = useState<number | string>(scores[1]);

  const isScoreNotAvailable = scores.length === 0;
  const matchScores = useMatchScores(match) as { [key: string]: any };
  useEffect(() => {
    if (Object.keys(matchScores).length === 0) return
    setHomeScore(matchScores.ft[0]);
    setAwayScore(matchScores.ft[1]);
  }, [matchScores]);

  useEffect(() => {
    if (!isDetail) {
      setMatchLiveInfo(false);
    }
  }, []);

  if (isValEmpty(match)) {
    return <QuickviewSummarySkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} isDetail={isDetail} sport={SPORT.ICE_HOCKEY}>
      <MatchTimeScore
        match={match}
        homeScore={homeScore}
        awayScore={awayScore}
        isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
      />
    </QuickViewSummaryCommon>
  );
};
export default QuickViewSummary;
