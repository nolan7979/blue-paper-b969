import { useMounted } from '@/hooks';
import { useConvertPath } from '@/hooks/useConvertPath';

import WeekView from '@/components/filters/WeekFilter';
import { MainMatchFilter } from '@/components/layout/MainMatchFilter';
import { SPORT } from '@/constant/common';
import React from 'react';

export const FilterMainColHeader: React.FC<{ inputId?: string }> = ({
  inputId,
}) => {
  const path = useConvertPath();
  const { isMounted } = useMounted();

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <div className='flex justify-between'>
        <div className='flex w-full items-center p-2.5 dark:bg-dark-score md:pb-0 lg:hidden bg-light-main'>
          <WeekView />
        </div>

        {/* Match filters */}
        <div className='hidden w-full lg:inline-block'>
          <MainMatchFilter sport={SPORT.VOLLEYBALL} />
        </div>

        {/* Odds filter */}
        {/* only show on domain '.com' */}
        {/* <div className='flex items-center justify-center gap-x-1'>
          {isShowOdds(path) && (
            <div className='pb-3'>
              <OddsToggler inputId={inputId} />
            </div>
          )}
          <TLKSettingsPopOver />
        </div> */}
      </div>
    </>
  );
};
