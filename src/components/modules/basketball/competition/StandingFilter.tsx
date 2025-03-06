import clsx from 'clsx';
import { TwBorderLinearBox, TwTabHead } from '@/components/modules/common';
import TabsSlider from '@/components/common/tabsSlider';

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
  if(filterLabel.length <= 1) return null;
  return (
    <div className='h-8 w-full rounded-full'>
      <TabsSlider id='standings-volleyball' >
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
                  'bg-white dark:bg-dark-head-tab': standingFilter !== item?.id,
                }
              )}
              onClick={() =>
                item?.id !== standingFilter ? setStandingFilter(item?.id) : null
              }
            >
              <span className='text-csm'>{item?.name.split('_').pop()}</span>
            </button>
          </TwBorderLinearBox>
        ))}
      </TabsSlider>
    </div>
  );
};
