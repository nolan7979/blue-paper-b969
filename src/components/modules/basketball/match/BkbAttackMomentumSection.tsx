import { useEffect, useState } from 'react';

import { SportEventDtoWithStat } from '@/constant/interface';
import { isMatchHaveStatBkb } from '@/utils';
import Rectangle from '@/components/common/skeleton/Rectangle';
import BkbMatch from '@/components/modules/basketball/match/BkbMatch';
import { TwQuickViewTitleV2 } from '@/components/modules/basketball/tw-components';
import useTrans from '@/hooks/useTrans';

interface BkbAttackMomentumSectionV2 {
  matchData: SportEventDtoWithStat;
}

export const BkbAttackMomentumSectionV2: React.FC<
  BkbAttackMomentumSectionV2
> = ({ matchData }) => {
  const i18n = useTrans();
  const [shouldRenderMatch, setShouldRenderMatch] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (matchData && isMatchHaveStatBkb(matchData?.status?.code)) {
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
    <>
      <TwQuickViewTitleV2 className='pl-2 uppercase lg:pl-0'>
        {i18n.stat.stats}
      </TwQuickViewTitleV2>
      <BkbMatch matchData={matchData} />
    </>
  ) : (
    <></>
  );
};
