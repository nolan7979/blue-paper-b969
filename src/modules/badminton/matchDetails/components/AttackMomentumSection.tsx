import { useEffect, useState } from 'react';

import { SportEventDtoWithStat } from '@/constant/interface';
import Match from '@/modules/badminton/matchDetails/components/match';
import { isMatchHaveStatTennis } from '@/utils';
import React from 'react';

interface AttackMomentumSectionProps {
  matchData: SportEventDtoWithStat;
  isDetails?: boolean;
}

const AttackMomentumSection: React.FC<AttackMomentumSectionProps> = ({
  matchData,
  isDetails,
}) => {
  const [shouldRenderMatch, setShouldRenderMatch] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (matchData && isMatchHaveStatTennis(matchData?.status?.code)) {
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
  return shouldRenderMatch ? (
    <Match matchData={matchData} isDetail={isDetails} />
  ) : (
    <></>
  );
};
export default AttackMomentumSection;
