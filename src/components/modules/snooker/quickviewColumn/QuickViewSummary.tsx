/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';

import useTrans from '@/hooks/useTrans';
import MatchTimeScore from '@/components/modules/snooker/match/MatchTimeScore';

import { useHomeStore } from '@/stores';

import { SportEventDtoWithStat } from '@/constant/interface';
import { isValEmpty } from '@/utils';

import { SPORT } from '@/constant/common';
import { getScores } from '@/components/modules/table-tennis/match';
import dynamic from 'next/dynamic';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

const QuickViewSummary = ({
  match,
  isSelectMatch,
  isDetail = false,
  isFeatureMatch,
  isMobile,
}: {
  match: SportEventDtoWithStat;
  isSelectMatch?: boolean;
  isDetail?: boolean;
  isFeatureMatch?: boolean;
  isMobile?: boolean;
}) => {
  const i18n = useTrans();
  const { matchLiveInfo, matchesLive, setMatchLiveInfo } = useHomeStore();

  const [homeScore, setHomeScore] = useState<string | number>(0);
  const [awayScore, setAwayScore] = useState<string | number>(0);

  const memoziedScore = useMemo(() => {
    const { scores, scoresRest } = getScores(match?.scores);
    return {
      scores,
      scoresRest,
    };
  }, [match?.scores]) as { scores: number[]; scoresRest: Record<string, any> };

  const isScoreNotAvailable =
    !memoziedScore ||
    Object.keys(memoziedScore)?.length === 0 ||
    isValEmpty(memoziedScore as any);

  useEffect(() => {
    const matchedMatch: SportEventDtoWithStat = matchesLive[match?.id];
    if (matchedMatch) {
      const { scores } = getScores(matchedMatch?.scores);
      setHomeScore(scores[0]);
      setAwayScore(scores[1]);
    } else {
      setHomeScore(memoziedScore?.scores[0]);
      setAwayScore(memoziedScore?.scores[1]);
    }
  }, [matchesLive, match]);

  useEffect(() => {
    if (!isDetail || (isMobile && matchLiveInfo)) {
      setMatchLiveInfo(false);
    }
  }, []);

  return (
    <QuickViewSummaryCommon match={match} isDetail={isDetail} sport={SPORT.SNOOKER}>
      {match && (
        <MatchTimeScore
          match={match}
          homeScore={homeScore}
          status={match?.status}
          awayScore={awayScore}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
        />
      )}
    </QuickViewSummaryCommon>
  );
};
export default QuickViewSummary;