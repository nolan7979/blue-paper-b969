/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import { useDetectDeviceClient } from '@/hooks';
import useTrans from '@/hooks/useTrans';
import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';
import MatchTimeScore from '@/components/modules/volleyball/match/MatchTimeScore';

import { useHomeStore } from '@/stores';

import { SportEventDtoWithStat } from '@/constant/interface';
import { isValEmpty } from '@/utils';

import { SPORT } from '@/constant/common';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

const QuickViewSummary = ({
  match,
  isDetail = false,
}: {
  match: SportEventDtoWithStat;
  isSelectMatch?: boolean;
  isDetail?: boolean;
  isFeatureMatch?: boolean;
}) => {
  const i18n = useTrans();
  const {isMobile} = useDetectDeviceClient()
  const { scores } = match || {};
  const { setMatchLiveInfo } = useHomeStore();

  const isScoreNotAvailable = !scores || Object.keys(scores)?.length === 0;

  useEffect(() => {
    if (!isDetail) {
      setMatchLiveInfo(false);
    }else if(!isMobile){
      setMatchLiveInfo(true)
    }
  }, [isDetail, isMobile]);

  if (isValEmpty(match)) {
    return <QuickviewSummarySkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} isDetail={isDetail} sport={SPORT.VOLLEYBALL}>
      <MatchTimeScore
        match={match}
        status={match.status}
        isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
      />
    </QuickViewSummaryCommon>
  );
};
export default QuickViewSummary;
