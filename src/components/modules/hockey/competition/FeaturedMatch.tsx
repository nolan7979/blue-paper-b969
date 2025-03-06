import { SportEventDtoWithStat } from '@/constant/interface';

import { FeaturedMatchSkeleton } from '@/components/modules/basketball/skeletons';
import MatchTimeScore from '@/components/modules/hockey/match/MatchTimeScore';
import { isValEmpty } from '@/utils';
import useTrans from '@/hooks/useTrans';
import { SPORT } from '@/constant/common';
import { getScores } from '@/components/modules/hockey/match';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

export const FeaturedMatch = ({ match }: { match: SportEventDtoWithStat }) => {
  const i18n = useTrans();
  const { scores } = getScores(match?.scores);
  
  const isScoreNotAvailable = !scores || Object.keys(scores)?.length === 0;

  if (isValEmpty(match)) {
    return <FeaturedMatchSkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} sport={SPORT.ICE_HOCKEY} isSubPage>
      <MatchTimeScore
        match={match}
        homeScore={scores ? scores[0] : 0}
        awayScore={scores ? scores[1] : 0}
        isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
      />
    </QuickViewSummaryCommon>
  );
};
