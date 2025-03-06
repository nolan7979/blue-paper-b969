import { SportEventDtoWithStat } from '@/constant/interface';

import { MatchTimeScore } from '@/components/modules/badminton/match';
import { FeaturedMatchSkeleton } from '@/components/modules/basketball/skeletons';
import { SPORT } from '@/constant/common';
import useTrans from '@/hooks/useTrans';
import { useHomeStore } from '@/stores';
import { isValEmpty } from '@/utils';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

export const FeaturedMatch = ({ match }: { match: SportEventDtoWithStat }) => {
  const i18n = useTrans();
  const { scores } = match || {};

  const isScoreNotAvailable = !scores || Object.keys(scores)?.length === 0;

  if (isValEmpty(match)) {
    return <FeaturedMatchSkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} sport={SPORT.BADMINTON} isSubPage>
      <MatchTimeScore
        match={match}
        scores={scores}
        status={match.status}
        isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
        isClub
      />
    </QuickViewSummaryCommon>
  );
};
