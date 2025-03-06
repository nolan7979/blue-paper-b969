import { format } from 'date-fns';

import { useMoreMatchData } from '@/hooks/useSportData';

import { useFilterStore } from '@/stores';

import { isValEmpty } from '@/utils';

export const MoreMatchesLoader = ({
  getMatches,
  sport = 'football',
}: {
  getMatches: any;
  sport: string;
}) => {
  const { dateFilter, setDateFilter } = useFilterStore();

  let dateFilterString = '';
  try {
    dateFilterString = format(dateFilter, 'yyyy-MM-dd');
  } catch (error) {
    setDateFilter(new Date());
  }

  const {
    data: matches,
    isLoading,
    isFetching,
  } = useMoreMatchData(dateFilterString, sport);

  if (isLoading || isFetching) {
    return <div>Loading more matches...</div>; // TODO loading skeleton/icon
  }

  if (!isValEmpty(matches)) {
    getMatches(matches);

    // const filteredMatches = filterOlderDate(matches, dateFilter);
    // getMatches(filteredMatches);

    // TODO filter
    // const filteredMatches = filterDifferentDate(matches, dateFilter);
    // getMatches(filteredMatches);
  }

  return <div></div>;
};
