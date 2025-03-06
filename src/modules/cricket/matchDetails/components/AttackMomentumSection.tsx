import { useEffect, useState } from 'react';

import { SportEventDtoWithStat } from '@/constant/interface';
import Match from '@/modules/football/matchDetails/components/match';
import { isMatchHaveStat } from '@/utils';
import React from 'react';

interface AttackMomentumSectionProps {
  matchData: SportEventDtoWithStat;
}

const AttackMomentumSectionV2: React.FC<AttackMomentumSectionProps> = ({
  matchData,
}) => {
  const [shouldRenderMatch, setShouldRenderMatch] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (matchData && isMatchHaveStat(matchData?.status?.code)) {
      timeout = setTimeout(() => {
        setShouldRenderMatch(true);
      }, 1000); // 1 seconds delay
    } else {
      setShouldRenderMatch(false);
    }
    return () => clearTimeout(timeout);
  }, [matchData]);

  if (!matchData) {
    return <></>;
  }
  return shouldRenderMatch ? <Match matchData={matchData} /> : <></>;
};
export default AttackMomentumSectionV2;
