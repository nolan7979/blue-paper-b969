import clsx from 'clsx';
import { TwBorderLinearBox, TwTabHead } from '@/components/modules/common';

type StandingStableProps = {
  filterLabel: any[];
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
    <TwTabHead className='!w-fit !justify-start no-scrollbar overflow-x-auto'>
      {filterLabel.map((item:any, idx:number) => (
        <TwBorderLinearBox
          key={`${item?.id}-button-${idx}`}
          className={`h-full w-fit !rounded-full ${
            standingFilter === `${item?.id}` ? 'border-linear-form' : ''
          }`}
        >
          <button
            className={clsx(
              'flex h-full w-fit items-center justify-center rounded-full px-4 ',
              {
                'dark:bg-button-gradient cursor-default bg-dark-button text-white':
                  standingFilter === item?.id,
              }
            )}
            onClick={() =>
              item?.id !== standingFilter ? setStandingFilter(item?.id) : null
            }
          >
            <span className='text-csm truncate max-w-26'>{item?.name.split('_').pop()}</span>
          </button>
        </TwBorderLinearBox>
      ))}
    </TwTabHead>
  );
};
