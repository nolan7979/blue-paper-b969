/* eslint-disable react-hooks/exhaustive-deps */
import useTrans from '@/hooks/useTrans';

import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';

import { SportEventDtoWithStat } from '@/constant/interface';
import { isValEmpty } from '@/utils';

import MatchTimeScore from '@/components/modules/baseball/match/MatchTimeScore';
import { SPORT } from '@/constant/common';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

const QuickViewSummary = ({
  match,
  isDetail = false,
  isFeatureMatch,
}: {
  match: SportEventDtoWithStat;
  isSelectMatch?: boolean;
  isDetail?: boolean;
  isFeatureMatch?: boolean;
}) => {
  const i18n = useTrans();
  const { scores } = match || {};

  const isScoreNotAvailable = !scores || Object.keys(scores)?.length === 0;

  if (isValEmpty(match)) {
    return <QuickviewSummarySkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} isDetail={isDetail} sport={SPORT.BASEBALL}>
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
