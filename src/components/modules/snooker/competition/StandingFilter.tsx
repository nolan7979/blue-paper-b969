import clsx from 'clsx';
import { TwBorderLinearBox, TwTabHead } from '@/components/modules/common';

type StandingStableProps = {
  filterLabel: { name: string; id: string }[];
  standingFilter: string;
  setStandingFilter: (value: string) => void;
};

export const StandingFilter: React.FC<StandingStableProps> = ({
  filterLabel = [],
  standingFilter,
  setStandingFilter,
}) => {
  if(filterLabel.length === 0) return null;
  return (
    <TwTabHead className='!w-fit !justify-start'>
      {filterLabel.map((item) => (
        <TwBorderLinearBox
          key={item.name}
          className={`h-full w-fit !rounded-full ${
            standingFilter === `${item}` ? 'border-linear-form' : ''
          }`}
        >
          <button
            className={clsx(
              'flex h-full w-fit items-center justify-center rounded-full px-4 ',
              {
                'dark:bg-button-gradient cursor-default bg-dark-button text-white':
                  standingFilter === item.id,
              }
            )}
            onClick={() =>
              item.name !== standingFilter ? setStandingFilter(item.name) : null
            }
          >
            <span className='truncate text-csm'>{item.name.split('_').pop()}</span>
          </button>
        </TwBorderLinearBox>
      ))}
    </TwTabHead>
  );
};
