import { QuickViewColumn } from '@/components/modules/basketball/quickviewColumn/QuickViewColumn';
import QuickViewSummaryFeaturedMatch from '@/components/modules/football/quickviewColumn/QuickViewSummaryFeaturedMatch';

import { useMatchStore } from '@/stores';

export const QuickViewColumnSection = () => {
  const { showSelectedMatch } = useMatchStore();

  return (
    <div className='h-full space-y-4 p-2.5'>
      {showSelectedMatch ? (
        <QuickViewColumn top={true} sticky={true} />
      ) : (
        <QuickViewSummaryFeaturedMatch sport='basketball' />
      )}
    </div>
  );
};
