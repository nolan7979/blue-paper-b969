import dynamic from 'next/dynamic';

import { useTournamentFeaturedEvents } from '@/hooks/useFootball';

import FeatureMatchCompe from '@/components/common/skeleton/competition/FeatureMatchCompe';

const QuickViewSummary = dynamic(
  () => import('@/components/modules/football/quickviewColumn/QuickViewSummary')
);
const FeaturedEventsSection = ({
  uniqueTournament = {},
}: {
  uniqueTournament: any;
}) => {
  const { data: featuredEvents = [], isLoading } = useTournamentFeaturedEvents(
    uniqueTournament?.id
  );

  if (isLoading || !featuredEvents)
    return (
      <div className='flex h-fit w-full  flex-col gap-3 rounded-xl bg-white px-2 py-8 dark:bg-[#222]'>
        <FeatureMatchCompe />
      </div>
    );

  const featuredEvent = featuredEvents || {};

  return <QuickViewSummary match={featuredEvent} isFeatureMatch />;
};

export default FeaturedEventsSection;
