import useTrans from '@/hooks/useTrans';

import { StandingHeaderRow } from '@/components/modules/basketball/components/StandingHeaderRow';
import { SPORT } from '@/constant/common';

const StandingHeaderRowCommon = ({sport}: {sport: string}) => {
  const i18n = useTrans();
  if (sport === SPORT.BASKETBALL) return <StandingHeaderRow />
  return (
    <div>row data</div>
  );
};

export default StandingHeaderRowCommon;