import { useFeaturedMatchdaily } from '@/hooks/useFootball';

import FeatureMatch from '@/components/common/skeleton/homePage/FeatureMatch';
import QuickViewSummary from '@/components/modules/football/quickviewColumn/QuickViewSummary';

import { useHomeStore } from '@/stores';
import useTrans from '@/hooks/useTrans';

const QuickViewSummaryFeaturedMatch = ({
  match,
  sport = 'football',
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
        <FeatureMatch />
      </div>
    );
  }
  if ((!matches || matches.length <= 0) && matchesHome && !isLoading) {
    const matches = Object.values(matchesHome)[0];
    return matches && Object.keys(matches).length > 0 ? (
      <QuickViewSummary match={matches as any} />
    ) : (
      <></>
    );
  }

  return (
    <>
      <QuickViewSummary match={matches} />
    </>
  );
};
export default QuickViewSummaryFeaturedMatch;
