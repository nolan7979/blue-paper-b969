/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';
import MatchTimeScore from '@/components/modules/table-tennis/match/MatchTimeScore';

import { useHomeStore } from '@/stores';

import { IScore, SportEventDtoWithStat } from '@/constant/interface';
import { isValEmpty } from '@/utils';

import { SPORT } from '@/constant/common';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

const QuickViewSummary = ({
  match,
  isSelectMatch,
  isDetail = false,
  isFeatureMatch,
}: {
  match: SportEventDtoWithStat;
  isSelectMatch?: boolean;
  isDetail?: boolean;
  isFeatureMatch?: boolean;
}) => {
  const i18n = useTrans();
  const { matchesLive, setMatchLiveInfo } = useHomeStore();

  const [homeScore, setHomeScore] = useState<IScore | object>(match?.homeScore);
  const [awayScore, setAwayScore] = useState<IScore | object>(match?.awayScore);

  const isScoreNotAvailable =
    !homeScore ||
    !awayScore ||
    Object.keys(homeScore)?.length === 0 ||
    Object.keys(awayScore)?.length === 0 ||
    isValEmpty((homeScore as IScore)?.display) ||
    isValEmpty((awayScore as IScore)?.display);

  useEffect(() => {
    const matchedMatch: SportEventDtoWithStat = matchesLive[match?.id];
    if (matchedMatch) {
      setHomeScore(matchedMatch.homeScore);
      setAwayScore(matchedMatch.awayScore);
    } else {
      setHomeScore(match?.homeScore);
      setAwayScore(match?.awayScore);
    }
  }, [matchesLive, match]);

  useEffect(() => {
    if (!isDetail) {
      setMatchLiveInfo(false);
    }
  }, []);

  if (isValEmpty(match) || !match) {
    return <QuickviewSummarySkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} isDetail={isDetail} sport={SPORT.TABLE_TENNIS}>
      <MatchTimeScore
        match={match}
        homeScore={homeScore}
        status={match.status}
        awayScore={awayScore}
        isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
      />
    </QuickViewSummaryCommon>
  );
};
export default QuickViewSummary;
