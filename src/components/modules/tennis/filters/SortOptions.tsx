import { TwButtonIcon } from '@/components/buttons/IconButton';
import useTrans from '@/hooks/useTrans';
import { useMatchStore } from '@/stores';
import { useSortStore } from '@/stores/sort-store';
import { FaSort } from 'react-icons/fa';

const SortOptions = () => {
  const i18n = useTrans();
  const { sortBy, setSortBy } = useSortStore();
  const { setLoadMoreMatches } = useMatchStore();

  return (
    <TwButtonIcon
      onClick={() => {
        setSortBy('time');
        sortBy === 'time'
          ? (setSortBy('league'), setLoadMoreMatches(false))
          : (setSortBy('time'), setLoadMoreMatches(true));
      }}
      icon={<FaSort className={'h-4 w-5'} />}
      className='min-w-[76px] flex-row-reverse text-xs dark:text-white lg:flex lg:flex-row'
      testId={sortBy}
    >
      {sortBy === 'time' ? i18n.sort.league : i18n.sort.time}
    </TwButtonIcon>
  );
};
export default SortOptions;
