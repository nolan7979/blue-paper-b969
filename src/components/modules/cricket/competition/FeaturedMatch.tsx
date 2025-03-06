import { SportEventDtoWithStat } from '@/constant/interface';

import { FeaturedMatchSkeleton } from '@/components/modules/basketball/skeletons';
import MatchTimeScore from '@/components/modules/cricket/match/MatchTimeScore';
import { isValEmpty } from '@/utils';
import useTrans from '@/hooks/useTrans';
import { SPORT } from '@/constant/common';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

export const FeaturedMatch = ({ match }: { match: SportEventDtoWithStat }) => {
  const i18n = useTrans();

  if (isValEmpty(match)) {
    return <FeaturedMatchSkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} sport={SPORT.CRICKET} isSubPage>
      <MatchTimeScore
        match={match}
        status={match.status}
        // isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
        isClub
      />
    </QuickViewSummaryCommon>
  );
};
