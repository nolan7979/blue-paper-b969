'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import useTrans from '@/hooks/useTrans';
import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';
import MatchTimeScore from '@/components/modules/am-football/match/MatchTimeScore';

import { useHomeStore } from '@/stores';

import { SportEventDtoWithStat } from '@/constant/interface';
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
  const { scores } =
    match || {};
  const { setMatchLiveInfo } = useHomeStore();

  const isScoreNotAvailable = !scores || Object.keys(scores)?.length === 0;

  useEffect(() => {
    if (!isDetail) {
      setMatchLiveInfo(false);
    }
  }, []);

  if (isValEmpty(match)) {
    return <QuickviewSummarySkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} isDetail={isDetail} sport={SPORT.AMERICAN_FOOTBALL}>
      <MatchTimeScore
        match={match}
        scores={scores}
        status={match.status}
        isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
        />
    </QuickViewSummaryCommon>
  );
};
export default QuickViewSummary;
