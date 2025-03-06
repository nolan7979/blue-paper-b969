import React, { useMemo } from 'react';
import { StandingRow } from '@/components/modules/basketball/components/StandingRow';
import { SPORT } from '@/constant/common';
import useTrans from '@/hooks/useTrans';

type StandingRowProps = {
  standingData: any;
  sport: string;
};

const StandingRowCommon: React.FC<StandingRowProps> = ({
  standingData,
  sport
}) => {
  const i18n = useTrans();
  if (sport === SPORT.BASKETBALL) return <StandingRow rank={standingData?.position} record={standingData} locale={i18n.language} />
  return (
    <div>standing common</div>
  );
};

export default StandingRowCommon;