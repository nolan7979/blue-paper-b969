/* eslint-disable react-hooks/exhaustive-deps */
import useTrans from '@/hooks/useTrans';

import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';
import MatchTimeScore from '@/components/modules/cricket/match/MatchTimeScore';


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
  
  if (isValEmpty(match)) {
    return <QuickviewSummarySkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} isDetail={isDetail} sport={SPORT.CRICKET}>
      <MatchTimeScore match={match} status={match.status} i18n={i18n} />
    </QuickViewSummaryCommon>
  );
};
export default QuickViewSummary;
