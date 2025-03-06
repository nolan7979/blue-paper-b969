import { IScore, SportEventDtoWithStat } from '@/constant/interface';
import { useEffect, useState } from 'react';

import { FeaturedMatchSkeleton } from '@/components/modules/basketball/skeletons';
import MatchTimeScore from '@/components/modules/table-tennis/match/MatchTimeScore';
import useTrans from '@/hooks/useTrans';
import { useHomeStore } from '@/stores';
import { isValEmpty } from '@/utils';
import { SPORT } from '@/constant/common';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

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

  const [homeScore, setHomeScore] = useState<IScore | object>(match?.homeScore);
  const [awayScore, setAwayScore] = useState<IScore | object>(match?.awayScore);
  const [isFeaturedMatch, setIsFearutedMatch] = useState(false);

  const isScoreNotAvailable =
    !homeScore ||
    !awayScore ||
    Object.keys(homeScore)?.length === 0 ||
    Object.keys(awayScore)?.length === 0 ||
    isValEmpty((homeScore as IScore)?.display) ||
    isValEmpty((awayScore as IScore)?.display);

  useEffect(() => {
    setIsFearutedMatch(true);
    const matchedMatch: SportEventDtoWithStat = matchesLive[match?.id];
    if (matchedMatch) {
      setHomeScore(matchedMatch.homeScore);
      setAwayScore(matchedMatch.awayScore);
    } else {
      setHomeScore(match?.homeScore);
      setAwayScore(match?.awayScore);
    }
  }, [matchesLive, match]);

  if (isLoading) {
    return <FeaturedMatchSkeleton />;
  }

  if (Object.keys(match).length === 0) {
    return null;
  }

  return (
    <QuickViewSummaryCommon match={match} sport={SPORT.TABLE_TENNIS} isSubPage>
      <MatchTimeScore
        isFeaturedMatch={isFeaturedMatch}
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
