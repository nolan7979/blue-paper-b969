import { QuickViewColumn as VlbQuickViewColumn } from '@/components/modules/volleyball/quickviewColumn/QuickViewColumn';
import QuickViewSummaryFeaturedMatch from '@/components/modules/volleyball/quickviewColumn/QuickViewSummaryFeaturedMatch';

import { useMatchStore } from '@/stores';

export const BkbQuickViewColumnSection = () => {
  const { showSelectedMatch } = useMatchStore();

  return (
    <div className='h-full space-y-4 p-2.5'>
      {showSelectedMatch ? (
        <VlbQuickViewColumn top={true} sticky={true} />
      ) : (
        <QuickViewSummaryFeaturedMatch sport='volleyball' />
      )}
    </div>
  );
};
