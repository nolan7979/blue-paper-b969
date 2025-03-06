
import { SportEventDtoWithStat } from '@/constant/interface';
import Match from '@/modules/football/matchDetails/components/match';
import React from 'react';

interface AttackMomentumSectionProps {
  matchData: SportEventDtoWithStat;
}

const AttackMomentumSectionV2: React.FC<AttackMomentumSectionProps> = ({
  matchData,
}) => {

  if (!matchData) {
    return <></>;
  }

  return <Match matchData={matchData} />;
};

export default AttackMomentumSectionV2;
