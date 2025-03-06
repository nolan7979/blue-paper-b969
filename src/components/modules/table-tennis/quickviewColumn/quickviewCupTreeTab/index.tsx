import QuickViewFilterTabRounds from '@/components/modules/table-tennis/quickviewColumn/quickviewCupTreeTab/QuickViewFilterTabRounds';
import { SportEventDto } from '@/constant/interface';
import { useCupTree } from '@/hooks/useTableTennis';
import React, { useEffect, useMemo } from 'react'

const QuickViewCupTreeTab: React.FC<{ matchData: SportEventDto}> = ({ matchData }) => {
  const selectedSeasonId = matchData?.seasonId || '' as string | any;
  const { data, isLoading } = useCupTree(selectedSeasonId);

  const selectedData = useMemo(() => {
    if (!data) return undefined;
    return data[0];
  }, [data]);

  return (
    <div>
      <QuickViewFilterTabRounds cupTree={selectedData} />
    </div>
  )
}

export default QuickViewCupTreeTab