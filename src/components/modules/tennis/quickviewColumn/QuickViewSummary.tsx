/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import { useDetectDeviceClient } from '@/hooks';
import useTrans from '@/hooks/useTrans';

import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';
import MatchTimeScore from '@/components/modules/tennis/match/MatchTimeScore';

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
  const {isMobile} = useDetectDeviceClient()
  const { time } = match || {};
  const { setMatchLiveInfo } = useHomeStore();

  useEffect(() => {
    if (!isDetail) {
      setMatchLiveInfo(false);
    }else if(!isMobile){
      setMatchLiveInfo(true)
    }
  }, [isDetail,isMobile]);

  if (isValEmpty(match)) {
    return <QuickviewSummarySkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} isDetail={isDetail} sport={SPORT.TENNIS}>
      <MatchTimeScore match={match} status={match.status} i18n={i18n} currentPeriodStartTimestamp={time?.currentPeriodStartTimestamp} />
    </QuickViewSummaryCommon>
  );
};
export default QuickViewSummary;
