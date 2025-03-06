import { HiChevronDown } from 'react-icons/hi';

import useTrans from '@/hooks/useTrans';

import { useMatchStore } from '@/stores';

export const LoadMoreMatchesBtn = () => {
  const i18n = useTrans();
  const { setLoadMoreMatches } = useMatchStore();

  return (
    <div className='mt-2 flex place-content-center items-center text-logo-blue'>
      <button
        onClick={() => setLoadMoreMatches(true)}
        className='item-hover flex items-center space-x-1 rounded-full bg-light-match p-2 px-4 dark:bg-dark-match'
      >
        <span className='text-sm'>{i18n.common.show_all_matches}</span>
        <span>
          <HiChevronDown></HiChevronDown>
        </span>
      </button>
    </div>
  );
};
