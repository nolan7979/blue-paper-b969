import { SportEventDtoWithStat } from '@/constant/interface';
import { useHomeStore } from '@/stores';
import { useEffect, useState } from 'react';
import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';
import { MatchTimeScore } from '@/components/modules/badminton/match';
import { SPORT } from '@/constant/common';
import { useDetectDeviceClient, useWindowSize } from '@/hooks';
import useTrans from '@/hooks/useTrans';
import { isValEmpty } from '@/utils';
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
  const { isMobile } = useDetectDeviceClient()
  const { matchesLive,matchLiveInfo, setMatchLiveInfo } = useHomeStore();
  const [scores, setScore] = useState<{ [key: string]: number[] } | undefined>(
    match?.scores
  );

  const isScoreNotAvailable =
    !scores ||
    Object.keys(scores)?.length === 0


  useEffect(() => {
    const matchedMatch: SportEventDtoWithStat = matchesLive[match?.id];
    if (matchedMatch) {
      setScore(matchedMatch.scores);
    } else {
      setScore(match?.scores);
    }
  }, [matchesLive, match]);

  useEffect(() => {
    if (!isDetail || (isMobile && !!matchLiveInfo) ) {
      setMatchLiveInfo(false);
    }
    if (!isMobile && isDetail) {
      setMatchLiveInfo(true);
    }
  }, [isDetail, isMobile]);

  if (isValEmpty(match)) {
    return <QuickviewSummarySkeleton />;
  }

  return (
    <QuickViewSummaryCommon match={match} isDetail={isDetail} sport={SPORT.BADMINTON}>
      <MatchTimeScore
        match={match}
        scores={scores}
        status={match.status}
        isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
      />
    </QuickViewSummaryCommon>
  );
};
export default QuickViewSummary;
