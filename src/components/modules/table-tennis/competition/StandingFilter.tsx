import clsx from 'clsx';
import { TwBorderLinearBox, TwTabHead } from '@/components/modules/common';

type StandingStableProps = {
  filterLabel: string[];
  standingFilter: string;
  setStandingFilter: (value: string) => void;
};

export const StandingFilter: React.FC<StandingStableProps> = ({
  filterLabel = [],
  standingFilter,
  setStandingFilter,
}) => {
  return (
    <TwTabHead className='!w-fit !justify-start'>
      {filterLabel.map((item) => (
        <TwBorderLinearBox
          key={item}
          className={`h-full w-fit !rounded-full ${
            standingFilter === `${item}` ? 'border-linear-form' : ''
          }`}
        >
          <button
            className={clsx(
              'flex h-full w-fit items-center justify-center rounded-full px-4 ',
              {
                'dark:bg-button-gradient cursor-default bg-dark-button text-white':
                  standingFilter === item,
              }
            )}
            onClick={() =>
              item !== standingFilter ? setStandingFilter(item) : null
            }
          >
            <span className='text-csm'>{item.split('_').pop()}</span>
          </button>
        </TwBorderLinearBox>
      ))}
    </TwTabHead>
  );
};
