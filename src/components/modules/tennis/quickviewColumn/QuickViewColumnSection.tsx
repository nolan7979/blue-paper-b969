import { QuickViewColumn as TennisQuickViewColumn } from '@/components/modules/volleyball/quickviewColumn/QuickViewColumn';
import QuickViewSummaryFeaturedMatch from '@/components/modules/volleyball/quickviewColumn/QuickViewSummaryFeaturedMatch';
import { SPORT } from '@/constant/common';

import { useMatchStore } from '@/stores';

export const QuickViewColumnSection = () => {
  const { showSelectedMatch } = useMatchStore();

  return (
    <div className='h-full space-y-4 p-2.5'>
      {showSelectedMatch ? (
        <TennisQuickViewColumn top={true} sticky={true} />
      ) : (
        <QuickViewSummaryFeaturedMatch sport={SPORT.TENNIS} />
      )}
    </div>
  );
};
