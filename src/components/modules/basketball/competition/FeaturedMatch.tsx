import { IScore, SportEventDtoWithStat } from '@/constant/interface';
import { useEffect, useState } from 'react';

import { FeaturedMatchSkeleton } from '@/components/modules/basketball/skeletons';
import MatchTimeScore from '@/components/modules/basketball/match/MatchTimeScore';
import { isValEmpty } from '@/utils';
import { useHomeStore } from '@/stores';
import useTrans from '@/hooks/useTrans';
import { SPORT } from '@/constant/common';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

export const FeaturedMatch = ({
  match,
  isShowedHeader = true,
}: {
  match: SportEventDtoWithStat;
  isShowedHeader?: boolean;
}) => {
  const i18n = useTrans();
  const { matchesLive } = useHomeStore();

  const [homeScore, setHomeScore] = useState<IScore | object>(match?.homeScore);
  const [awayScore, setAwayScore] = useState<IScore | object>(match?.awayScore);

  const isScoreNotAvailable =
    !homeScore ||
    !awayScore ||
    Object.keys(homeScore)?.length === 0 ||
    Object.keys(awayScore)?.length === 0 ||
    isValEmpty((homeScore as IScore)?.display) ||
    isValEmpty((awayScore as IScore)?.display);

  useEffect(() => {
    const matchedMatch: SportEventDtoWithStat = matchesLive[match?.id];
    if (matchedMatch) {
      setHomeScore(matchedMatch.homeScore);
      setAwayScore(matchedMatch.awayScore);
    } else {
      setHomeScore(match?.homeScore);
      setAwayScore(match?.awayScore);
    }
  }, [matchesLive, match]);

  if (isValEmpty(match)) {
    return <FeaturedMatchSkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} sport={SPORT.BASKETBALL} isSubPage>
      <MatchTimeScore
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
