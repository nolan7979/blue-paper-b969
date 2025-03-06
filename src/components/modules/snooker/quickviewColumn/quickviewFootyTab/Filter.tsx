import { FC } from 'react';
import { TwBorderLinearBox } from '@/components/modules/common';

type FilterProps = {
  filter: string;
  setFilter: (value: string) => void;
  items: { label: string; value: string }[];
};

const Filter: FC<FilterProps> = ({ filter, setFilter, items }) => {
  return (
    <div className='flex space-x-2'>
      {items.map((item) => {
        return (
          <TwBorderLinearBox
            key={item.value}
            className={`h-full w-1/2 !rounded-full border border-line-default bg-white dark:border-0 dark:bg-primary-gradient ${
              filter === item.value ? 'dark:border-linear-form' : ''
            }`}
          >
            <button
              test-id={`btn-type-${item.value}`}
              onClick={() => setFilter(item.value)}
              className={`flex h-full w-full items-center justify-center gap-x-1 !rounded-full px-3 py-1.5 text-csm font-medium capitalize transition-colors  duration-300 ${
                filter === item.value
                  ? 'dark:bg-button-gradient bg-dark-button text-white dark:text-white'
                  : ''
              }`}
            >
              {item.label}
            </button>
          </TwBorderLinearBox>
        );
      })}
    </div>
  );
};

export default Filter;
