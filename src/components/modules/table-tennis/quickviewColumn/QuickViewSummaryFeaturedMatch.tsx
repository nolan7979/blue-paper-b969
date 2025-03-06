import { useFeaturedMatchdaily } from '@/hooks/useFootball';

import FeatureMatch from '@/components/common/skeleton/homePage/FeatureMatch';
import QuickViewSummary from '@/components/modules/tennis/quickviewColumn/QuickViewSummary';

import { useHomeStore } from '@/stores';
import useTrans from '@/hooks/useTrans';

const QuickViewSummaryFeaturedMatch = ({
  match,
  sport = 'tennis',
}: {
  match?: any;
  sport?: any;
}) => {
  const i18n = useTrans();
  const { data: matches, isLoading } = useFeaturedMatchdaily({locale: i18n.language});
  const { matches: matchesHome } = useHomeStore();

  if (isLoading) {
    return (
      <div>
        load here
        <FeatureMatch />
      </div>
    );
  }
  if ((!matches || matches.length <= 0) && matchesHome && !isLoading) {
    const matchesN = Object.values(matchesHome)[0];
    return matchesN && Object.keys(matchesN).length > 0 ? (
      <QuickViewSummary match={matchesN as any} />
    ) : (
      <></>
    );
  }

  return (
    <>
    final
      <QuickViewSummary match={Object.values(matchesHome)[0] as any} />
    </>
  );
};
export default QuickViewSummaryFeaturedMatch;
