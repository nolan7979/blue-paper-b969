import { SportEventDtoWithStat } from '@/constant/interface';
import { useEffect, useState } from 'react';

import { FeaturedMatchSkeleton } from '@/components/modules/basketball/skeletons';
import MatchTimeScore from '@/components/modules/tennis/match/MatchTimeScore';
import useTrans from '@/hooks/useTrans';
import { useHomeStore } from '@/stores';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';
import { SPORT } from '@/constant/common';

interface FeaturedMatchProps {
  isMobile?: boolean;
  match: SportEventDtoWithStat;
  isLoading?: boolean;
}

export const FeaturedMatch: React.FC<FeaturedMatchProps> = ({
  isMobile,
  match,
  isLoading,
}) => {
  const i18n = useTrans();
  const { matchesLive } = useHomeStore();

  const [isFeaturedMatch, setIsFearutedMatch] = useState(false);

  useEffect(() => {
    setIsFearutedMatch(true);
  }, [matchesLive, match]);

  if (isLoading) {
    return <FeaturedMatchSkeleton />;
  }

  if (Object.keys(match).length === 0) {
    return null;
  }

  return (
    <QuickViewSummaryCommon match={match} sport={SPORT.TENNIS} isSubPage>
      <MatchTimeScore
        isFeaturedMatch={isFeaturedMatch}
        match={match}
        status={match.status}
        i18n={i18n}
      />
    </QuickViewSummaryCommon>
  );
};
